import { inngest } from "./client";
import { openai, createAgent, createTool, createNetwork } from "@inngest/agent-kit";
import { LocalSandbox as Sandbox } from "../lib/LocalSandbox";
import { z } from "zod";
import { systemPrompt } from "../prompt";
import { lastAssistantTextMessageContent } from "./utils";
import db from "@/lib/db";
import { MessageRole, MessageType } from "@prisma/client";

export const codeAgentfunction = inngest.createFunction(
  { id: "code-agent" },
  { event: "code-agent/run" },

  async ({ event, step }) => {
    // Step 1: Create the sandbox using the pre-built template
    const sandboxId = await step.run("create-sandbox", async () => {
      const sandbox = await Sandbox.create({
        template: "4k6nccsrn26zo2a4uuvt",
        timeoutMs: 3600000, // 1 hour
      });
      return sandbox.sandboxId;
    });

    const codeAgent = createAgent({
      name: "code-agent",
      description: "An expert coding agent",
      system: systemPrompt,
      model: openai({ model: "gpt-4o-mini" }),
      tools: [
        // Terminal tool to run commands
        createTool({
          name: "terminal",
          description: "Run a command in the terminal",
          parameters: z.object({
            command: z.string().describe("The command to run in the terminal"),
          }),
          handler: async ({ command }) => {
            return await step?.run("terminal", async () => {
              const buffers = { stdout: "", stderr: "" };
              try {
                const sandbox = await Sandbox.connect(sandboxId);
                const result = await sandbox.commands.run(command, {
                  onStdout: (data) => {
                    buffers.stdout += data;
                  },
                  onStderr: (data) => {
                    buffers.stderr += data;
                  },
                });
                return `stdout: ${buffers.stdout}\nstderr: ${buffers.stderr}`;
              } catch (error) {
                console.error(`Command failed : ${error} \n ${buffers.stdout} \n ${buffers.stderr}`);
                return `Command failed : ${error} \n ${buffers.stdout} \n ${buffers.stderr}`;
              }
            });
          },
        }),
        // Tool to create or update files
        createTool({
          name: "createOrUpdateFiles",
          description: "Create or update files in the sandbox",
          parameters: z.object({
            files: z.array(
              z.object({
                path: z.string().describe("The path to the file"),
                content: z.string().describe("The content of the file"),
              })
            ),
          }),
          handler: async ({ files }, { network }) => {
            const newFiles = await step?.run("createOrUpdateFiles", async () => {
              try {
                const updatedFiles = network?.state?.data?.files || {};
                const sandbox = await Sandbox.connect(sandboxId);

                for (const file of files) {
                  // Local sandbox doesn't need /home/user prefix
                  await sandbox.files.write(file.path, file.content);
                  updatedFiles[file.path] = file.content;
                }
                return updatedFiles;
              } catch (error) {
                console.error(`Failed to create or update files : ${error}`);
                return `Failed to create or update files : ${error}`;
              }
            });
            if (typeof newFiles === "object" && network?.state?.data) {
              network.state.data.files = newFiles;
            }
            return newFiles;
          },
        }),
        // Tool to read files
        createTool({
          name: "readFile",
          description: "Read a file from the sandbox",
          parameters: z.object({
            files: z.array(
              z.object({
                path: z.string().describe("The path to the file"),
              })
            ).describe("Array of files to read"),
          }),
          handler: async ({ files }) => {
            return await step?.run("readFile", async () => {
              try {
                const sandbox = await Sandbox.connect(sandboxId);
                const results = [];
                for (const file of files) {
                  const content = await sandbox.files.read(file.path);
                  results.push({ path: file.path, content });
                }
                return JSON.stringify(results);
              } catch (error) {
                console.error(`Failed to read file : ${error}`);
                return `Failed to read file : ${error}`;
              }
            });
          },
        }),
      ],
      lifecycle: {
        onResponse: async ({ result, network }) => {
          const lastAssistantMessageText = lastAssistantTextMessageContent(result);
          if (lastAssistantMessageText && network) {
            if (lastAssistantMessageText.includes("<task_summary>")) {
              network.state.data.summary = lastAssistantMessageText;
            }
          }
          return result;
        }
      }
    });

    const network = createNetwork({
      name: "coding-agent-network",
      agents: [codeAgent],
      maxIter: 10,
      router: async ({ network }) => {
        // Initialize data if it doesn't exist
        if (!network.state.data) {
          network.state.data = { files: {}, summary: "" };
        }
        const summary = network?.state?.data?.summary;
        if (summary) return;
        return codeAgent;
      },
    });

    // Run the agent network
    const result = await network.run(event.data.value);

    // Auto-detect and install missing dependencies
    await step.run("auto-install-dependencies", async () => {
      const files = result?.state?.data?.files || {};
      const packages = new Set();
      const importRegex = /from\s+['"]([^'"]+)['"]/g;

      for (const filePath in files) {
        const content = files[filePath];
        let match;
        while ((match = importRegex.exec(content)) !== null) {
          const importPath = match[1];
          // Filter out local imports and the @ alias
          if (!importPath.startsWith(".") && !importPath.startsWith("/") && !importPath.startsWith("@/")) {
            const parts = importPath.split("/");
            const packageName = importPath.startsWith("@") ? `${parts[0]}/${parts[1]}` : parts[0];
            
            // Skip known pre-installed packages to save time
            const preInstalled = ["react", "react-dom", "next", "lucide-react", "tailwind-merge", "clsx", "class-variance-authority"];
            if (!preInstalled.includes(packageName)) {
              packages.add(packageName);
            }
          }
        }
      }

      if (packages.size > 0) {
        const packageList = Array.from(packages).join(" ");
        const sandbox = await Sandbox.connect(sandboxId);
        console.log(`[Auto-Install] Detected dependencies: ${packageList}`);
        await sandbox.commands.run(`npm install ${packageList} --yes`);
      }
    });

    const isError =
      !result?.state?.data?.summary || Object.keys(result?.state?.data?.files || {}).length === 0;

    //  Retrieve the Sandbox URL
    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await Sandbox.connect(sandboxId);

      const host = sandbox.getHost(3000);
      return `http://${host}`;
    });

    // Step 3: Persist results to the database
    await step.run("save-result", async () => {
      if (isError) {
        return await db.message.create({
          data: {
            projectId: event.data.projectId,
            role: MessageRole.ASSISTANT,
            content: "Something went wrong. Please try again.",
            type: MessageType.ERROR
          }
        });
      }

      await db.message.create({
        data: {
          projectId: event.data.projectId,
          role: MessageRole.ASSISTANT,
          content: result?.state?.data?.summary,
          type: MessageType.RESULT,
          fragments: {
            create: {
              sandboxUrl: sandboxUrl,
              sandboxId: sandboxId,
              title: "untitled",
              files: result?.state?.data?.files
            }
          }
        }
      });
    });

    return {
      url: sandboxUrl,
      title: "untitled",
      summary: result?.state?.data?.summary,
      files: result?.state?.data?.files,
      isError,
    };
  },
);
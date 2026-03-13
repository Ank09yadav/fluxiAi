import { inngest } from "./client";
import { openai, createAgent, createTool, createNetwork } from "@inngest/agent-kit";
import { Sandbox } from "e2b";
import { z } from "zod";
import { systemPrompt } from "../prompt";
import { lastAssistantTextMessageContent } from "./utils";
import db from "@/lib/db";
import { MessageRole, MessageType } from "@prisma/client";

export const codeAgentfunction = inngest.createFunction(
  { id: "code-agent" },
  { event: "code-agent/run" },

  async ({ event, step }) => {
    //step-1
    const sandboxId = await step.run("create-sandbox", async () => {
      const sandbox = await Sandbox.create({
        template: "fluxiai",
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
        // terminal
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
        // createOrUpdateFiles
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
        // readFile
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
        const summary = network?.state?.data?.summary;
        if (summary) {
          return;
        }
        return codeAgent;
      },
    });

    const result = await network.run(event.data.value);
    const isError =
      !result?.state?.data?.summary || Object.keys(result?.state?.data?.files || {}).length === 0;

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await Sandbox.connect(sandboxId);
      
      // Start the dev server in the background so it doesn't block
      await sandbox.commands.run("npm run dev", { background: true });
      
      // Get the host for port 3000 where Next.js runs
      const host = sandbox.getHost(3000);
      return `http://${host}`;
    });

    await step.run("save-result", async ()=>{
      if(isError){
        return await db.message.create({
          data:{
            projectId:event.data.projectId,
            role:MessageRole.assistant,
            content:"Something went wrong. Please try again.",
            type:MessageType.ERROR
          }
        })

      }
      const message = await db.message.create({
        data:{
          projectId:event.data.projectId,
          role:MessageRole.assistant,
          content:result?.state?.data?.summary,
          type:MessageType.RESULT,
          fragments:{
            create:{
              sandboxUrl:sandboxUrl,
              title:"untitled",
              files:result?.state?.data?.files
            }
          }
        }
      })
      
    })

    return {
      url: sandboxUrl,
      title: "untitled",
      summary: result?.state?.data?.summary,
      files: result?.state?.data?.files,
      isError,
    };
  },
);
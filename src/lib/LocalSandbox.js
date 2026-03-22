import fs from "node:fs";
import path from "node:path";
import { spawn, execSync } from "node:child_process";
import crypto from "node:crypto";

const BASE_DIR = path.resolve(process.cwd(), "local-sandboxes");
const TEMPLATE_DIR = path.resolve(process.cwd(), "sandbox-templates/next-js/template");
const START_PORT = 3100;

export class LocalSandbox {
  constructor(sandboxId, port) {
    this.sandboxId = sandboxId;
    this.port = port;
    this.localPath = path.join(BASE_DIR, sandboxId);
    
    // Mimic E2B structure
    this.commands = {
      run: this._runCommand.bind(this),
    };
    this.files = {
      write: this._writeFile.bind(this),
      read: this._readFile.bind(this),
    };
  }

  static async create({ template, timeoutMs } = {}) {
    if (!fs.existsSync(BASE_DIR)) {
      fs.mkdirSync(BASE_DIR, { recursive: true });
    }

    const sandboxId = crypto.randomUUID();
    const sandboxPath = path.join(BASE_DIR, sandboxId);

    // 1. Copy template (excluding node_modules for performance)
    console.log(`Creating sandbox ${sandboxId} from template...`);
    fs.cpSync(TEMPLATE_DIR, sandboxPath, { 
      recursive: true,
      filter: (src) => !src.includes("node_modules")
    });

    // 2. Create a Junction (symlink) for node_modules to save space and time
    const templateModules = path.join(TEMPLATE_DIR, "node_modules");
    const targetModules = path.join(sandboxPath, "node_modules");
    if (fs.existsSync(templateModules)) {
      try {
        fs.symlinkSync(templateModules, targetModules, "junction");
      } catch (err) {
        console.warn("Failed to create junction, falling back to copy:", err);
        fs.cpSync(templateModules, targetModules, { recursive: true });
      }
    }

    // 3. Assign Port
    const port = await this._findFreePort(START_PORT);
    fs.writeFileSync(path.join(sandboxPath, ".sandbox_metadata.json"), JSON.stringify({ port, sandboxId }));

    const sandbox = new LocalSandbox(sandboxId, port);
    
    // 4. Start Dev Server in background
    console.log(`Starting dev server on port ${port}...`);
    sandbox._startDevServer(port);

    return sandbox;
  }

  static async connect(sandboxId) {
    const sandboxPath = path.join(BASE_DIR, sandboxId);
    const metadataPath = path.join(sandboxPath, ".sandbox_metadata.json");
    
    if (!fs.existsSync(metadataPath)) {
      throw new Error(`Sandbox ${sandboxId} not found or not initialized.`);
    }

    const { port } = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));
    return new LocalSandbox(sandboxId, port);
  }

  getHost(portArg) {
    // Ignores portArg if we want to use the assigned one, or merges it.
    // In our case, Next.js is running on this.port.
    return `localhost:${this.port}`;
  }

  async _runCommand(command, options = {}) {
    return new Promise((resolve) => {
      const { onStdout, onStderr } = options;
      console.log(`[Sandbox ${this.sandboxId}] Running: ${command}`);

      // We use shell: true to handle commands like 'npm run dev' on Windows
      const proc = spawn(command, [], {
        cwd: this.localPath,
        shell: true,
      });

      let stdout = "";
      let stderr = "";

      proc.stdout.on("data", (data) => {
        const str = data.toString();
        stdout += str;
        if (onStdout) onStdout(str);
      });

      proc.stderr.on("data", (data) => {
        const str = data.toString();
        stderr += str;
        if (onStderr) onStderr(str);
      });

      proc.on("close", (code) => {
        resolve({ stdout, stderr, exitCode: code });
      });
      
      proc.on("error", (err) => {
        resolve({ stdout, stderr, exitCode: 1, error: err });
      });
    });
  }

  async _writeFile(filePath, content) {
    const fullPath = path.join(this.localPath, filePath);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(fullPath, content);
  }

  async _readFile(filePath) {
    const fullPath = path.join(this.localPath, filePath);
    return fs.readFileSync(fullPath, "utf-8");
  }

  _startDevServer(port) {
    const devCommand = `npm run dev -- -p ${port}`;
    const logPath = path.join(this.localPath, ".dev_server.log");
    const logStream = fs.createWriteStream(logPath, { flags: 'a' });

    const child = spawn(devCommand, [], {
      cwd: this.localPath,
      shell: true,
      detached: true,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    child.stdout.pipe(logStream);
    child.stderr.pipe(logStream);

    child.unref(); // Allow the parent process to exit independently
    
    // Save PID to metadata if we want to kill it later
    const metadataPath = path.join(this.localPath, ".sandbox_metadata.json");
    const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));
    metadata.pid = child.pid;
    fs.writeFileSync(metadataPath, JSON.stringify(metadata));
  }

  static async _findFreePort(startPort) {
    let port = startPort;
    const isPortInUse = (p) => {
      try {
        // Simple check: see if we have a metadata file with this port in BASE_DIR
        // Or more robust: try to bind to it (omitted for brevity, using directory scan)
        const files = fs.readdirSync(BASE_DIR);
        for (const file of files) {
          const metaPath = path.join(BASE_DIR, file, ".sandbox_metadata.json");
          if (fs.existsSync(metaPath)) {
            const { port: usedPort } = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
            if (usedPort === p) return true;
          }
        }
        return false;
      } catch (e) {
        return false;
      }
    };

    while (isPortInUse(port)) {
      port++;
    }
    return port;
  }
}

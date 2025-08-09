import { Command } from '@tauri-apps/plugin-shell';
import type {
  Provider,
  Detection,
  LoginStatus,
  SessionOpts,
  SessionHandle,
  ExecInput,
  ExecResult,
  McpServerCfg,
  McpHandle,
} from './types';

async function runCommand(cmd: string, args: string[]): Promise<{ code: number; stdout: string; stderr: string }> {
  const command = Command.create(cmd, args);
  const output = await command.execute();
  return {
    code: output.code ?? -1,
    stdout: output.stdout,
    stderr: output.stderr,
  };
}

export const claudeProvider: Provider = {
  id: 'claude',
  binaryName: 'claude',
  async detect(): Promise<Detection> {
    try {
      const { code, stdout } = await runCommand('claude', ['--version']);
      return { available: code === 0, version: stdout.trim(), path: 'claude' };
    } catch (e) {
      return { available: false, error: e instanceof Error ? e.message : String(e) };
    }
  },
  async ensureLogin(): Promise<LoginStatus> {
    try {
      const who = await runCommand('claude', ['whoami']);
      if (who.code === 0) {
        return { loggedIn: true, message: who.stdout.trim() };
      }
      await runCommand('claude', ['login']);
      return { loggedIn: true };
    } catch (e) {
      return { loggedIn: false, message: e instanceof Error ? e.message : String(e) };
    }
  },
  async startSession(opts: SessionOpts): Promise<SessionHandle> {
    const child = await Command.create('claude', [], {
      cwd: opts.cwd,
      env: opts.env,
    }).spawn();
    return { pid: child.pid ?? 0 };
  },
  async exec(input: ExecInput): Promise<ExecResult> {
    const args = Array.isArray(input) ? input : [input];
    const { code, stdout, stderr } = await runCommand('claude', args);
    return { code, stdout, stderr };
  },
  mcp: {
    canServe: true,
    async startServer(_cfg: McpServerCfg): Promise<McpHandle> {
      const child = await Command.create('claude', ['mcp', 'serve']).spawn();
      const pid = child.pid ?? 0;
      // Port discovery would require parsing output; use default 0 for now
      return { pid, port: 0 };
    },
    clientConfig() {
      return {};
    },
  },
};

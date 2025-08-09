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

export const geminiProvider: Provider = {
  id: 'gemini',
  binaryName: 'gemini',
  async detect(): Promise<Detection> {
    try {
      const { code, stdout } = await runCommand('gemini', ['--version']);
      return { available: code === 0, version: stdout.trim(), path: 'gemini' };
    } catch (e) {
      return { available: false, error: e instanceof Error ? e.message : String(e) };
    }
  },
  async ensureLogin(): Promise<LoginStatus> {
    try {
      const who = await runCommand('gemini', ['whoami']);
      if (who.code === 0) {
        return { loggedIn: true, message: who.stdout.trim() };
      }
      await runCommand('gemini', ['login']);
      return { loggedIn: true };
    } catch (e) {
      return { loggedIn: false, message: e instanceof Error ? e.message : String(e) };
    }
  },
  async startSession(opts: SessionOpts): Promise<SessionHandle> {
    const child = await Command.create('gemini', [], {
      cwd: opts.cwd,
      env: opts.env,
    }).spawn();
    return { pid: child.pid ?? 0 };
  },
  async exec(input: ExecInput): Promise<ExecResult> {
    const args = Array.isArray(input) ? input : [input];
    const { code, stdout, stderr } = await runCommand('gemini', args);
    return { code, stdout, stderr };
  },
  mcp: {
    canServe: false,
    async startServer(_cfg: McpServerCfg): Promise<McpHandle> {
      throw new Error('Gemini CLI does not provide a native MCP server');
    },
    clientConfig() {
      return {};
    },
  },
};

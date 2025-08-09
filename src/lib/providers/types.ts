export type ProviderId = 'claude' | 'codex' | 'gemini';

export interface Detection {
  available: boolean;
  version?: string;
  path?: string;
  error?: string;
}

export interface LoginStatus {
  loggedIn: boolean;
  message?: string;
}

export interface SessionOpts {
  cwd?: string;
  env?: Record<string, string>;
}

export interface SessionHandle {
  pid: number;
}

export type ExecInput = string | string[];

export interface ExecResult {
  stdout: string;
  stderr: string;
  code: number;
}

export interface McpServerCfg {
  port?: number;
  env?: Record<string, string>;
}

export interface McpHandle {
  pid: number;
  port: number;
}

export interface McpClientCfg {
  [key: string]: any;
}

export interface Provider {
  id: ProviderId;
  binaryName: string;
  detect(): Promise<Detection>;
  ensureLogin(): Promise<LoginStatus>;
  startSession(opts: SessionOpts): Promise<SessionHandle>;
  exec(input: ExecInput): Promise<ExecResult>;
  mcp: {
    canServe: boolean;
    startServer(cfg: McpServerCfg): Promise<McpHandle>;
    clientConfig: () => McpClientCfg;
  };
}

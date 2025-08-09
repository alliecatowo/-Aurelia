# Providers

Aurelia talks to Claude, Codex, and Gemini CLIs through a common `Provider` interface. Each provider wraps the corresponding binary and handles detection, login, one-shot execution, and optional MCP server startup.

## Supported CLIs

- **claude** – native login and can serve MCP via `claude mcp serve`.
- **codex** – authenticates with a ChatGPT plan and reads config from `~/.codex/config.toml`. Experimental MCP server available with `codex mcp`.
- **gemini** – uses Google account sign-in with quotas stored in `~/.gemini/settings.json`. The CLI consumes MCP servers but does not currently expose one.

## Provider API

```ts
export interface Provider {
  id: 'claude' | 'codex' | 'gemini';
  binaryName: string;
  detect(): Promise<Detection>;
  ensureLogin(): Promise<LoginStatus>;
  startSession(opts: SessionOpts): Promise<SessionHandle>;
  exec(input: ExecInput): Promise<ExecResult>;
  mcp: {
    canServe: boolean;
    startServer(cfg: McpServerCfg): Promise<McpHandle>;
    clientConfig(): McpClientCfg;
  };
}
```

`detect` checks for the binary by running `--version`. `ensureLogin` leverages the CLI's own authentication flow so users sign in with their existing accounts—no raw API keys.

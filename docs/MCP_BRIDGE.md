# MCP Bridge

Aurelia can connect providers so one CLI can invoke another as a tool through the Model Context Protocol (MCP). Providers expose `startServer` and `clientConfig` helpers; Aurelia wires them together while guarding against recursion.

## Configuration examples

### Codex consuming Claude tools

```toml
[mcp_servers.claude]
command = "claude"
args = ["mcp", "serve"]
```

### Gemini consuming Codex tools

```json
{
  "mcpServers": {
    "codex": {
      "command": "codex",
      "args": ["mcp"]
    }
  }
}
```

Aurelia tags each MCP request with origin and depth metadata (`aurelia-origin`, `aurelia-depth`) so providers only perform a single cross-call and drop recursive requests.

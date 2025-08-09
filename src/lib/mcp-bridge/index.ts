import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import * as toml from '@iarna/toml';

export async function configureCodexServer(
  name: string,
  command: string,
  args: string[] = []
) {
  const home = os.homedir();
  const file = path.join(home, '.codex', 'config.toml');
  let raw = '';
  try {
    raw = await fs.readFile(file, 'utf8');
  } catch {
    raw = '';
  }
  let cfg: any = {};
  try {
    cfg = raw ? toml.parse(raw) : {};
  } catch {
    cfg = {};
  }
  cfg.mcp_servers = cfg.mcp_servers || {};
  cfg.mcp_servers[name] = { command, args };
  const tomlString = toml.stringify(cfg);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, tomlString, 'utf8');
}

export async function configureGeminiServer(
  name: string,
  command: string,
  args: string[] = []
) {
  const home = os.homedir();
  const file = path.join(home, '.gemini', 'settings.json');
  let raw = '{}';
  try {
    raw = await fs.readFile(file, 'utf8');
  } catch {
    raw = '{}';
  }
  let cfg: any;
  try {
    cfg = JSON.parse(raw);
  } catch {
    cfg = {};
  }
  cfg.mcpServers = cfg.mcpServers || {};
  cfg.mcpServers[name] = { command, args };
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(cfg, null, 2), 'utf8');
}


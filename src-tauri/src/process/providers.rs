use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use tokio::process::Child;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Detection {
    pub available: bool,
    pub version: Option<String>,
    pub path: Option<String>,
    pub error: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LoginStatus {
    pub logged_in: bool,
    pub message: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct SessionOpts {
    pub cwd: Option<String>,
    pub env: Option<HashMap<String, String>>,
}

#[derive(Debug)]
pub struct SessionHandle {
    pub child: Child,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExecArgs {
    pub command: String,
    pub args: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExecOutput {
    pub stdout: String,
    pub stderr: String,
    pub code: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct McpCfg {
    pub port: Option<u16>,
    pub env: Option<HashMap<String, String>>,
}

#[derive(Debug)]
pub struct McpProc {
    pub child: Child,
    pub port: u16,
}

pub trait Provider {
    fn detect(&self) -> Result<Detection, String>;
    fn ensure_login(&self) -> Result<LoginStatus, String>;
    fn start_session(&self, opts: SessionOpts) -> Result<SessionHandle, String>;
    fn exec(&self, args: ExecArgs) -> Result<ExecOutput, String>;
    fn start_mcp_server(&self, cfg: McpCfg) -> Result<McpProc, String>;
}

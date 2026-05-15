const getTools = () => {
  return [
    {
      type: "function",
      function: {
        name: "shell",
        description: "__T_TOOL_SHELL_DESCRIPTION__",
        parameters: {
          type: "object",
          properties: {
            command: {
              type: "string",
              description: "__T_TOOL_SHELL_COMMAND_DESCRIPTION__"
            },
            reason: {
              type: "string",
              description: "__T_TOOL_SHELL_REASON_DESCRIPTION__"
            },
            timeout: {
              type: "number",
              description: "__T_TOOL_SHELL_TIMEOUT_DESCRIPTION__"
            },
            cwd: {
              type: "string",
              description: "__T_TOOL_SHELL_CWD_DESCRIPTION__"
            }
          },
          required: ["command", "reason"]
        }
      }
    }
  ];
};

export {
  getTools
};

const tools = ({
  enableToolResultTruncate,
  toolResultMaxChars,
  enableToolLoopLimit,
  toolMaxRounds
}) => {
  return `

## __T_PROMPT_TOOLS_TITLE__
- __T_PROMPT_TOOLS_RESULT_TRUNCATION__: ${enableToolResultTruncate ? "__T_PROMPT_ENABLED__" : "__T_PROMPT_DISABLED__"}
- __T_PROMPT_TOOLS_MAX_RESULT_LENGTH__: ${toolResultMaxChars ?? "-"}
- __T_PROMPT_TOOLS_LOOP_LIMIT__: ${enableToolLoopLimit ? "__T_PROMPT_ENABLED__" : "__T_PROMPT_DISABLED__"}
- __T_PROMPT_TOOLS_MAX_ROUNDS__: ${toolMaxRounds ?? "-"}`;
};
export {
  tools
};

const model = ({ provider, name, apiUrl }) => {
  return `

## __T_PROMPT_MODEL_TITLE__
- __T_PROMPT_MODEL_PROVIDER__: ${provider || "-"}
- __T_PROMPT_MODEL_NAME__: ${name || "-"}
- __T_PROMPT_MODEL_API_URL__: ${apiUrl || "-"}`;
};
export {
  model
};

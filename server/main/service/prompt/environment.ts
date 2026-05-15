const environment = (cwd) => {
  return `

## __T_PROMPT_ENV_TITLE__
- __T_PROMPT_ENV_PROJECT_ROOT__: ${cwd}
- __T_PROMPT_ENV_SYSTEM_DB__: ${cwd}/database/aios.db (__T_PROMPT_ENV_SYSTEM_DB_DETAIL__)
- __T_PROMPT_ENV_APP_DB_DIR__: ${cwd}/database/apps/ (__T_PROMPT_ENV_APP_DB_DETAIL__)
- __T_PROMPT_ENV_FILES_DIR__: ${cwd}/files/
- __T_PROMPT_ENV_UPLOAD_DIR__: ${cwd}/files/uploads/
- __T_PROMPT_ENV_EXPORT_DIR__: ${cwd}/files/exports/`;
};
export {
  environment
};

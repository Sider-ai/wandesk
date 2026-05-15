import { getConfig, saveConfig } from "../repository/config.js";
const saveExchange = (body: any = {}) => {
  const cfg = getConfig();
  const apiKey = String(body.api_key ?? "").trim();
  const apiSecret = String(body.api_secret ?? "").trim();
  const passphrase = String(body.passphrase ?? "").trim();
  if (!apiKey || !apiSecret || !passphrase) {
    throw new Error("API Key, Secret, and Passphrase are required");
  }
  saveConfig({
    base_url: String(cfg.base_url || "").trim(),
    api_key: apiKey,
    api_secret: apiSecret,
    passphrase
  });
  return { success: true };
};
export {
  saveExchange
};

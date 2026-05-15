import { normalizeLlmPayload } from "./input/index.js";
import { parseRegularResponse } from "./output/regular.js";
import { parseStreamResponse } from "./output/stream.js";
import { providers } from "./providers.js";

const resolveLlmProvider = ({ provider, apiUrl, model } : any = {}) => {
  const config = {
    provider: String(provider || "").trim(),
    apiUrl: String(apiUrl || "").trim(),
    model: String(model || "").trim()
  };

  return providers.find((item) => item.match?.(config)) ||
    providers.find((item) => item.id === config.provider) ||
    providers.find((item) => item.id === "openai");
};

const resolveLlmPipeline = (config: any = {}) => {
  const provider = resolveLlmProvider(config);
  return {
    provider,
    requester: provider.pipeline.requester,
    input: provider.pipeline.input,
    output: provider.pipeline.output,
    capabilities: provider.capabilities
  };
};

const callLlmRegular = async (apiUrl, apiKey, payload, { provider, signal }: any = {}) => {
  const pipeline = resolveLlmPipeline({ provider, apiUrl, model: payload?.model });
  const llmPayload = normalizeLlmPayload(payload, pipeline.input);
  const res = await fetch(apiUrl, pipeline.requester.buildRegularRequest({
    apiKey,
    apiUrl,
    payload: llmPayload,
    signal
  }));
  return parseRegularResponse(res);
};

const callLlmStream = async (apiUrl, apiKey, payload, { provider, signal, onDelta }: any = {}) => {
  const pipeline = resolveLlmPipeline({ provider, apiUrl, model: payload?.model });
  const llmPayload = normalizeLlmPayload(payload, pipeline.input);
  const res = await fetch(apiUrl, pipeline.requester.buildStreamRequest({
    apiKey,
    apiUrl,
    payload: llmPayload,
    signal
  }));
  return parseStreamResponse(res, pipeline.output, onDelta);
};

export { callLlmRegular, callLlmStream, resolveLlmPipeline, resolveLlmProvider };

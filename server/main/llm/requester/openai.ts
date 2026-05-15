const buildHeaders = (apiKey, apiUrl) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`
  };

  if (String(apiUrl || "").includes("openrouter.ai")) {
    headers["HTTP-Referer"] = "http://localhost:3000";
    headers["X-Title"] = "agent-cli";
  }

  return headers;
};

const buildRegularRequest = ({ apiKey, apiUrl, payload, signal }) => ({
  method: "POST",
  headers: buildHeaders(apiKey, apiUrl),
  body: JSON.stringify(payload),
  signal
});

const buildStreamRequest = ({ apiKey, apiUrl, payload, signal }) => ({
  method: "POST",
  headers: buildHeaders(apiKey, apiUrl),
  body: JSON.stringify({
    ...payload,
    stream: true,
    stream_options: {
      include_usage: true
    }
  }),
  signal
});

const openaiRequester = {
  buildRegularRequest,
  buildStreamRequest
};

export { openaiRequester };

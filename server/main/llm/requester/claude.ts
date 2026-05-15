const buildHeaders = (apiKey) => ({
  "Content-Type": "application/json",
  "x-api-key": apiKey,
  "anthropic-version": "2023-06-01"
});

const buildRegularRequest = ({ apiKey, payload, signal }) => ({
  method: "POST",
  headers: buildHeaders(apiKey),
  body: JSON.stringify(payload),
  signal
});

const buildStreamRequest = ({ apiKey, payload, signal }) => ({
  method: "POST",
  headers: buildHeaders(apiKey),
  body: JSON.stringify({
    ...payload,
    stream: true
  }),
  signal
});

const claudeRequester = {
  buildRegularRequest,
  buildStreamRequest
};

export { claudeRequester };

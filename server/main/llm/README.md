# LLM

`server/main/llm` 负责统一管理大模型调用管线。这里不放业务逻辑，只处理模型调用需要的 provider 数据、请求构建、输入整理、输出解析和调用控制。

## 目录结构

```text
llm/
  README.md
  index.js
  providers.js
  utils.js

  input/
    index.js
    normalizers/
      openai.js
      deepseek.js
      kimi.js
      gemini.js

  requester/
    openai.js
    claude.js

  output/
    regular.js
    stream.js
    usage.js
    parsers/
      openai.js
      deepseek.js
      kimi.js
      gemini.js
```

## 顶层文件

### `index.js`

LLM 模块对外入口，也是调用管线的控制层。

业务代码应该从这里引入 LLM 能力，不直接引用内部目录。

`index.js` 根据本次请求的 `provider`、`apiUrl`、`model` 选择对应的管线能力：

- `requester`：怎么发请求
- `input`：怎么整理发送给模型的数据
- `output`：怎么解析模型返回的数据
- `capabilities`：模型能力声明

### `providers.js`

模型和 provider 数据源。

这里维护：

- provider 列表
- provider 分组
- 默认模型
- API 地址
- Key 获取地址
- provider 匹配规则
- provider 对应的管线
- provider 能力声明

前端模型列表也应该从这里暴露的 API 读取，不再维护另一份模型数据。

### `utils.js`

LLM 模块内部通用小工具。

目前用于放和具体 provider 无关的基础工具，例如 JSON 解析辅助。

## `input/`

输入处理层。

只负责把业务侧保存的消息和 payload 整理成模型接口需要的格式，不负责发请求，也不负责解析返回。

### `input/index.js`

输入处理入口。

根据 `index.js` 选出的 provider 管线，调用对应 normalizer 整理 payload。

### `input/normalizers/`

不同 provider 的输入整理器。

每个文件只处理对应 provider 的输入差异：

- `openai.js`：OpenAI 格式
- `deepseek.js`：DeepSeek 格式
- `kimi.js`：Kimi 格式
- `gemini.js`：Gemini 格式

## `requester/`

请求构建层。

只负责把已经整理好的 payload 变成 `fetch` 需要的 request options。

这里处理：

- HTTP method
- headers
- body
- stream 参数
- provider 请求协议差异

### `requester/openai.js`

OpenAI 风格请求构建器。

适用于 OpenAI 接口格式，以及走 OpenAI 风格接口的 provider。

### `requester/claude.js`

Claude 请求构建器。

用于处理 Claude 请求头和请求参数结构。

## `output/`

输出处理层。

只负责把模型返回结果解析成 AIOS 内部使用的 assistant message，不负责输入整理，也不负责选择 provider。

### `output/regular.js`

非流式响应处理。

负责解析普通 JSON 返回结果。

### `output/stream.js`

流式响应处理。

负责读取 SSE stream，并把每个 chunk 交给 provider parser。

### `output/usage.js`

Token 用量统计整理。

把不同返回里的 usage 字段整理成统一结构。

### `output/parsers/`

不同 provider 的流式输出解析器。

每个文件只处理对应 provider 的输出差异：

- `openai.js`：OpenAI chunk 解析
- `deepseek.js`：DeepSeek chunk 解析，包含 `reasoning_content`
- `kimi.js`：Kimi chunk 解析
- `gemini.js`：Gemini chunk 解析

## 调用流

```text
业务代码
  -> llm/index.js
  -> index.js 选择 provider 管线
  -> input/ 整理请求 payload
  -> requester/ 构建 fetch request
  -> output/ 解析模型返回
  -> 返回 assistant message
```

/**
 * 默认数据
 */
const defaultData = [
  { modelName: "OpenAI GPT-4o-2024-08-06", inputPrice: 0.0025, outputPrice: 0.01 },
  { modelName: "OpenAI GPT-4o", inputPrice: 0.005, outputPrice: 0.015 },
  { modelName: "OpenAI GPT-4o mini", inputPrice: 0.00015, outputPrice: 0.0006 },
  { modelName: "OpenAI / Azure GPT-4 Turbo", inputPrice: 0.01, outputPrice: 0.03 },
  { modelName: "OpenAI / Azure GPT-3.5 Turbo", inputPrice: 0.0005, outputPrice: 0.0015 },
  { modelName: "OpenAI / Azure GPT-4", inputPrice: 0.03, outputPrice: 0.06 },
  { modelName: "Anthropic Claude 3.5 Sonnet", inputPrice: 0.003, outputPrice: 0.015 },
  { modelName: "Anthropic Claude 3 Opus", inputPrice: 0.015, outputPrice: 0.075 },
  { modelName: "Anthropic Claude 3 Haiku", inputPrice: 0.00025, outputPrice: 0.00125 },
  { modelName: "Meta (via Deepinfra) Llama 3.1 405b", inputPrice: 0.0027, outputPrice: 0.0027 },
  { modelName: "Meta (via Deepinfra) Llama 3.1 70b", inputPrice: 0.00059, outputPrice: 0.00079 },
  { modelName: "Meta (via Deepinfra/Groq) Llama 3 70b", inputPrice: 0.00059, outputPrice: 0.00079 },
  { modelName: "Google Gemini 1.5 Flash", inputPrice: 0.000075, outputPrice: 0.00003 },
  { modelName: "Google Gemini 1.5 Flash 1M", inputPrice: 0.000015, outputPrice: 0.00006 },
  { modelName: "Google Gemini 1.5 Pro", inputPrice: 0.0035, outputPrice: 0.0105 },
  { modelName: "Google Gemini 1.5 Pro 2M", inputPrice: 0.007, outputPrice: 0.021 },
  { modelName: "Google Gemini 1.0 Pro", inputPrice: 0.0005, outputPrice: 0.0015 },
  { modelName: "Cohere Command", inputPrice: 0.01, outputPrice: 0.02 },
  { modelName: "Cohere Command R", inputPrice: 0.0005, outputPrice: 0.0015 },
  { modelName: "Cohere Command R+", inputPrice: 0.003, outputPrice: 0.015 },
  { modelName: "Mistral AI (via Anyscale) Mixtral 8x7B", inputPrice: 0.0005, outputPrice: 0.0005 },
  { modelName: "Mistral AI Mistral Small", inputPrice: 0.002, outputPrice: 0.006 },
  { modelName: "Mistral AI Mistral Large", inputPrice: 0.008, outputPrice: 0.024 },
  { modelName: "DataBricks DBRX", inputPrice: 0.00225, outputPrice: 0.00675 },

  // Fine-tuning models
  { modelName: "OpenAI GPT-3.5 Turbo Fine-Tuning", inputPrice: 0.012, outputPrice: 0.016 },
  { modelName: "Google PaLM 2 Fine-Tuning", inputPrice: 0.002, outputPrice: 0.002 },

  // Embedding models
  { modelName: "OpenAI / Azure 3 Small Embedding", inputPrice: 0.00002, outputPrice: 0.0000 },
  { modelName: "OpenAI / Azure 3 Large Embedding", inputPrice: 0.00013, outputPrice: 0.0000 },
  { modelName: "OpenAI / Azure Ada v2 Embedding", inputPrice: 0.0001, outputPrice: 0.0000 },
  { modelName: "Google PaLM 2 Embedding", inputPrice: 0.0004, outputPrice: 0.0000 },
  { modelName: "Cohere Embed v3.0", inputPrice: 0.0001, outputPrice: 0.0000 }
];

export default defaultData;
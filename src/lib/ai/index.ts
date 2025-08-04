import { generateCompletion, type ChatMessage, type OpenAIModel } from './openai';
import { generateAnthropicCompletion, type AnthropicMessage, type AnthropicModel } from './anthropic';

export type AIProvider = 'openai' | 'anthropic';
export type AIModel = OpenAIModel | AnthropicModel;

export interface UnifiedMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GenerationRequest {
  provider: AIProvider;
  model: AIModel;
  messages: UnifiedMessage[];
  temperature?: number;
  maxTokens?: number;
  system?: string;
}

export async function generateAIResponse(request: GenerationRequest) {
  const { provider, messages, model, ...options } = request;

  switch (provider) {
    case 'openai':
      return await generateCompletion(messages as ChatMessage[], {
        ...options,
        model: model as OpenAIModel,
      });
    
    case 'anthropic':
      // Convert system message to system prompt for Anthropic
      const systemMessage = messages.find(m => m.role === 'system');
      const userMessages = messages.filter(m => m.role !== 'system') as AnthropicMessage[];
      
      return await generateAnthropicCompletion(userMessages, {
        ...options,
        system: systemMessage?.content || options.system,
        model: model as AnthropicModel,
      });
    
    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
}

export * from './openai';
export * from './anthropic';
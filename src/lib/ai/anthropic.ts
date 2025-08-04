import Anthropic from '@anthropic-ai/sdk';
import { env } from '@/config/env';

export const anthropic = new Anthropic({
  apiKey: env.ANTHROPIC_API_KEY,
});

export type AnthropicModel = 
  | 'claude-3-5-sonnet-20241022'
  | 'claude-3-5-haiku-20241022'
  | 'claude-3-opus-20240229';

export interface AnthropicMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AnthropicOptions {
  model?: AnthropicModel;
  maxTokens?: number;
  temperature?: number;
  system?: string;
}

export async function generateAnthropicCompletion(
  messages: AnthropicMessage[],
  options: AnthropicOptions = {}
) {
  const {
    model = 'claude-3-5-haiku-20241022',
    maxTokens = 1000,
    temperature = 0.7,
    system,
  } = options;

  try {
    const response = await anthropic.messages.create({
      model,
      max_tokens: maxTokens,
      temperature,
      system,
      messages,
    });

    return response;
  } catch (error) {
    console.error('Anthropic API error:', error);
    throw error;
  }
}
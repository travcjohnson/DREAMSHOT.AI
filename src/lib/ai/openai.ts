import OpenAI from 'openai';
import { env } from '@/config/env';

export const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export type OpenAIModel = 
  | 'gpt-4o'
  | 'gpt-4o-mini'
  | 'gpt-4-turbo'
  | 'gpt-3.5-turbo';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GenerationOptions {
  model?: OpenAIModel;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export async function generateCompletion(
  messages: ChatMessage[],
  options: GenerationOptions = {}
) {
  const {
    model = 'gpt-4o-mini',
    temperature = 0.7,
    maxTokens = 1000,
    stream = false,
  } = options;

  try {
    const response = await openai.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
      stream,
    });

    return response;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}

export async function generateImage(
  prompt: string,
  options: {
    model?: 'dall-e-2' | 'dall-e-3';
    size?: '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792';
    quality?: 'standard' | 'hd';
    n?: number;
  } = {}
) {
  const {
    model = 'dall-e-3',
    size = '1024x1024',
    quality = 'standard',
    n = 1,
  } = options;

  try {
    const response = await openai.images.generate({
      model,
      prompt,
      size,
      quality,
      n,
    });

    return response;
  } catch (error) {
    console.error('OpenAI Image API error:', error);
    throw error;
  }
}
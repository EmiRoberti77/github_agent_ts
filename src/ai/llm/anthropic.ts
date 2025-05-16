import { AI_INIT_SYSTEM_PROMPT, ANTHROPIC_API_KEY } from '../../env.js';
import { AIInterface } from './AIInterface.js';
import { Anthropic } from '@anthropic-ai/sdk/client.js';

export class AnthropicHandler implements AIInterface {
  anthropic: Anthropic;
  constructor() {
    this.anthropic = new Anthropic({
      apiKey: ANTHROPIC_API_KEY,
    });
  }
  async callAI(promptInput: string): Promise<string> {
    const response: any = await this.anthropic.messages.create({
      model: 'claude-3-7-sonnet-latest',
      max_tokens: 1024,
      messages: [
        {
          role: 'assistant',
          content: AI_INIT_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: promptInput,
        },
      ],
    });
    return response.content[response.content.length - 1].text as string;
  }
}

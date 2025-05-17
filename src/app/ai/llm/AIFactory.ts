import { AnthropicHandler } from './anthropic.js';
import { OpenAIHandler } from './openai.js';

export enum AI_INSTANCE {
  OPENAI = 'OPENAI',
  ANTHROPIC = 'ANTHROPIC',
}
export class AIFactory {
  public static createAIInstance(instance: AI_INSTANCE) {
    switch (instance) {
      case AI_INSTANCE.OPENAI:
        return new OpenAIHandler();
      case AI_INSTANCE.ANTHROPIC:
        return new AnthropicHandler();
    }
  }
}

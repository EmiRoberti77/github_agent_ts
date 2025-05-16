import { AIInterface } from './AIInterface';

export class AnthropicHandler implements AIInterface {
  constructor() {}
  async callAI(promptInput: string): Promise<string> {
    return 'EMI';
  }
}

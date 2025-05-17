import axios from 'axios';
import { AI_INIT_SYSTEM_PROMPT, OPENAI_API_KEY } from '../../env.js';
import { AIInterface } from './AIInterface.js';

export class OpenAIHandler implements AIInterface {
  constructor() {}

  async callAI(inputPrompt: string) {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: AI_INIT_SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: inputPrompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content;
  }
}

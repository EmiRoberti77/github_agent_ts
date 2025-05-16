import axios from 'axios';
import { OPENAI_API_KEY } from '../../env';
import { AIInterface } from './AIInterface';

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
            content:
              'You are a senior software engineer reviewing a GitHub pull request. Identify bugs, code smells, documentation of code, improvement and suggestions based on the diff provided.',
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

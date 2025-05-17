export interface AIInterface {
  callAI: (promptInput: string) => Promise<string>;
}

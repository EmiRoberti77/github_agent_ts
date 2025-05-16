# 🧠 GitHub AI Pull Request Reviewer

This TypeScript tool integrates **GitHub** and **OpenAI GPT-4** to:

- ✅ Extract pull request diffs from a repository
- ✅ Perform automated **code reviews**
- ✅ Generate **documentation suggestions** based on the diff

---

## 🚀 How It Works

1. **Fetch PR Diff**  
   Retrieves the pull request diff from a GitHub repository using the GitHub API.

2. **Send to OpenAI GPT-4**  
   Submits the diff to OpenAI for:

   - Code **review**
   - **Documentation** generation

3. **Receive Suggestions**  
   Logs the generated review or documentation to the console.

---

## 🛠️ Environment Variables

Create a `.env` file in the project root with the following variables:

```env
GITHUB_TOKEN=your_github_pat_token
OPENAI_API_KEY=your_openai_api_key
REPO_OWNER=your_repo_owner
REPO_NAME=your_repo_name
```

### Example:

```env
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxx
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx
ANTHROPIC_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx
REPO_OWNER=EmiRoberti77
REPO_NAME=oaix_core_service
```

> **Note**:
>
> - `GITHUB_TOKEN` requires `repo` read access.
> - `OPENAI_API_KEY` requires access to GPT-4.

---

## 📦 Dependencies

- [Octokit](https://github.com/octokit/rest.js) - GitHub API Client
- [Axios](https://github.com/axios/axios) - HTTP Client
- [dotenv](https://github.com/motdotla/dotenv) - Environment Variable Loader

---

## 🧑‍💻 Example Usage

Run the tool with:

```bash
npx ts-node ./src/index.ts
```

---

## 📝 Example Output

```bash
ACTION: Provide documentation the code in this diff. --- DIFF: ...
Generated Documentation:
- Function `getPullRequestDiff` fetches the diff for a pull request.
- Function `reviewCode` asks OpenAI to review the diff.
- Function `documentCode` asks OpenAI to document the diff.
...
```

---

## 📋 Code Structure

- **getPullRequestDiff(pull_number)**  
  Retrieves the raw diff of the specified pull request.

- **reviewCode(diff)**  
  Sends the diff to OpenAI for **code review**.

- **documentCode(diff)**  
  Sends the diff to OpenAI for **documentation generation**.

- **callAI(inputPrompt)**  
  Handles communication with OpenAI API.

- **main()**  
  Example execution fetching and documenting PR number `3`.

---

## ✅ Extending Functionality

You can easily add new actions by:

1. Creating a new function (e.g., `suggestTests(diff)`)
2. Passing the relevant prompt to `callAI`

---

## ⚠️ Disclaimer

This is a proof-of-concept and should not be used as a replacement for human code review. Validate all AI suggestions before applying them to production code.

---

## 📄 License

MIT

## 📄 Author

Emi Roberti

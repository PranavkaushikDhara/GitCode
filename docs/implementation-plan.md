# Chrome Extension Implementation Plan - GitHub LeetCode Committer

## Overview

Build a Chrome extension that automatically commits LeetCode solutions to GitHub repositories with organized folder structure.

## Time Allocation: 2 Hours Total

### Phase 1: Basic Extension Setup (30 minutes)

#### Files to Create:

- `manifest.json`
- `popup.html`
- `popup.css`
- `popup.js`

#### Tasks:

1. **Create manifest.json**

   - Set manifest version 3
   - Add permissions: `activeTab`, `storage`, `https://api.github.com/*`
   - Define popup and background scripts

2. **Design popup.html**

   - GitHub token input field (with save/clear options)
   - Repository selection dropdown
   - Branch selection dropdown
   - Problem title input field
   - Programming language dropdown
   - Problem statement textarea
   - Solution code textarea
   - Submit button
   - Status/loading indicator

3. **Basic CSS styling**

   - Clean, minimal design
   - Responsive layout
   - Loading states

4. **Initialize popup.js**
   - DOM element references
   - Event listeners setup
   - Chrome storage API integration

### Phase 2: GitHub Integration (45 minutes)

#### GitHub API Functions:

1. **Authentication**

   - Store/retrieve GitHub personal access token
   - Test token validity

2. **Repository Operations**

   - `fetchUserRepositories()` - Get user's repos
   - `fetchBranches(repo)` - Get branches for selected repo
   - `createFile(path, content, message)` - Create file via API

3. **API Helper Functions**
   - `makeGitHubRequest(endpoint, options)` - Generic API caller
   - `handleGitHubError(error)` - Error handling
   - `validateToken()` - Token validation

#### Implementation Details:

- Use GitHub REST API v4
- Handle rate limiting and errors
- Implement proper authentication headers
- Store API responses in memory for session

### Phase 3: Core Functionality (35 minutes)

#### File Structure Logic:

1. **Folder and File Creation**

   - Convert problem title to kebab-case
   - Create folder structure: `{problem-title}/`
   - Generate two files:
     - `problem.txt` - Problem statement
     - `solution.{ext}` - Solution code

2. **Language Extension Mapping**

   ```javascript
   const languageExtensions = {
     Python: "py",
     JavaScript: "js",
     Java: "java",
     "C++": "cpp",
     C: "c",
     Go: "go",
     Rust: "rs",
     TypeScript: "ts",
   };
   ```

3. **Commit Process**
   - Generate commit message: "Add solution for {Problem Title}"
   - Create both files in single commit (if possible)
   - Handle existing files (overwrite or create new version)

#### Key Functions:

- `sanitizeFileName(title)` - Convert title to valid folder name
- `generateFileContent(type, content)` - Format file contents
- `commitSolution(repoData, problemData)` - Main commit function
- `updateProgress(message)` - User feedback

### Phase 4: Polish & Testing (10 minutes)

#### Final Touches:

1. **User Experience**

   - Loading indicators during API calls
   - Success/error notifications
   - Form validation
   - Clear error messages

2. **Testing Checklist**

   - Token validation
   - Repository loading
   - Branch selection
   - File creation with different languages
   - Error handling scenarios

3. **Error Handling**
   - Invalid tokens
   - Network failures
   - API rate limits
   - Invalid repository/branch selections

## Technical Architecture

### File Structure:

```
chrome-extension/
├── manifest.json
├── popup.html
├── popup.css
├── popup.js
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

### GitHub Repository Structure (Output):

```
repository/
├── two-sum/
│   ├── problem.txt
│   └── solution.py
├── valid-parentheses/
│   ├── problem.txt
│   └── solution.js
└── ...
```

## Key Features

### Current Phase Features:

- Manual problem title input
- Manual problem statement input
- Manual solution code input
- Language selection
- Repository and branch selection
- Organized folder structure per problem

### Future Enhancements:

- Auto-detect LeetCode problem from current page
- Auto-extract problem statement
- Auto-detect solution language
- Batch commit multiple problems
- Problem categories/tags

## Dependencies

### Chrome APIs:

- `chrome.storage` - Store GitHub tokens and settings
- `chrome.tabs` - Future: detect LeetCode pages

### GitHub API Endpoints:

- `GET /user/repos` - List repositories
- `GET /repos/{owner}/{repo}/branches` - List branches
- `PUT /repos/{owner}/{repo}/contents/{path}` - Create/update files

## Success Criteria

### Phase 1 Complete:

- Extension loads in Chrome
- UI elements are functional
- Basic form validation works

### Phase 2 Complete:

- GitHub API integration working
- Repository and branch dropdowns populate
- Token authentication successful

### Phase 3 Complete:

- Files are created in correct folder structure
- Both problem.txt and solution.{ext} are committed
- Commit messages are properly formatted

### Phase 4 Complete:

- User-friendly error messages
- Loading states provide feedback
- Extension works end-to-end

## Implementation Notes

### GitHub API Considerations:

- Use personal access tokens for authentication
- Require `repo` scope for private repositories
- Handle API rate limits gracefully
- Use base64 encoding for file contents

### Chrome Extension Best Practices:

- Use Manifest V3
- Minimize permissions requested
- Store sensitive data securely
- Provide clear user feedback

### Development Tips:

- Test with a dedicated test repository
- Use Chrome DevTools for debugging
- Test both public and private repositories
- Handle edge cases (special characters, long titles)

## Testing Strategy

### Manual Testing:

1. Install extension in Chrome
2. Configure GitHub token
3. Select repository and branch
4. Fill in problem details
5. Verify folder and files are created correctly
6. Test with different programming languages
7. Test error scenarios

### Edge Cases to Test:

- Problem titles with special characters
- Very long problem statements
- Invalid GitHub tokens
- Network connectivity issues
- Non-existent repositories/branches

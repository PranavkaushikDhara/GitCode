// DOM Elements
const elements = {
    tokenInput: document.getElementById('github-token'),
    saveTokenBtn: document.getElementById('save-token'),
    tokenStatus: document.getElementById('token-status'),
    repositorySelect: document.getElementById('repository'),
    branchSelect: document.getElementById('branch'),
    problemTitle: document.getElementById('problem-title'),
    languageSelect: document.getElementById('language'),
    problemStatement: document.getElementById('problem-statement'),
    solutionCode: document.getElementById('solution-code'),
    commitBtn: document.getElementById('commit-solution'),
    commitText: document.getElementById('commit-text'),
    loadingSpinner: document.getElementById('loading-spinner'),
    status: document.getElementById('status'),
    clearDraftBtn: document.getElementById('clear-draft')
};

// Language extensions mapping
const languageExtensions = {
    'python': 'py',
    'javascript': 'js',
    'java': 'java',
    'cpp': 'cpp',
    'c': 'c',
    'go': 'go',
    'rust': 'rs',
    'typescript': 'ts'
};

// State management
let currentToken = '';
let repositories = [];
let branches = [];
let autoSaveTimeout = null;

// Initialize the extension
document.addEventListener('DOMContentLoaded', async () => {
    await loadSavedToken();
    await restoreFormData();
    setupEventListeners();
    preventPopupClose();
});

// Prevent popup from closing when clicking inside
function preventPopupClose() {
    // Prevent clicks from bubbling up and closing the popup
    document.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    // Prevent form submission from closing popup
    document.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();
    });
    
    // Keep focus within the extension
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
        }
    });
}

// Event listeners
function setupEventListeners() {
    elements.saveTokenBtn.addEventListener('click', saveToken);
    elements.tokenInput.addEventListener('input', handleTokenInput);
    elements.repositorySelect.addEventListener('change', handleRepositoryChange);
    elements.branchSelect.addEventListener('change', handleBranchChange);
    elements.commitBtn.addEventListener('click', commitSolution);
    elements.clearDraftBtn.addEventListener('click', handleClearDraft);
    
    // Auto-save form data on input
    elements.problemTitle.addEventListener('input', () => {
        autoSaveFormData();
        validateForm();
    });
    elements.languageSelect.addEventListener('change', () => {
        autoSaveFormData();
        validateForm();
    });
    elements.problemStatement.addEventListener('input', () => {
        autoSaveFormData();
        validateForm();
    });
    elements.solutionCode.addEventListener('input', () => {
        autoSaveFormData();
        validateForm();
    });
}

// Load saved token from storage
async function loadSavedToken() {
    try {
        const result = await chrome.storage.local.get(['githubToken']);
        if (result.githubToken) {
            currentToken = result.githubToken;
            elements.tokenInput.value = '••••••••••••••••';
            showStatus('Token loaded successfully', 'success', elements.tokenStatus);
            await validateAndLoadRepositories();
        }
    } catch (error) {
        console.error('Error loading token:', error);
    }
}

// Save token to storage
async function saveToken() {
    const token = elements.tokenInput.value.trim();
    if (!token) {
        showStatus('Please enter a GitHub token', 'error', elements.tokenStatus);
        return;
    }

    try {
        setLoading(elements.saveTokenBtn, true);
        
        // Validate token by making a test API call
        const isValid = await validateToken(token);
        if (isValid) {
            await chrome.storage.local.set({ githubToken: token });
            currentToken = token;
            elements.tokenInput.value = '••••••••••••••••';
            showStatus('Token saved successfully', 'success', elements.tokenStatus);
            await loadRepositories();
        } else {
            showStatus('Invalid GitHub token', 'error', elements.tokenStatus);
        }
    } catch (error) {
        showStatus('Error saving token', 'error', elements.tokenStatus);
        console.error('Error saving token:', error);
    } finally {
        setLoading(elements.saveTokenBtn, false);
    }
}

// Handle token input changes
function handleTokenInput() {
    if (elements.tokenInput.value !== '••••••••••••••••') {
        elements.saveTokenBtn.textContent = 'Save';
    }
}

// Validate token and load repositories
async function validateAndLoadRepositories() {
    if (currentToken) {
        const isValid = await validateToken(currentToken);
        if (isValid) {
            await loadRepositories();
        } else {
            showStatus('Token expired or invalid', 'error', elements.tokenStatus);
            currentToken = '';
            elements.tokenInput.value = '';
        }
    }
}

// Validate GitHub token
async function validateToken(token) {
    try {
        const response = await makeGitHubRequest('/user', { token });
        return response.ok;
    } catch (error) {
        return false;
    }
}

// Load user repositories
async function loadRepositories() {
    try {
        setLoading(elements.repositorySelect, true);
        
        const response = await makeGitHubRequest('/user/repos?per_page=100', { token: currentToken });
        if (response.ok) {
            repositories = await response.json();
            populateRepositorySelect();
            elements.repositorySelect.disabled = false;
        } else {
            showStatus('Failed to load repositories', 'error');
        }
    } catch (error) {
        showStatus('Error loading repositories', 'error');
        console.error('Error loading repositories:', error);
    } finally {
        setLoading(elements.repositorySelect, false);
    }
}

// Populate repository select dropdown
function populateRepositorySelect() {
    elements.repositorySelect.innerHTML = '<option value="">Select a repository</option>';
    repositories.forEach(repo => {
        const option = document.createElement('option');
        option.value = repo.full_name;
        option.textContent = repo.name;
        elements.repositorySelect.appendChild(option);
    });
}

// Handle repository selection change
async function handleRepositoryChange() {
    const selectedRepo = elements.repositorySelect.value;
    if (selectedRepo) {
        await loadBranches(selectedRepo);
        elements.branchSelect.disabled = false;
    } else {
        elements.branchSelect.disabled = true;
        elements.branchSelect.innerHTML = '<option value="">Select a branch</option>';
    }
    autoSaveFormData();
    validateForm();
}

// Load branches for selected repository
async function loadBranches(repoFullName) {
    try {
        setLoading(elements.branchSelect, true);
        
        const response = await makeGitHubRequest(`/repos/${repoFullName}/branches`, { token: currentToken });
        if (response.ok) {
            branches = await response.json();
            populateBranchSelect();
        } else {
            showStatus('Failed to load branches', 'error');
        }
    } catch (error) {
        showStatus('Error loading branches', 'error');
        console.error('Error loading branches:', error);
    } finally {
        setLoading(elements.branchSelect, false);
    }
}

// Populate branch select dropdown
function populateBranchSelect() {
    elements.branchSelect.innerHTML = '<option value="">Select a branch</option>';
    branches.forEach(branch => {
        const option = document.createElement('option');
        option.value = branch.name;
        option.textContent = branch.name;
        elements.branchSelect.appendChild(option);
    });
}

// Handle branch selection change
function handleBranchChange() {
    autoSaveFormData();
    validateForm();
}

// Validate form and enable/disable commit button
function validateForm() {
    const isValid = 
        currentToken &&
        elements.repositorySelect.value &&
        elements.branchSelect.value &&
        elements.problemTitle.value.trim() &&
        elements.problemStatement.value.trim() &&
        elements.solutionCode.value.trim();
    
    elements.commitBtn.disabled = !isValid;
}

// Commit solution to GitHub
async function commitSolution() {
    try {
        setLoading(elements.commitBtn, true);
        
        const problemTitle = elements.problemTitle.value.trim();
        const folderName = sanitizeFileName(problemTitle);
        const language = elements.languageSelect.value;
        const extension = languageExtensions[language];
        const repoFullName = elements.repositorySelect.value;
        const branch = elements.branchSelect.value;
        
        // Create problem statement file
        const problemContent = elements.problemStatement.value.trim();
        const problemPath = `${folderName}/problem.txt`;
        
        // Create solution file
        const solutionContent = elements.solutionCode.value.trim();
        const solutionPath = `${folderName}/solution.${extension}`;
        
        // Commit message
        const commitMessage = `Add solution for ${problemTitle}`;
        
        // Create both files
        const problemResult = await createFile(repoFullName, problemPath, problemContent, commitMessage, branch);
        const solutionResult = await createFile(repoFullName, solutionPath, solutionContent, commitMessage, branch);
        
        if (problemResult && solutionResult) {
            showStatus('Solution committed successfully! 🎉', 'success');
            await clearFormData(); // Clear saved data after successful commit
            clearForm();
        } else {
            showStatus('Failed to commit solution', 'error');
        }
    } catch (error) {
        showStatus('Error committing solution', 'error');
        console.error('Error committing solution:', error);
    } finally {
        setLoading(elements.commitBtn, false);
    }
}

// Create a file in GitHub repository
async function createFile(repoFullName, path, content, message, branch) {
    try {
        const encodedContent = btoa(unescape(encodeURIComponent(content)));
        const data = {
            message: message,
            content: encodedContent,
            branch: branch
        };
        
        const response = await makeGitHubRequest(`/repos/${repoFullName}/contents/${path}`, {
            method: 'PUT',
            token: currentToken,
            body: JSON.stringify(data)
        });
        
        return response.ok;
    } catch (error) {
        console.error('Error creating file:', error);
        return false;
    }
}

// Make GitHub API request
async function makeGitHubRequest(endpoint, options = {}) {
    const { method = 'GET', token = currentToken, body = null } = options;
    
    const headers = {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'LeetCode-GitHub-Committer'
    };
    
    if (body) {
        headers['Content-Type'] = 'application/json';
    }
    
    return fetch(`https://api.github.com${endpoint}`, {
        method,
        headers,
        body
    });
}

// Utility Functions
function sanitizeFileName(title) {
    return title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function showStatus(message, type, element = elements.status) {
    element.textContent = message;
    element.className = `status-message ${type}`;
    element.style.display = 'block';
    
    if (type === 'success') {
        setTimeout(() => {
            element.style.display = 'none';
        }, 3000);
    }
}

function setLoading(element, isLoading) {
    if (element === elements.commitBtn) {
        if (isLoading) {
            elements.commitText.textContent = 'Committing...';
            elements.loadingSpinner.classList.remove('hidden');
        } else {
            elements.commitText.textContent = 'Commit Solution';
            elements.loadingSpinner.classList.add('hidden');
        }
    }
    element.disabled = isLoading;
}

function clearForm() {
    elements.problemTitle.value = '';
    elements.problemStatement.value = '';
    elements.solutionCode.value = '';
    // Keep repository, branch, and language selections for convenience
    validateForm();
}

// Auto-save form data with debouncing
function autoSaveFormData() {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(async () => {
        const formData = {
            repository: elements.repositorySelect.value,
            branch: elements.branchSelect.value,
            problemTitle: elements.problemTitle.value,
            language: elements.languageSelect.value,
            problemStatement: elements.problemStatement.value,
            solutionCode: elements.solutionCode.value,
            timestamp: Date.now()
        };
        
        try {
            await chrome.storage.local.set({ formData });
            showDraftStatus('Draft saved');
        } catch (error) {
            console.error('Error saving form data:', error);
        }
    }, 500); // 500ms debounce
}

// Restore form data from storage
async function restoreFormData() {
    try {
        const result = await chrome.storage.local.get(['formData']);
        if (result.formData) {
            const data = result.formData;
            
            // Restore form fields
            elements.problemTitle.value = data.problemTitle || '';
            elements.languageSelect.value = data.language || 'python';
            elements.problemStatement.value = data.problemStatement || '';
            elements.solutionCode.value = data.solutionCode || '';
            
            // Restore repository and branch if they exist and repositories are loaded
            if (data.repository) {
                // Wait for repositories to load first
                await new Promise(resolve => {
                    const checkRepos = () => {
                        if (repositories.length > 0) {
                            elements.repositorySelect.value = data.repository;
                            if (data.branch) {
                                // Load branches for the selected repository
                                loadBranches(data.repository).then(() => {
                                    elements.branchSelect.value = data.branch;
                                    validateForm();
                                });
                            }
                            resolve();
                        } else {
                            setTimeout(checkRepos, 100);
                        }
                    };
                    checkRepos();
                });
            }
            
            // Show draft restored message if there's actual content
            const hasContent = data.problemTitle || data.problemStatement || data.solutionCode;
            if (hasContent) {
                showDraftStatus('Draft restored');
            }
            
            validateForm();
        }
    } catch (error) {
        console.error('Error restoring form data:', error);
    }
}

// Clear saved form data
async function clearFormData() {
    try {
        await chrome.storage.local.remove(['formData']);
        showDraftStatus('Draft cleared');
    } catch (error) {
        console.error('Error clearing form data:', error);
    }
}

// Handle clear draft button
async function handleClearDraft() {
    if (confirm('Are you sure you want to clear the current draft?')) {
        await clearFormData();
        clearForm();
        showStatus('Draft cleared successfully', 'success');
    }
}

// Show draft status message
function showDraftStatus(message) {
    const statusElement = document.getElementById('draft-status');
    if (statusElement) {
        statusElement.textContent = message;
        statusElement.style.display = 'block';
        
        // Hide after 2 seconds
        setTimeout(() => {
            statusElement.style.display = 'none';
        }, 2000);
    }
}
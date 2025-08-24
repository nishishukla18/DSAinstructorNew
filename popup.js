const API_KEY = "GEMINI_API_KEY"

const askBtn = document.getElementById('askBtn');
const userInput = document.getElementById('userInput');
const responseElement = document.getElementById('response');
const loadingIndicator = document.getElementById('loadingIndicator');
const responseContainer = document.getElementById('responseContainer');


let isProcessing = false;


document.addEventListener('DOMContentLoaded', function() {
    initializeExtension();
});

function initializeExtension() {
    askBtn.addEventListener('click', handleGetHint);
    userInput.addEventListener('input', handleInputChange);
    userInput.addEventListener('keydown', handleKeyDown);
        
    userInput.focus();
    
    setupAutoResize();
}

async function handleGetHint() {
    if (isProcessing) return;
    
    const inputText = userInput.value.trim();
    
    if (!inputText) {
        showError('Please enter your LeetCode question or code first!');
        userInput.focus();
        return;
    }
    
    if (inputText.length < 10) {
        showError('Please provide more details about your problem.');
        return;
    }
    
    setProcessingState(true);
    
    try {
        const response = await getGeminiResponse(inputText);
        displayResponse(response);
    } catch (error) {
        handleError(error);
    } finally {
        setProcessingState(false);
    }
}

async function getGeminiResponse(userInput) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    
    const requestBody = {
        contents: [{
            role: "user",
            parts: [{ text: userInput }]
        }],
        systemInstruction: {
            role: "system",
            parts: [{
                text: `You are a DSA (Data Structures & Algorithms) instructor. Your role:

1. Provide HINTS only, never complete solutions
2. Help debug code by identifying logical and syntax errors
3. Guide students step-by-step toward the solution
4. Ask clarifying questions when needed
5. For non-DSA questions, politely decline and redirect to DSA topics

Format your response clearly with:
- 🔍 Analysis: Brief problem understanding
- 💡 Hint: Next step or approach to try
- 🎯 Focus: What to think about
- ❓ Questions: If you need clarification

Keep responses concise but helpful for a Chrome extension interface.`
            }]
        },
        generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 500
        }
    };
    
    const response = await fetch(url, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "User-Agent": "DSA-Instructor-Extension/1.0"
        },
        body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error?.message || `API Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
        return data.candidates[0].content.parts.map(part => part.text).join("\n");
    } else {
        throw new Error("No valid response from Gemini API");
    }
}

// UI State Management
function setProcessingState(processing) {
    isProcessing = processing;
    
    if (processing) {
        askBtn.classList.add('loading');
        askBtn.disabled = true;
        loadingIndicator.classList.add('show');
        responseContainer.classList.remove('show');
        clearError();
    } else {
        askBtn.classList.remove('loading');
        askBtn.disabled = false;
        loadingIndicator.classList.remove('show');
    }
}

function displayResponse(text) {
    responseElement.textContent = text;
    responseContainer.classList.add('show');
    
    responseContainer.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest' 
    });
}

function handleError(error) {
    console.error('Error:', error);
    
    let errorMessage = "Sorry, something went wrong. Please try again.";
    
    if (error.message.includes('API_KEY')) {
        errorMessage = "API key not configured. Please check your setup.";
    } else if (error.message.includes('fetch')) {
        errorMessage = "Network error. Please check your connection.";
    } else if (error.message.includes('quota') || error.message.includes('limit')) {
        errorMessage = "API quota exceeded. Please try again later.";
    } else if (error.message.length > 0 && error.message.length < 100) {
        errorMessage = error.message;
    }
    
    showError(errorMessage);
}

function showError(message) {
    // Remove any existing error
    clearError();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    errorDiv.id = 'errorMessage';
    
    // Insert after button section
    const buttonSection = document.querySelector('.button-section');
    buttonSection.insertAdjacentElement('afterend', errorDiv);
    
    // Auto-remove error after 5 seconds
    setTimeout(clearError, 5000);
}

function clearError() {
    const existingError = document.getElementById('errorMessage');
    if (existingError) {
        existingError.remove();
    }
}

// Input handling
function handleInputChange() {
    // Clear previous responses when user starts typing
    if (responseContainer.classList.contains('show')) {
        responseContainer.classList.remove('show');
    }
    clearError();
}

function handleKeyDown(event) {
    
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        handleGetHint();
    }
}

// Auto-resize textarea
function setupAutoResize() {
    userInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 200) + 'px';
    });
}

// Utility functions
function validateApiKey() {
    return API_KEY && API_KEY !== "GEMINI_API_KEY" && API_KEY.length > 10;
}

window.addEventListener('beforeunload', function() {
    // Clean up any ongoing requests
    if (isProcessing) {
        setProcessingState(false);
    }
});

// Handle extension errors 
window.addEventListener('error', function(event) {
    console.error('Extension error:', event.error);
    handleError(new Error('An unexpected error occurred'));
});

// Check API key on load
if (!validateApiKey()) {
    console.warn('API key not properly configured');
}
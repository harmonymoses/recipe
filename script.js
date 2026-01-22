
const display = document.getElementById("display");
const historyList = document.getElementById("historyList");
const clearHistoryLink = document.getElementById("clearHistoryLink");

// Track if the last action was showing a result
let lastResult = false;

// Function to show or hide the "Clear" link in history
function updateClearLinkVisibility() {
    if (historyList.children.length > 0) {
        clearHistoryLink.style.display = "block";
    } else {
        clearHistoryLink.style.display = "none";
    }
}

// Load calculation history from localStorage when page loads
function loadHistoryFromStorage() {
    try {
        // Get history from localStorage
        const savedHistory = localStorage.getItem("calculatorHistory");
        
        // If there's saved history, display it
        if (savedHistory) {
            const historyArray = JSON.parse(savedHistory);
            
            // Add each history item to the list
            historyArray.forEach(function(entry) {
                const listItem = document.createElement("li");
                listItem.textContent = entry;
                historyList.appendChild(listItem);
            });
        }
    } catch (error) {
        console.log("Could not load history:", error);
    }
    
    updateClearLinkVisibility();
}

// Save a calculation to localStorage
function saveToHistory(entry) {
    try {
        // Get existing history or create empty array
        const savedHistory = localStorage.getItem("calculatorHistory");
        let historyArray = savedHistory ? JSON.parse(savedHistory) : [];
        
        // Add new entry to the beginning of array
        historyArray.unshift(entry);
        
        // Keep only the last 50 calculations
        if (historyArray.length > 50) {
            historyArray.pop(); // Remove oldest entry
        }
        
        // Save back to localStorage
        localStorage.setItem("calculatorHistory", JSON.stringify(historyArray));
    } catch (error) {
        console.log("Could not save to history:", error);
    }
}

// Add number or operator to the display
function appendToDisplay(value) {
    // If we just showed a result, clear display first
    if (lastResult) {
        display.value = "";
        lastResult = false;
    }
    
    // Add the value to display
    display.value += value;
}

// Clear the display
function clearDisplay() {
    display.value = "";
    lastResult = false;
}

// Delete the last character from display (backspace)
function deleteLastCharacter() {
    display.value = display.value.slice(0, -1);
}

// Calculate and show the result
function calculateResult() {
    // Don't calculate if display is empty
    if (!display.value) {
        return;
    }

    try {
        // Save the original expression
        const originalExpression = display.value;
        
        // Calculate the result using eval (wrapped in Function for safety)
        const result = Function(`"use strict"; return (${display.value})`)();

        // Check if result is valid
        if (isNaN(result) || !isFinite(result)) {
            display.value = "Error";
            lastResult = true;
            return;
        }

        // Round result to avoid long decimals
        const roundedResult = Math.round(result * 100000000) / 100000000;
        
        // Show result on display
        display.value = roundedResult;
        lastResult = true;

        // Create history entry
        const historyEntry = originalExpression + " = " + roundedResult;
        
        // Add to history list (newest first)
        const listItem = document.createElement("li");
        listItem.textContent = historyEntry;
        historyList.prepend(listItem);
        
        // Save to localStorage
        saveToHistory(historyEntry);
        
        // Show clear link if history has items
        updateClearLinkVisibility();

    } catch (error) {
        // If calculation fails, show error
        display.value = "Error";
        lastResult = true;
    }
}

// Clear all history
function clearHistory() {
    // Ask user to confirm
    const confirmClear = confirm("Are you sure you want to clear all history?");
    
    if (confirmClear) {
        // Remove from localStorage
        localStorage.removeItem("calculatorHistory");
        
        // Clear the history list
        historyList.innerHTML = "";
        
        // Hide clear link
        updateClearLinkVisibility();
    }
}

// Keyboard support for typing on calculator
document.addEventListener("keydown", function(event) {
    const key = event.key;

    // Check if key is a number (0-9)
    const isNumber = !isNaN(key);
    
    // Check if key is an operator
    const isOperator = ["+", "-", "*", "/", "."].includes(key);

    // If number or operator, add to display
    if (isNumber || isOperator) {
        event.preventDefault();
        appendToDisplay(key);
    }

    // Press Enter to calculate
    if (key === "Enter") {
        event.preventDefault();
        calculateResult();
    }

    // Press Backspace to delete last character
    if (key === "Backspace") {
        event.preventDefault();
        deleteLastCharacter();
    }

    // Press Escape to clear display
    if (key === "Escape") {
        event.preventDefault();
        clearDisplay();
    }
});

// Load history when page first loads
loadHistoryFromStorage();
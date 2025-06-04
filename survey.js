// Global variables
let surveys = JSON.parse(localStorage.getItem('surveys')) || [];

// DOM Elements
const surveyForm = document.getElementById('survey-form');
const surveyScreen = document.getElementById('survey-screen');
const resultsScreen = document.getElementById('results-screen');
const surveyLink = document.getElementById('survey-link');
const resultsLink = document.getElementById('results-link');
const successModal = document.getElementById('success-modal');
const closeModal = document.querySelector('.close');

// Initializing the application
document.addEventListener('DOMContentLoaded', function() {
    // Set default date to today
    document.getElementById('date').valueAsDate = new Date();
    
    // Adding event listeners for functionality
    surveyForm.addEventListener('submit', handleSubmit);
    closeModal.addEventListener('click', hideModal);
    window.addEventListener('click', function(event) {
        if (event.target === successModal) {
            hideModal();
        }
    });
});

// Navigation functions
function showSurveyForm() {
    surveyScreen.classList.add('active');
    resultsScreen.classList.remove('active');
    surveyLink.classList.add('active');
    resultsLink.classList.remove('active');
}

function showResults() {
    surveyScreen.classList.remove('active');
    resultsScreen.classList.add('active');
    surveyLink.classList.remove('active');
    resultsLink.classList.add('active');
    displayResults();
}
// Data Validation
function validateForm() {
    let isValid = true;
    clearErrors();

    // Validate name
    const name = document.getElementById('name').value.trim();
    if (!name) {
        showError('name-error', 'Name is required');
        isValid = false;
    }

    // Validate surname
    const surname = document.getElementById('surname').value.trim();
    if (!surname) {
        showError('surname-error', 'Surname is required');
        isValid = false;
    }

    // Validate age
    const age = parseInt(document.getElementById('age').value);
    if (!age || age < 5 || age > 120) {
        showError('age-error', 'Age must be between 5 and 120');
        isValid = false;
    }

    // Validate date
    const date = document.getElementById('date').value;
    if (!date) {
        showError('date-error', 'Date is required');
        isValid = false;
    }

    // Validate rating questions
    const ratingQuestions = ['eat-out', 'watch-movies', 'watch-tv', 'listen-radio'];
    ratingQuestions.forEach(question => {
        const selected = document.querySelector(`input[name="${question}"]:checked`);
        if (!selected) {
            showError(`${question}-error`, 'Please select a rating');
            isValid = false;
        }
    });

    return isValid;
}

function showError(elementId, message) {
    document.getElementById(elementId).textContent = message;
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
    });
}

// Form submission handler
function handleSubmit(event) {
    event.preventDefault();
    
    if (!validateForm()) {
        return;
    }

    // Collect form data
    const formData = new FormData(surveyForm);
    const surveyData = {
        id: Date.now(),
        name: formData.get('name').trim(),
        surname: formData.get('surname').trim(),
        age: parseInt(formData.get('age')),
        date: formData.get('date'),
        foods: formData.getAll('food'),
        eatOut: parseInt(formData.get('eat-out')),
        watchMovies: parseInt(formData.get('watch-movies')),
        watchTV: parseInt(formData.get('watch-tv')),
        listenRadio: parseInt(formData.get('listen-radio')),
        timestamp: new Date().toISOString()
    };

    // Save to localStorage
    surveys.push(surveyData);
    localStorage.setItem('surveys', JSON.stringify(surveys));

    // Reset form and show success message
    surveyForm.reset();
    document.getElementById('date').valueAsDate = new Date();
    showModal();
}

// Modal functions
function showModal() {
    successModal.style.display = 'block';
}

function hideModal() {
    successModal.style.display = 'none';
}

// Results calculation and display
function displayResults() {
    const resultsContent = document.getElementById('results-content');
    
    if (surveys.length === 0) {
        resultsContent.innerHTML = '<div class="no-data">No Surveys Available</div>';
        return;
    }

    const stats = calculateStatistics();
    
    resultsContent.innerHTML = `
        <div class="results-grid">
            <div class="result-card">
                <h3>Total Surveys</h3>
                <div class="result-value">${stats.totalSurveys}</div>
                <div class="result-label">Completed</div>
            </div>
            
            <div class="result-card">
                <h3>Average Age</h3>
                <div class="result-value">${stats.averageAge}</div>
                <div class="result-label">Years</div>
            </div>
            
            <div class="result-card">
                <h3>Oldest Person</h3>
                <div class="result-value">${stats.oldestAge}</div>
                <div class="result-label">Years</div>
            </div>
            
            <div class="result-card">
                <h3>Youngest Person</h3>
                <div class="result-value">${stats.youngestAge}</div>
                <div class="result-label">Years</div>
            </div>
            
            <div class="result-card">
                <h3>People who like Pizza</h3>
                <div class="result-value">${stats.pizzaPercentage}%</div>
                <div class="result-label">Of respondents</div>
            </div>
            
            <div class="result-card">
                <h3>People like to eat out</h3>
                <div class="result-value">${stats.eatOutAverage}</div>
                <div class="result-label">Average rating</div>
            </div>
        </div>
        
        <div class="additional-stats">
            <h3>Additional Statistics</h3>
            <div class="results-grid">
                <div class="result-card">
                    <h3>Watch Movies</h3>
                    <div class="result-value">${stats.watchMoviesAverage}</div>
                    <div class="result-label">Average rating</div>
                </div>
                
                <div class="result-card">
                    <h3>Watch TV</h3>
                    <div class="result-value">${stats.watchTVAverage}</div>
                    <div class="result-label">Average rating</div>
                </div>
                
                <div class="result-card">
                    <h3>Listen to Radio</h3>
                    <div class="result-value">${stats.listenRadioAverage}</div>
                    <div class="result-label">Average rating</div>
                </div>
            </div>
        </div>
    `;
}

//Calucations
function calculateStatistics() {
    const totalSurveys = surveys.length;
    
    // Calculate age statistics
    const ages = surveys.map(survey => survey.age);
    const averageAge = (ages.reduce((sum, age) => sum + age, 0) / totalSurveys).toFixed(1);
    const oldestAge = Math.max(...ages);
    const youngestAge = Math.min(...ages);
    
    // Calculate pizza percentage
    const pizzaLovers = surveys.filter(survey => survey.foods.includes('Pizza')).length;
    const pizzaPercentage = ((pizzaLovers / totalSurveys) * 100).toFixed(1);
    
    // Calculate rating averages
    const eatOutRatings = surveys.map(survey => survey.eatOut);
    const eatOutAverage = (eatOutRatings.reduce((sum, rating) => sum + rating, 0) / totalSurveys).toFixed(1);
    
    const watchMoviesRatings = surveys.map(survey => survey.watchMovies);
    const watchMoviesAverage = (watchMoviesRatings.reduce((sum, rating) => sum + rating, 0) / totalSurveys).toFixed(1);
    
    const watchTVRatings = surveys.map(survey => survey.watchTV);
    const watchTVAverage = (watchTVRatings.reduce((sum, rating) => sum + rating, 0) / totalSurveys).toFixed(1);
    
    const listenRadioRatings = surveys.map(survey => survey.listenRadio);
    const listenRadioAverage = (listenRadioRatings.reduce((sum, rating) => sum + rating, 0) / totalSurveys).toFixed(1);
    
    return {
        totalSurveys,
        averageAge,
        oldestAge,
        youngestAge,
        pizzaPercentage,
        eatOutAverage,
        watchMoviesAverage,
        watchTVAverage,
        listenRadioAverage
    };
}

// Utility function to clear all data
function clearAllData() {
    if (confirm('Are you sure you want to clear all survey data? This action cannot be undone.')) {
        localStorage.removeItem('surveys');
        surveys = [];
        displayResults();
        alert('All data has been cleared.');
    }
}

// Add clear data function to console for testing
window.clearAllData = clearAllData;
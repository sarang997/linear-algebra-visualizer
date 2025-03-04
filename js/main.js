/**
 * Main JavaScript file for the ML Concepts Visualizer
 */

// Initialize all visualizations when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add animation classes to elements
    animateElementsOnLoad();
    
    // Initialize the vector visualization
    initVectorVisualization();
    
    // Initialize the multivariate regression visualization
    initRegressionVisualization();
    
    // Initialize the loss function visualization
    initLossFunctionVisualization();
    
    // Initialize the gradient descent visualization
    initGradientDescentVisualization();
    
    // Set the first nav link as active by default
    const firstNavLink = document.querySelector('nav .nav-link:not([target="_blank"])');
    if (firstNavLink) {
        firstNavLink.classList.add('active');
    }
    
    // Add smooth scrolling for navigation links
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
            
            // Update active link
            document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Add scroll spy functionality
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // Update active navigation link
        if (currentSection) {
            document.querySelectorAll('nav a').forEach(a => {
                a.classList.remove('active');
                if (a.getAttribute('href') === `#${currentSection}`) {
                    a.classList.add('active');
                }
            });
            
            // Animate section elements when they come into view
            animateSectionElements(currentSection);
        }
    });
    
    // Handle window resize for responsive visualizations
    window.addEventListener('resize', function() {
        // Redraw plots to fit new window size
        Plotly.relayout('regression-visualization', {
            autosize: true
        });
        
        Plotly.relayout('loss-visualization', {
            autosize: true
        });
        
        Plotly.relayout('gradient-visualization', {
            autosize: true
        });
        
        Plotly.relayout('convergence-plot', {
            autosize: true
        });
        
        // Redraw vector visualization if in 2D mode
        const vectorContainer = document.getElementById('vector-visualization-container');
        if (vectorContainer && vectorContainer.data && vectorContainer.data[0]) {
            Plotly.relayout('vector-visualization-container', {
                autosize: true
            });
        }
    });
    
    // Initialize tooltips
    initTooltips();
    
    // Add event listeners for interactive elements
    addEventListeners();
});

/**
 * Animate elements when the page loads
 */
function animateElementsOnLoad() {
    // Add fade-in-up animation to hero section elements
    const heroElements = document.querySelectorAll('.hero-section h1, .hero-section .lead, .hero-section .btn');
    heroElements.forEach((el, index) => {
        el.classList.add('fade-in-up');
        el.style.animationDelay = `${index * 0.2}s`;
    });
    
    // Add fade-in-up animation to introduction section
    const introElements = document.querySelectorAll('#introduction .card');
    introElements.forEach((el, index) => {
        el.classList.add('fade-in-up');
        el.style.animationDelay = `${0.3 + index * 0.2}s`;
    });
}

/**
 * Animate section elements when they come into view
 */
function animateSectionElements(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    // Only animate elements that haven't been animated yet
    const elementsToAnimate = section.querySelectorAll('.card:not(.animated), .visualization-container:not(.animated)');
    elementsToAnimate.forEach((el, index) => {
        el.classList.add('fade-in-up', 'animated');
        el.style.animationDelay = `${index * 0.1}s`;
    });
}

/**
 * Initialize Bootstrap tooltips
 */
function initTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

/**
 * Add event listeners for interactive elements
 */
function addEventListeners() {
    // Add hover effects for visualization containers
    document.querySelectorAll('.visualization-container').forEach(container => {
        container.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
        });
        
        container.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
        });
    });
    
    // Add data-bs-toggle="tooltip" to all input elements
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.setAttribute('data-bs-toggle', 'tooltip');
        input.setAttribute('data-bs-placement', 'top');
        input.setAttribute('title', 'Adjust this value to see changes in the visualization');
    });
    
    // Reinitialize tooltips after adding attributes
    initTooltips();
}

// Add tooltips to various elements
function addTooltips() {
    // Vector visualization tooltips
    const vector1X = document.getElementById('vector1-x');
    if (vector1X) {
        vector1X.title = 'X component of vector 1';
    }
    
    const vector1Y = document.getElementById('vector1-y');
    if (vector1Y) {
        vector1Y.title = 'Y component of vector 1';
    }
    
    const vector1Z = document.getElementById('vector1-z');
    if (vector1Z) {
        vector1Z.title = 'Z component of vector 1';
    }
    
    const vector2X = document.getElementById('vector2-x');
    if (vector2X) {
        vector2X.title = 'X component of vector 2';
    }
    
    const vector2Y = document.getElementById('vector2-y');
    if (vector2Y) {
        vector2Y.title = 'Y component of vector 2';
    }
    
    const vector2Z = document.getElementById('vector2-z');
    if (vector2Z) {
        vector2Z.title = 'Z component of vector 2';
    }
    
    const showUnitVectors = document.getElementById('show-unit-vectors');
    if (showUnitVectors) {
        showUnitVectors.title = 'Show or hide the unit vectors (i, j, k)';
    }
    
    const show3D = document.getElementById('show-3d');
    if (show3D) {
        show3D.title = 'Toggle between 2D and 3D visualization';
    }
    
    const addVectors = document.getElementById('add-vectors');
    if (addVectors) {
        addVectors.title = 'Calculate the sum of the two vectors';
    }
    
    const subtractVectors = document.getElementById('subtract-vectors');
    if (subtractVectors) {
        subtractVectors.title = 'Calculate the difference between the two vectors';
    }
    
    const dotProduct = document.getElementById('dot-product');
    if (dotProduct) {
        dotProduct.title = 'Calculate the dot product (scalar product) of the two vectors';
    }
    
    const crossProduct = document.getElementById('cross-product');
    if (crossProduct) {
        crossProduct.title = 'Calculate the cross product (vector product) of the two vectors';
    }
    
    // Add tooltip for learning rate slider
    const learningRateSlider = document.getElementById('learning-rate');
    if (learningRateSlider) {
        learningRateSlider.title = 'Controls how big of a step to take in the direction of the negative gradient. Higher values may converge faster but risk overshooting.';
    }
    
    // Add tooltip for iterations slider
    const iterationsSlider = document.getElementById('iterations');
    if (iterationsSlider) {
        iterationsSlider.title = 'The number of gradient descent steps to perform.';
    }
    
    // Add tooltip for animation speed slider
    const animationSpeedSlider = document.getElementById('animation-speed');
    if (animationSpeedSlider) {
        animationSpeedSlider.title = 'Controls the speed of the gradient descent animation. Higher values mean slower animation.';
    }
    
    // Add tooltip for start gradient descent button
    const startButton = document.getElementById('start-gradient-descent');
    if (startButton) {
        startButton.title = 'Start or pause the gradient descent animation.';
    }
    
    // Add tooltip for reset gradient descent button
    const resetButton = document.getElementById('reset-gradient-descent');
    if (resetButton) {
        resetButton.title = 'Reset the gradient descent to the initial state.';
    }
    
    // Add tooltip for add feature button
    const addFeatureButton = document.getElementById('add-feature');
    if (addFeatureButton) {
        addFeatureButton.title = 'Add a feature to the multivariate regression model.';
    }
    
    // Add tooltip for remove feature button
    const removeFeatureButton = document.getElementById('remove-feature');
    if (removeFeatureButton) {
        removeFeatureButton.title = 'Remove a feature from the multivariate regression model.';
    }
    
    // Add tooltip for generate data button
    const generateDataButton = document.getElementById('generate-data');
    if (generateDataButton) {
        generateDataButton.title = 'Generate new random data points.';
    }
} 
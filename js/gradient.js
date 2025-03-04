/**
 * Gradient Descent Visualization
 */

// Initialize the gradient descent visualization
function initGradientDescentVisualization() {
    // Render the gradient descent equation
    renderEquation('gradient-equation', '\\theta_j := \\theta_j - \\alpha \\frac{\\partial J(\\theta)}{\\partial \\theta_j}');
    
    // Initialize state
    const state = {
        dataPoints: [],
        weights: [0, 0],
        bias: 0,
        learningRate: 0.1,
        iterations: 100,
        animationSpeed: 200, // Slower animation (higher value = slower)
        isRunning: false,
        currentIteration: 0,
        lossHistory: [],
        weightHistory: [],
        biasHistory: [],
        interval: null,
        showIn3D: true // Default to 3D visualization
    };
    
    // Generate random data
    generateGradientData(state);
    
    // Initialize loss surface visualization
    initializeGradientVisualization(state);
    
    // Add event listeners for controls
    document.getElementById('learning-rate').addEventListener('input', function() {
        state.learningRate = parseFloat(this.value);
        document.getElementById('learning-rate-value').textContent = this.value;
    });
    
    document.getElementById('iterations').addEventListener('input', function() {
        state.iterations = parseInt(this.value);
        document.getElementById('iterations-value').textContent = this.value;
    });
    
    document.getElementById('start-gradient-descent').addEventListener('click', function() {
        if (!state.isRunning) {
            startGradientDescent(state);
            this.textContent = 'Pause';
        } else {
            pauseGradientDescent(state);
            this.textContent = 'Resume';
        }
    });
    
    document.getElementById('reset-gradient-descent').addEventListener('click', function() {
        resetGradientDescent(state);
        document.getElementById('start-gradient-descent').textContent = 'Start Gradient Descent';
    });
    
    // Add a toggle for 2D/3D visualization
    const visualizationControls = document.createElement('div');
    visualizationControls.className = 'mb-3';
    visualizationControls.innerHTML = `
        <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="toggle-3d" checked>
            <label class="form-check-label" for="toggle-3d">Show 3D Visualization</label>
        </div>
        <div class="form-group mt-2">
            <label for="animation-speed" class="form-label">Animation Speed: <span id="animation-speed-value">200</span>ms</label>
            <input type="range" class="form-range" id="animation-speed" min="50" max="1000" step="50" value="200">
        </div>
    `;
    
    // Insert the visualization controls before the learning rate control
    const learningRateControl = document.querySelector('label[for="learning-rate"]').parentNode;
    learningRateControl.parentNode.insertBefore(visualizationControls, learningRateControl);
    
    // Add event listener for the 3D toggle
    document.getElementById('toggle-3d').addEventListener('change', function() {
        state.showIn3D = this.checked;
        resetGradientDescent(state);
    });
    
    // Add event listener for animation speed
    document.getElementById('animation-speed').addEventListener('input', function() {
        state.animationSpeed = parseInt(this.value);
        document.getElementById('animation-speed-value').textContent = this.value;
        
        // If animation is running, restart it with the new speed
        if (state.isRunning) {
            pauseGradientDescent(state);
            startGradientDescent(state);
        }
    });
}

// Generate random data for gradient descent
function generateGradientData(state) {
    const randomData = generateRandomData(20, 1, 0.8);
    state.dataPoints = randomData.data.map(point => ({
        x: point.features[0],
        y: point.y
    }));
    
    // Reset weights and bias
    state.weights = [0];
    state.bias = 0;
    state.lossHistory = [];
    state.weightHistory = [[0]];
    state.biasHistory = [0];
    state.currentIteration = 0;
}

// Initialize the gradient descent visualization
function initializeGradientVisualization(state) {
    // Clear any existing visualizations
    const gradientSection = document.querySelector('#gradient-descent .card-body .col-md-6:last-child');
    gradientSection.innerHTML = `
        <div id="gradient-visualization" class="visualization-container"></div>
        <div id="convergence-plot" class="visualization-container mt-3"></div>
    `;
    
    // Define the loss function
    const lossFunction = (w, b) => {
        let sum = 0;
        for (const point of state.dataPoints) {
            const prediction = w * point.x + b;
            sum += Math.pow(prediction - point.y, 2);
        }
        return sum / state.dataPoints.length;
    };
    
    // Create appropriate visualization based on user preference
    if (state.showIn3D) {
        // Create a 3D surface plot
        const wRange = [-3, 3];
        const bRange = [-3, 3];
        
        const surface3D = create3DSurfacePlot(
            'gradient-visualization',
            wRange,
            bRange,
            lossFunction,
            'Gradient Descent on 3D Loss Surface'
        );
        
        // Add the current point to the 3D plot
        const currentLoss = lossFunction(state.weights[0], state.bias);
        surface3D.addPoint(state.weights[0], state.bias, currentLoss);
        
        // Add a path for gradient descent
        surface3D.addPath([{ x: state.weights[0], y: state.bias, z: currentLoss }]);
        
        // Store reference to the 3D plot
        state.surface3D = surface3D;
    } else {
        // Create a contour plot for the loss function
        const wRange = [-3, 3];
        const bRange = [-3, 3];
        
        const contour = createContourPlot(
            'gradient-visualization',
            wRange,
            bRange,
            lossFunction,
            'Gradient Descent on Loss Function'
        );
        
        // Add the current point to the contour plot
        contour.addPoint(state.weights[0], state.bias);
        
        // Add a path for gradient descent
        contour.addPath([{ x: state.weights[0], y: state.bias }]);
        
        // Store reference to the contour plot
        state.contourPlot = contour;
    }
    
    // Create a convergence plot
    const convergencePlot = createLineChart(
        'convergence-plot',
        'Loss Convergence',
        'Iteration',
        'Loss'
    );
    
    // Store reference to the convergence plot
    state.convergencePlot = convergencePlot;
    
    // Calculate initial loss
    const initialLoss = lossFunction(state.weights[0], state.bias);
    state.lossHistory.push(initialLoss);
    
    // Add the initial loss to the convergence plot
    convergencePlot.addLine([0], [initialLoss], 'Loss', '#28a745');
}

// Start the gradient descent animation
function startGradientDescent(state) {
    state.isRunning = true;
    
    // Clear any existing interval
    if (state.interval) {
        clearInterval(state.interval);
    }
    
    // Define the loss function
    const lossFunction = (w, b) => {
        let sum = 0;
        for (const point of state.dataPoints) {
            const prediction = w * point.x + b;
            sum += Math.pow(prediction - point.y, 2);
        }
        return sum / state.dataPoints.length;
    };
    
    // Define the gradient function
    const gradientFunction = (w, b) => {
        let dw = 0;
        let db = 0;
        
        for (const point of state.dataPoints) {
            const prediction = w * point.x + b;
            const error = prediction - point.y;
            
            dw += error * point.x;
            db += error;
        }
        
        dw /= state.dataPoints.length;
        db /= state.dataPoints.length;
        
        return { dw, db };
    };
    
    // Start the animation
    state.interval = setInterval(() => {
        if (state.currentIteration >= state.iterations) {
            pauseGradientDescent(state);
            document.getElementById('start-gradient-descent').textContent = 'Start Gradient Descent';
            return;
        }
        
        // Calculate gradients
        const { dw, db } = gradientFunction(state.weights[0], state.bias);
        
        // Update parameters
        state.weights[0] -= state.learningRate * dw;
        state.bias -= state.learningRate * db;
        
        // Calculate new loss
        const newLoss = lossFunction(state.weights[0], state.bias);
        
        // Update histories
        state.lossHistory.push(newLoss);
        state.weightHistory.push([...state.weights]);
        state.biasHistory.push(state.bias);
        
        // Update current iteration
        state.currentIteration++;
        
        // Update visualizations
        updateGradientVisualization(state, lossFunction);
        
    }, state.animationSpeed);
}

// Pause the gradient descent animation
function pauseGradientDescent(state) {
    state.isRunning = false;
    
    if (state.interval) {
        clearInterval(state.interval);
        state.interval = null;
    }
}

// Reset the gradient descent
function resetGradientDescent(state) {
    pauseGradientDescent(state);
    
    // Reset state
    state.weights = [0];
    state.bias = 0;
    state.lossHistory = [];
    state.weightHistory = [[0]];
    state.biasHistory = [0];
    state.currentIteration = 0;
    
    // Reinitialize visualization
    initializeGradientVisualization(state);
    
    // Add a regression line visualization
    updateRegressionLinePlotGD(state);
}

// Update the gradient descent visualization
function updateGradientVisualization(state, lossFunction) {
    if (state.showIn3D) {
        // Calculate the current loss
        const currentLoss = lossFunction(state.weights[0], state.bias);
        
        // Update the point on the 3D surface
        state.surface3D.updatePoint(1, state.weights[0], state.bias, currentLoss);
        
        // Update the path on the 3D surface
        const path3D = state.weightHistory.map((w, i) => {
            const loss = state.lossHistory[i];
            return {
                x: w[0],
                y: state.biasHistory[i],
                z: loss
            };
        });
        
        state.surface3D.updatePath(2, path3D);
    } else {
        // Update the point on the contour plot
        state.contourPlot.updatePoint(1, state.weights[0], state.bias);
        
        // Update the path on the contour plot
        const path = state.weightHistory.map((w, i) => ({
            x: w[0],
            y: state.biasHistory[i]
        }));
        
        state.contourPlot.updatePath(2, path);
    }
    
    // Update the convergence plot
    const iterations = Array.from({ length: state.lossHistory.length }, (_, i) => i);
    state.convergencePlot.updateLine(0, iterations, state.lossHistory);
    
    // Update the regression line plot
    updateRegressionLinePlotGD(state);
}

// Update the regression line plot for gradient descent
function updateRegressionLinePlotGD(state) {
    // Check if the regression line container exists
    let regressionContainer = document.getElementById('gd-regression-line');
    
    if (!regressionContainer) {
        // Create the container
        regressionContainer = document.createElement('div');
        regressionContainer.id = 'gd-regression-line';
        regressionContainer.className = 'visualization-container mt-3';
        document.getElementById('convergence-plot').parentNode.appendChild(regressionContainer);
    }
    
    // Get the data points
    const xValues = state.dataPoints.map(point => point.x);
    const yValues = state.dataPoints.map(point => point.y);
    
    // Create the regression line
    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const xLine = [xMin, xMax];
    const yLine = xLine.map(x => state.weights[0] * x + state.bias);
    
    // Calculate predictions
    const predictions = xValues.map(x => state.weights[0] * x + state.bias);
    
    // Calculate MSE
    let mse = 0;
    for (let i = 0; i < yValues.length; i++) {
        mse += Math.pow(predictions[i] - yValues[i], 2);
    }
    mse /= yValues.length;
    
    // Create the plot
    const data = [
        {
            type: 'scatter',
            mode: 'markers',
            x: xValues,
            y: yValues,
            marker: {
                size: 8,
                color: 'rgba(0, 123, 255, 0.7)',
                line: {
                    color: 'rgba(0, 123, 255, 1.0)',
                    width: 1
                }
            },
            name: 'Data Points'
        },
        {
            type: 'scatter',
            mode: 'lines',
            x: xLine,
            y: yLine,
            line: {
                color: 'rgba(255, 87, 34, 0.8)',
                width: 2
            },
            name: 'Regression Line'
        }
    ];
    
    // Add error lines
    for (let i = 0; i < xValues.length; i++) {
        data.push({
            type: 'scatter',
            mode: 'lines',
            x: [xValues[i], xValues[i]],
            y: [yValues[i], predictions[i]],
            line: {
                color: 'rgba(255, 0, 0, 0.5)',
                width: 1,
                dash: 'dash'
            },
            showlegend: i === 0,
            name: i === 0 ? 'Errors' : undefined
        });
    }
    
    const layout = {
        title: `Regression Line (MSE: ${mse.toFixed(4)}, Iteration: ${state.currentIteration})`,
        autosize: true,
        margin: {
            l: 50,
            r: 50,
            b: 50,
            t: 50,
            pad: 4
        },
        xaxis: { title: 'x' },
        yaxis: { title: 'y' },
        showlegend: true,
        legend: {
            x: 0,
            y: 1
        }
    };
    
    Plotly.newPlot('gd-regression-line', data, layout, { responsive: true });
    
    // Add a table showing the current parameters and gradients
    updateParameterTable(state);
}

// Update the parameter table
function updateParameterTable(state) {
    // Check if the parameter table container exists
    let tableContainer = document.getElementById('parameter-table-container');
    
    if (!tableContainer) {
        // Create the container
        tableContainer = document.createElement('div');
        tableContainer.id = 'parameter-table-container';
        tableContainer.className = 'mt-3';
        document.getElementById('gd-regression-line').parentNode.appendChild(tableContainer);
    }
    
    // Define the gradient function
    const gradientFunction = (w, b) => {
        let dw = 0;
        let db = 0;
        
        for (const point of state.dataPoints) {
            const prediction = w * point.x + b;
            const error = prediction - point.y;
            
            dw += error * point.x;
            db += error;
        }
        
        dw /= state.dataPoints.length;
        db /= state.dataPoints.length;
        
        return { dw, db };
    };
    
    // Calculate gradients
    const { dw, db } = gradientFunction(state.weights[0], state.bias);
    
    // Create the table
    tableContainer.innerHTML = `
        <div class="card">
            <div class="card-header bg-primary text-white">
                <h5 class="mb-0">Current Parameters and Gradients</h5>
            </div>
            <div class="card-body">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Parameter</th>
                            <th>Value</th>
                            <th>Gradient</th>
                            <th>Update</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Weight (w)</td>
                            <td>${state.weights[0].toFixed(4)}</td>
                            <td>${dw.toFixed(4)}</td>
                            <td>-${(state.learningRate * dw).toFixed(4)}</td>
                        </tr>
                        <tr>
                            <td>Bias (b)</td>
                            <td>${state.bias.toFixed(4)}</td>
                            <td>${db.toFixed(4)}</td>
                            <td>-${(state.learningRate * db).toFixed(4)}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="alert alert-info">
                    <strong>Learning Rate (α):</strong> ${state.learningRate}<br>
                    <strong>Iteration:</strong> ${state.currentIteration} / ${state.iterations}<br>
                    <strong>Current Loss:</strong> ${state.lossHistory[state.lossHistory.length - 1].toFixed(4)}
                </div>
                <div class="text-center">
                    <div class="progress mb-3">
                        <div class="progress-bar bg-success" role="progressbar" style="width: ${(state.currentIteration / state.iterations * 100).toFixed(0)}%">
                            ${(state.currentIteration / state.iterations * 100).toFixed(0)}%
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
} 
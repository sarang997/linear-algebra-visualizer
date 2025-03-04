/**
 * Loss Function Visualization
 */

// Initialize the loss function visualization
function initLossFunctionVisualization() {
    // Render the loss function equation
    renderEquation('loss-equation', 'J(\\theta) = \\frac{1}{m} \\sum_{i=1}^{m} (h_\\theta(x^{(i)}) - y^{(i)})^2');
    
    // Initialize state
    const state = {
        dataPoints: [],
        weights: [0, 0],
        bias: 0,
        lossHistory: []
    };
    
    // Generate random data
    generateData(state);
    
    // Create data points controls
    createDataPointsControls(state);
    
    // Initialize loss surface visualization
    initializeLossSurface(state);
    
    // Add event listener for generate data button
    document.getElementById('generate-data').addEventListener('click', () => {
        generateData(state);
        createDataPointsControls(state);
        initializeLossSurface(state);
    });
}

// Generate random data for the loss function visualization
function generateData(state) {
    const randomData = generateRandomData(10, 1, 0.5);
    state.dataPoints = randomData.data.map(point => ({
        x: point.features[0],
        y: point.y
    }));
    
    // Reset weights and bias
    state.weights = [0, 0];
    state.bias = 0;
    state.lossHistory = [];
}

// Create controls for data points
function createDataPointsControls(state) {
    const container = document.getElementById('data-points-container');
    container.innerHTML = '';
    
    // Create a table for data points
    const table = document.createElement('table');
    table.className = 'table table-sm';
    
    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    const indexHeader = document.createElement('th');
    indexHeader.textContent = '#';
    
    const xHeader = document.createElement('th');
    xHeader.textContent = 'x';
    
    const yHeader = document.createElement('th');
    yHeader.textContent = 'y';
    
    headerRow.appendChild(indexHeader);
    headerRow.appendChild(xHeader);
    headerRow.appendChild(yHeader);
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Create table body
    const tbody = document.createElement('tbody');
    
    state.dataPoints.forEach((point, index) => {
        const row = document.createElement('tr');
        
        const indexCell = document.createElement('td');
        indexCell.textContent = index + 1;
        
        const xCell = document.createElement('td');
        xCell.textContent = point.x.toFixed(2);
        
        const yCell = document.createElement('td');
        yCell.textContent = point.y.toFixed(2);
        
        row.appendChild(indexCell);
        row.appendChild(xCell);
        row.appendChild(yCell);
        tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    container.appendChild(table);
}

// Initialize the loss surface visualization
function initializeLossSurface(state) {
    // Clear any existing visualizations
    const lossSection = document.querySelector('#loss-function .card-body .col-md-6:last-child');
    lossSection.innerHTML = '<div id="loss-visualization" class="visualization-container"></div>';
    
    // Remove any existing additional containers
    const existingContainers = document.querySelectorAll('#loss-contour, #loss-controls, #regression-line');
    existingContainers.forEach(container => {
        if (container && container.parentNode) {
            container.parentNode.removeChild(container);
        }
    });
    
    const container = document.getElementById('loss-visualization');
    
    // For simplicity, we'll visualize the loss surface for a simple linear regression
    // with one feature (y = w*x + b) by varying w and b
    
    // Define the loss function
    const lossFunction = (w, b) => {
        let sum = 0;
        for (const point of state.dataPoints) {
            const prediction = w * point.x + b;
            sum += Math.pow(prediction - point.y, 2);
        }
        return sum / state.dataPoints.length;
    };
    
    // Create a 3D surface plot
    const wRange = [-3, 3];
    const bRange = [-3, 3];
    
    const lossSurface = create3DSurfacePlot(
        'loss-visualization',
        wRange,
        bRange,
        lossFunction,
        'Mean Squared Error Loss Surface'
    );
    
    // Add the current point
    const currentLoss = lossFunction(state.weights[0], state.bias);
    lossSurface.addPoint(state.weights[0], state.bias, currentLoss);
    
    // Create a contour plot below the 3D surface
    const contourPlot = document.createElement('div');
    contourPlot.id = 'loss-contour';
    contourPlot.className = 'visualization-container mt-3';
    container.parentNode.appendChild(contourPlot);
    
    const contour = createContourPlot(
        'loss-contour',
        wRange,
        bRange,
        lossFunction,
        'Loss Contour Plot'
    );
    
    // Add the current point to the contour plot
    contour.addPoint(state.weights[0], state.bias);
    
    // Add interactive elements
    addLossInteractivity(state, lossFunction, lossSurface, contour);
}

// Add interactivity to the loss visualization
function addLossInteractivity(state, lossFunction, lossSurface, contour) {
    // Create sliders for weight and bias
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'controls mt-3';
    controlsContainer.id = 'loss-controls';
    document.getElementById('loss-contour').parentNode.appendChild(controlsContainer);
    
    // Create weight slider
    const weightSlider = createParameterSlider(
        'loss-controls',
        'loss-weight-slider',
        'Weight (w)',
        -3,
        3,
        0.1,
        state.weights[0],
        (value) => {
            state.weights[0] = value;
            updateLossVisualization(state, lossFunction, lossSurface, contour);
        }
    );
    
    // Create bias slider
    const biasSlider = createParameterSlider(
        'loss-controls',
        'loss-bias-slider',
        'Bias (b)',
        -3,
        3,
        0.1,
        state.bias,
        (value) => {
            state.bias = value;
            updateLossVisualization(state, lossFunction, lossSurface, contour);
        }
    );
    
    // Add a regression line visualization
    const regressionContainer = document.createElement('div');
    regressionContainer.id = 'regression-line';
    regressionContainer.className = 'visualization-container mt-3';
    document.getElementById('loss-controls').parentNode.appendChild(regressionContainer);
    
    // Create the regression line plot
    updateRegressionLinePlot(state);
}

// Update the loss visualization
function updateLossVisualization(state, lossFunction, lossSurface, contour) {
    // Calculate the current loss
    const currentLoss = lossFunction(state.weights[0], state.bias);
    
    // Update the point on the 3D surface
    lossSurface.updatePoint(1, state.weights[0], state.bias, currentLoss);
    
    // Update the point on the contour plot
    contour.updatePoint(1, state.weights[0], state.bias);
    
    // Update the regression line plot
    updateRegressionLinePlot(state);
    
    // Add to loss history
    state.lossHistory.push({
        weight: state.weights[0],
        bias: state.bias,
        loss: currentLoss
    });
}

// Update the regression line plot
function updateRegressionLinePlot(state) {
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
        title: `Regression Line (MSE: ${mse.toFixed(4)})`,
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
    
    Plotly.newPlot('regression-line', data, layout, { responsive: true });
} 
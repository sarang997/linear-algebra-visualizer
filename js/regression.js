/**
 * Multivariate Regression Visualization
 */

// Initialize the regression visualization
function initRegressionVisualization() {
    // Render the regression equation
    renderEquation('regression-equation', '\\hat{y} = \\theta_0 + \\theta_1 x_1 + \\theta_2 x_2 + ... + \\theta_n x_n');
    
    // Initialize state
    const state = {
        features: 2,
        weights: [0.5, 0.5],
        bias: 0,
        dataPoints: [],
        sliders: []
    };
    
    // Generate random data
    const randomData = generateRandomData(30, state.features, 1);
    state.dataPoints = randomData.data;
    
    // Extract X and y from data points
    const X = state.dataPoints.map(point => point.features);
    const y = state.dataPoints.map(point => point.y);
    
    // Create parameter controls
    createParameterControls(state);
    
    // Initialize visualization
    if (state.features === 2) {
        // For 2 features, we can visualize in 3D
        initializeRegressionPlot(state, X, y);
    } else {
        // For other numbers of features, show a different visualization
        initializeMultiFeatureVisualization(state, X, y);
    }
    
    // Add event listeners for buttons
    document.getElementById('add-feature').addEventListener('click', () => {
        if (state.features < 5) {
            state.features++;
            state.weights.push(0.5);
            
            // Regenerate data
            const newData = generateRandomData(30, state.features, 1);
            state.dataPoints = newData.data;
            
            // Extract X and y from data points
            const newX = state.dataPoints.map(point => point.features);
            const newY = state.dataPoints.map(point => point.y);
            
            // Update controls and visualization
            createParameterControls(state);
            
            if (state.features === 2) {
                initializeRegressionPlot(state, newX, newY);
            } else {
                initializeMultiFeatureVisualization(state, newX, newY);
            }
        }
    });
    
    document.getElementById('remove-feature').addEventListener('click', () => {
        if (state.features > 1) {
            state.features--;
            state.weights.pop();
            
            // Regenerate data
            const newData = generateRandomData(30, state.features, 1);
            state.dataPoints = newData.data;
            
            // Extract X and y from data points
            const newX = state.dataPoints.map(point => point.features);
            const newY = state.dataPoints.map(point => point.y);
            
            // Update controls and visualization
            createParameterControls(state);
            
            if (state.features === 2) {
                initializeRegressionPlot(state, newX, newY);
            } else {
                initializeMultiFeatureVisualization(state, newX, newY);
            }
        }
    });
}

// Create parameter controls for weights and bias
function createParameterControls(state) {
    const container = document.getElementById('parameter-controls');
    container.innerHTML = '';
    state.sliders = [];
    
    // Create bias slider
    const biasSlider = createParameterSlider(
        'parameter-controls',
        'bias-slider',
        'Bias (θ₀)',
        -5,
        5,
        0.1,
        state.bias,
        (value) => {
            state.bias = value;
            updateRegressionVisualization(state);
        }
    );
    state.sliders.push(biasSlider);
    
    // Create weight sliders
    for (let i = 0; i < state.features; i++) {
        const weightSlider = createParameterSlider(
            'parameter-controls',
            `weight-${i}-slider`,
            `Weight ${i+1} (θ${i+1})`,
            -5,
            5,
            0.1,
            state.weights[i],
            (value) => {
                state.weights[i] = value;
                updateRegressionVisualization(state);
            }
        );
        state.sliders.push(weightSlider);
    }
}

// Initialize the 3D regression plot for 2 features
function initializeRegressionPlot(state, X, y) {
    const container = document.getElementById('regression-visualization');
    container.innerHTML = '';
    
    // Create a 3D scatter plot
    const data = [{
        type: 'scatter3d',
        mode: 'markers',
        x: X.map(point => point[0]),
        y: X.map(point => point[1]),
        z: y,
        marker: {
            size: 5,
            color: y,
            colorscale: 'Viridis',
            opacity: 0.8
        },
        name: 'Data Points'
    }];
    
    // Create the regression plane
    const xRange = [Math.min(...X.map(point => point[0])), Math.max(...X.map(point => point[0]))];
    const yRange = [Math.min(...X.map(point => point[1])), Math.max(...X.map(point => point[1]))];
    
    const xGrid = [];
    const yGrid = [];
    const zGrid = [];
    
    for (let x = xRange[0]; x <= xRange[1]; x += (xRange[1] - xRange[0]) / 10) {
        for (let y = yRange[0]; y <= yRange[1]; y += (yRange[1] - yRange[0]) / 10) {
            xGrid.push(x);
            yGrid.push(y);
            zGrid.push(state.bias + state.weights[0] * x + state.weights[1] * y);
        }
    }
    
    const plane = {
        type: 'mesh3d',
        x: xGrid,
        y: yGrid,
        z: zGrid,
        opacity: 0.7,
        color: '#ff7f0e',
        name: 'Regression Plane'
    };
    
    data.push(plane);
    
    const layout = {
        autosize: true,
        margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 0,
            pad: 4
        },
        scene: {
            xaxis: { title: 'Feature 1' },
            yaxis: { title: 'Feature 2' },
            zaxis: { title: 'Target (y)' },
            camera: {
                eye: { x: 1.5, y: 1.5, z: 1 }
            }
        }
    };
    
    Plotly.newPlot('regression-visualization', data, layout, { responsive: true });
}

// Update the regression visualization
function updateRegressionVisualization(state) {
    const container = document.getElementById('regression-visualization');
    
    if (state.features === 2) {
        // Update the regression plane
        const X = state.dataPoints.map(point => point.features);
        const xRange = [Math.min(...X.map(point => point[0])), Math.max(...X.map(point => point[0]))];
        const yRange = [Math.min(...X.map(point => point[1])), Math.max(...X.map(point => point[1]))];
        
        const xGrid = [];
        const yGrid = [];
        const zGrid = [];
        
        for (let x = xRange[0]; x <= xRange[1]; x += (xRange[1] - xRange[0]) / 10) {
            for (let y = yRange[0]; y <= yRange[1]; y += (yRange[1] - yRange[0]) / 10) {
                xGrid.push(x);
                yGrid.push(y);
                zGrid.push(state.bias + state.weights[0] * x + state.weights[1] * y);
            }
        }
        
        Plotly.restyle('regression-visualization', {
            x: [xGrid],
            y: [yGrid],
            z: [zGrid]
        }, 1);
    } else {
        // Update the multi-feature visualization
        updateMultiFeatureVisualization(state);
    }
}

// Initialize visualization for more than 2 features
function initializeMultiFeatureVisualization(state, X, y) {
    const container = document.getElementById('regression-visualization');
    container.innerHTML = '';
    
    // Create a 2D scatter plot of actual vs predicted values
    const yPred = predict(X, state.weights, state.bias);
    
    const data = [{
        type: 'scatter',
        mode: 'markers',
        x: y,
        y: yPred,
        marker: {
            size: 8,
            color: 'rgba(0, 123, 255, 0.7)',
            line: {
                color: 'rgba(0, 123, 255, 1.0)',
                width: 1
            }
        },
        name: 'Predictions'
    }, {
        type: 'scatter',
        mode: 'lines',
        x: [Math.min(...y), Math.max(...y)],
        y: [Math.min(...y), Math.max(...y)],
        line: {
            color: 'rgba(255, 0, 0, 0.5)',
            width: 2,
            dash: 'dash'
        },
        name: 'Perfect Predictions'
    }];
    
    const layout = {
        autosize: true,
        margin: {
            l: 50,
            r: 50,
            b: 50,
            t: 20,
            pad: 4
        },
        xaxis: { title: 'Actual Values' },
        yaxis: { title: 'Predicted Values' },
        showlegend: true,
        legend: {
            x: 0,
            y: 1
        }
    };
    
    Plotly.newPlot('regression-visualization', data, layout, { responsive: true });
    
    // Add feature importance bar chart
    const featureImportance = document.createElement('div');
    featureImportance.id = 'feature-importance';
    featureImportance.className = 'visualization-container mt-3';
    container.parentNode.appendChild(featureImportance);
    
    const importanceData = [{
        type: 'bar',
        x: state.weights.map((_, i) => `Feature ${i+1}`),
        y: state.weights.map(w => Math.abs(w)),
        marker: {
            color: 'rgba(0, 123, 255, 0.7)'
        },
        name: 'Feature Importance'
    }];
    
    const importanceLayout = {
        title: 'Feature Importance (Absolute Weight Values)',
        autosize: true,
        margin: {
            l: 50,
            r: 50,
            b: 50,
            t: 50,
            pad: 4
        },
        xaxis: { title: 'Features' },
        yaxis: { title: 'Importance' }
    };
    
    Plotly.newPlot('feature-importance', importanceData, importanceLayout, { responsive: true });
}

// Update the multi-feature visualization
function updateMultiFeatureVisualization(state) {
    const X = state.dataPoints.map(point => point.features);
    const y = state.dataPoints.map(point => point.y);
    const yPred = predict(X, state.weights, state.bias);
    
    Plotly.restyle('regression-visualization', {
        y: [yPred]
    }, 0);
    
    // Update feature importance
    Plotly.restyle('feature-importance', {
        y: [state.weights.map(w => Math.abs(w))]
    }, 0);
} 
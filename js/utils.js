/**
 * Utility functions for the Linear Algebra Visualizer
 */

// Render mathematical equations using KaTeX
function renderEquation(elementId, equation) {
    const element = document.getElementById(elementId);
    if (element) {
        katex.render(equation, element, {
            throwOnError: false,
            displayMode: true
        });
    }
}

// Create a tooltip div for visualizations
function createTooltip() {
    const tooltip = d3.select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);
    
    return tooltip;
}

// Generate random data for demonstrations
function generateRandomData(n = 20, features = 2, noise = 0.5) {
    const data = [];
    
    // Generate random weights for the true model
    const trueWeights = Array(features).fill().map(() => Math.random() * 4 - 2);
    const trueBias = Math.random() * 4 - 2;
    
    for (let i = 0; i < n; i++) {
        const point = {
            features: Array(features).fill().map(() => Math.random() * 10 - 5)
        };
        
        // Calculate true y value based on linear model with some noise
        let y = trueBias;
        for (let j = 0; j < features; j++) {
            y += point.features[j] * trueWeights[j];
        }
        
        // Add random noise
        y += (Math.random() * 2 - 1) * noise;
        
        point.y = y;
        data.push(point);
    }
    
    return {
        data,
        trueWeights,
        trueBias
    };
}

// Calculate predicted values using the current model
function predict(X, weights, bias) {
    return X.map(x => {
        let prediction = bias;
        for (let i = 0; i < weights.length; i++) {
            prediction += x[i] * weights[i];
        }
        return prediction;
    });
}

// Calculate Mean Squared Error loss
function calculateMSE(yTrue, yPred) {
    let sum = 0;
    for (let i = 0; i < yTrue.length; i++) {
        sum += Math.pow(yTrue[i] - yPred[i], 2);
    }
    return sum / yTrue.length;
}

// Calculate gradients for weights and bias
function calculateGradients(X, yTrue, yPred, weights) {
    const m = yTrue.length;
    const gradients = Array(weights.length).fill(0);
    let biasGradient = 0;
    
    for (let i = 0; i < m; i++) {
        const error = yPred[i] - yTrue[i];
        
        // Gradient for bias
        biasGradient += error;
        
        // Gradients for weights
        for (let j = 0; j < weights.length; j++) {
            gradients[j] += error * X[i][j];
        }
    }
    
    // Average gradients
    biasGradient /= m;
    for (let j = 0; j < weights.length; j++) {
        gradients[j] /= m;
    }
    
    return {
        weightGradients: gradients,
        biasGradient
    };
}

// Update weights and bias using gradient descent
function updateParameters(weights, bias, weightGradients, biasGradient, learningRate) {
    const newWeights = weights.map((w, i) => w - learningRate * weightGradients[i]);
    const newBias = bias - learningRate * biasGradient;
    
    return {
        weights: newWeights,
        bias: newBias
    };
}

// Create a slider control for a parameter
function createParameterSlider(containerId, id, label, min, max, step, value, onChange) {
    const container = document.getElementById(containerId);
    
    const controlDiv = document.createElement('div');
    controlDiv.className = 'parameter-control';
    
    const labelElement = document.createElement('label');
    labelElement.htmlFor = id;
    labelElement.textContent = label;
    
    const inputElement = document.createElement('input');
    inputElement.type = 'range';
    inputElement.className = 'form-range';
    inputElement.id = id;
    inputElement.min = min;
    inputElement.max = max;
    inputElement.step = step;
    inputElement.value = value;
    
    const valueDisplay = document.createElement('span');
    valueDisplay.className = 'value';
    valueDisplay.textContent = value;
    
    inputElement.addEventListener('input', function() {
        valueDisplay.textContent = this.value;
        if (onChange) {
            onChange(parseFloat(this.value));
        }
    });
    
    controlDiv.appendChild(labelElement);
    controlDiv.appendChild(inputElement);
    controlDiv.appendChild(valueDisplay);
    
    container.appendChild(controlDiv);
    
    return {
        element: inputElement,
        setValue: function(newValue) {
            inputElement.value = newValue;
            valueDisplay.textContent = newValue;
            if (onChange) {
                onChange(parseFloat(newValue));
            }
        },
        getValue: function() {
            return parseFloat(inputElement.value);
        }
    };
}

// Create a 3D surface plot using Plotly
function create3DSurfacePlot(containerId, xRange, yRange, zFunc, title) {
    const container = document.getElementById(containerId);
    
    // Generate x and y values
    const xValues = [];
    const yValues = [];
    
    for (let x = xRange[0]; x <= xRange[1]; x += (xRange[1] - xRange[0]) / 50) {
        xValues.push(x);
    }
    
    for (let y = yRange[0]; y <= yRange[1]; y += (yRange[1] - yRange[0]) / 50) {
        yValues.push(y);
    }
    
    // Generate z values
    const zValues = [];
    for (let i = 0; i < yValues.length; i++) {
        const row = [];
        for (let j = 0; j < xValues.length; j++) {
            row.push(zFunc(xValues[j], yValues[i]));
        }
        zValues.push(row);
    }
    
    // Create the plot
    const data = [{
        type: 'surface',
        x: xValues,
        y: yValues,
        z: zValues,
        colorscale: 'Viridis'
    }];
    
    const layout = {
        title: title,
        autosize: true,
        margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 30,
            pad: 4
        },
        scene: {
            xaxis: { title: 'Weight 1' },
            yaxis: { title: 'Weight 2' },
            zaxis: { title: 'Loss' },
            camera: {
                eye: { x: 1.5, y: 1.5, z: 1 }
            }
        }
    };
    
    Plotly.newPlot(containerId, data, layout, { responsive: true });
    
    return {
        addPoint: function(x, y, z) {
            const pointData = {
                type: 'scatter3d',
                mode: 'markers',
                x: [x],
                y: [y],
                z: [z],
                marker: {
                    size: 5,
                    color: 'red'
                },
                name: 'Current Point'
            };
            
            Plotly.addTraces(containerId, pointData);
        },
        addPath: function(path) {
            const pathData = {
                type: 'scatter3d',
                mode: 'lines',
                x: path.map(p => p.x),
                y: path.map(p => p.y),
                z: path.map(p => p.z),
                line: {
                    color: 'red',
                    width: 4
                },
                name: 'Gradient Path'
            };
            
            Plotly.addTraces(containerId, pathData);
        },
        updatePoint: function(index, x, y, z) {
            Plotly.restyle(containerId, {
                x: [[x]],
                y: [[y]],
                z: [[z]]
            }, index);
        },
        updatePath: function(index, path) {
            Plotly.restyle(containerId, {
                x: [path.map(p => p.x)],
                y: [path.map(p => p.y)],
                z: [path.map(p => p.z)]
            }, index);
        }
    };
}

// Create a 2D contour plot using Plotly
function createContourPlot(containerId, xRange, yRange, zFunc, title) {
    const container = document.getElementById(containerId);
    
    // Generate x and y values
    const xValues = [];
    const yValues = [];
    
    for (let x = xRange[0]; x <= xRange[1]; x += (xRange[1] - xRange[0]) / 100) {
        xValues.push(x);
    }
    
    for (let y = yRange[0]; y <= yRange[1]; y += (yRange[1] - yRange[0]) / 100) {
        yValues.push(y);
    }
    
    // Generate z values
    const zValues = [];
    for (let i = 0; i < yValues.length; i++) {
        const row = [];
        for (let j = 0; j < xValues.length; j++) {
            row.push(zFunc(xValues[j], yValues[i]));
        }
        zValues.push(row);
    }
    
    // Create the plot
    const data = [{
        type: 'contour',
        x: xValues,
        y: yValues,
        z: zValues,
        colorscale: 'Viridis',
        contours: {
            coloring: 'heatmap',
            showlabels: true
        }
    }];
    
    const layout = {
        title: title,
        autosize: true,
        margin: {
            l: 50,
            r: 50,
            b: 50,
            t: 50,
            pad: 4
        },
        xaxis: { title: 'Weight 1' },
        yaxis: { title: 'Weight 2' }
    };
    
    Plotly.newPlot(containerId, data, layout, { responsive: true });
    
    return {
        addPoint: function(x, y) {
            const pointData = {
                type: 'scatter',
                mode: 'markers',
                x: [x],
                y: [y],
                marker: {
                    size: 10,
                    color: 'red'
                },
                name: 'Current Point'
            };
            
            Plotly.addTraces(containerId, pointData);
        },
        addPath: function(path) {
            const pathData = {
                type: 'scatter',
                mode: 'lines+markers',
                x: path.map(p => p.x),
                y: path.map(p => p.y),
                line: {
                    color: 'red',
                    width: 2
                },
                marker: {
                    size: 5,
                    color: 'red'
                },
                name: 'Gradient Path'
            };
            
            Plotly.addTraces(containerId, pathData);
        },
        updatePoint: function(index, x, y) {
            Plotly.restyle(containerId, {
                x: [[x]],
                y: [[y]]
            }, index);
        },
        updatePath: function(index, path) {
            Plotly.restyle(containerId, {
                x: [path.map(p => p.x)],
                y: [path.map(p => p.y)]
            }, index);
        }
    };
}

// Create a line chart using Plotly
function createLineChart(containerId, title, xLabel, yLabel) {
    const container = document.getElementById(containerId);
    
    const layout = {
        title: title,
        autosize: true,
        margin: {
            l: 50,
            r: 50,
            b: 50,
            t: 50,
            pad: 4
        },
        xaxis: { title: xLabel },
        yaxis: { title: yLabel }
    };
    
    Plotly.newPlot(containerId, [], layout, { responsive: true });
    
    return {
        addLine: function(x, y, name, color) {
            const lineData = {
                type: 'scatter',
                mode: 'lines',
                x: x,
                y: y,
                line: {
                    color: color || 'blue',
                    width: 2
                },
                name: name
            };
            
            Plotly.addTraces(containerId, lineData);
        },
        updateLine: function(index, x, y) {
            Plotly.restyle(containerId, {
                x: [x],
                y: [y]
            }, index);
        }
    };
} 
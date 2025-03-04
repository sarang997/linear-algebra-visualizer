/**
 * Vector Visualization
 */

// Initialize the vector visualization
function initVectorVisualization() {
    // Render the vector equation
    renderEquation('vector-equation', '\\vec{v} = (v_x, v_y, v_z)');
    
    // Initialize state
    const state = {
        vector1: { x: 1, y: 0, z: 0 },
        vector2: { x: 0, y: 1, z: 0 },
        resultVector: null,
        showUnitVectors: true,
        show3D: true,
        scene: null,
        renderer: null,
        camera: null,
        controls: null,
        vectors: {
            vector1: null,
            vector2: null,
            result: null,
            unitX: null,
            unitY: null,
            unitZ: null
        },
        plot2D: null
    };
    
    // Initialize the visualization
    if (state.show3D) {
        init3DVectorVisualization(state);
    } else {
        init2DVectorVisualization(state);
    }
    
    // Add event listeners for vector inputs
    document.getElementById('vector1-x').addEventListener('input', function() {
        state.vector1.x = parseFloat(this.value) || 0;
        updateVectorVisualization(state);
    });
    
    document.getElementById('vector1-y').addEventListener('input', function() {
        state.vector1.y = parseFloat(this.value) || 0;
        updateVectorVisualization(state);
    });
    
    document.getElementById('vector1-z').addEventListener('input', function() {
        state.vector1.z = parseFloat(this.value) || 0;
        updateVectorVisualization(state);
    });
    
    document.getElementById('vector2-x').addEventListener('input', function() {
        state.vector2.x = parseFloat(this.value) || 0;
        updateVectorVisualization(state);
    });
    
    document.getElementById('vector2-y').addEventListener('input', function() {
        state.vector2.y = parseFloat(this.value) || 0;
        updateVectorVisualization(state);
    });
    
    document.getElementById('vector2-z').addEventListener('input', function() {
        state.vector2.z = parseFloat(this.value) || 0;
        updateVectorVisualization(state);
    });
    
    // Add event listeners for checkboxes
    document.getElementById('show-unit-vectors').addEventListener('change', function() {
        state.showUnitVectors = this.checked;
        updateVectorVisualization(state);
    });
    
    document.getElementById('show-3d').addEventListener('change', function() {
        state.show3D = this.checked;
        
        // Reinitialize the visualization
        if (state.show3D) {
            init3DVectorVisualization(state);
        } else {
            init2DVectorVisualization(state);
        }
    });
    
    // Add event listeners for vector operations
    document.getElementById('add-vectors').addEventListener('click', function() {
        const result = {
            x: state.vector1.x + state.vector2.x,
            y: state.vector1.y + state.vector2.y,
            z: state.vector1.z + state.vector2.z
        };
        
        state.resultVector = result;
        updateVectorVisualization(state);
        
        // Show the result
        const resultElement = document.getElementById('vector-result');
        resultElement.classList.remove('d-none');
        document.getElementById('vector-result-value').textContent = `(${result.x.toFixed(2)}, ${result.y.toFixed(2)}, ${result.z.toFixed(2)})`;
    });
    
    document.getElementById('subtract-vectors').addEventListener('click', function() {
        const result = {
            x: state.vector1.x - state.vector2.x,
            y: state.vector1.y - state.vector2.y,
            z: state.vector1.z - state.vector2.z
        };
        
        state.resultVector = result;
        updateVectorVisualization(state);
        
        // Show the result
        const resultElement = document.getElementById('vector-result');
        resultElement.classList.remove('d-none');
        document.getElementById('vector-result-value').textContent = `(${result.x.toFixed(2)}, ${result.y.toFixed(2)}, ${result.z.toFixed(2)})`;
    });
    
    document.getElementById('dot-product').addEventListener('click', function() {
        const result = state.vector1.x * state.vector2.x + 
                      state.vector1.y * state.vector2.y + 
                      state.vector1.z * state.vector2.z;
        
        state.resultVector = null;
        updateVectorVisualization(state);
        
        // Show the result
        const resultElement = document.getElementById('vector-result');
        resultElement.classList.remove('d-none');
        document.getElementById('vector-result-value').textContent = result.toFixed(2);
        
        // Add explanation
        const magnitude1 = Math.sqrt(state.vector1.x * state.vector1.x + state.vector1.y * state.vector1.y + state.vector1.z * state.vector1.z);
        const magnitude2 = Math.sqrt(state.vector2.x * state.vector2.x + state.vector2.y * state.vector2.y + state.vector2.z * state.vector2.z);
        
        if (magnitude1 > 0 && magnitude2 > 0) {
            const cosTheta = result / (magnitude1 * magnitude2);
            const angleRadians = Math.acos(Math.min(Math.max(cosTheta, -1), 1));
            const angleDegrees = angleRadians * 180 / Math.PI;
            
            document.getElementById('vector-result-value').textContent += ` (|v₁|·|v₂|·cos(θ) = ${magnitude1.toFixed(2)} × ${magnitude2.toFixed(2)} × cos(${angleDegrees.toFixed(1)}°))`;
        }
    });
    
    document.getElementById('cross-product').addEventListener('click', function() {
        const result = {
            x: state.vector1.y * state.vector2.z - state.vector1.z * state.vector2.y,
            y: state.vector1.z * state.vector2.x - state.vector1.x * state.vector2.z,
            z: state.vector1.x * state.vector2.y - state.vector1.y * state.vector2.x
        };
        
        state.resultVector = result;
        updateVectorVisualization(state);
        
        // Show the result
        const resultElement = document.getElementById('vector-result');
        resultElement.classList.remove('d-none');
        document.getElementById('vector-result-value').textContent = `(${result.x.toFixed(2)}, ${result.y.toFixed(2)}, ${result.z.toFixed(2)})`;
        
        // Add explanation about perpendicularity
        const magnitude = Math.sqrt(result.x * result.x + result.y * result.y + result.z * result.z);
        document.getElementById('vector-result-value').textContent += ` (Magnitude: ${magnitude.toFixed(2)})`;
    });
}

// Initialize 3D vector visualization using Three.js
function init3DVectorVisualization(state) {
    // Clear the container
    const container = document.getElementById('vector-visualization-container');
    container.innerHTML = '';
    
    // Create a scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f9fa);
    
    // Create a camera
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);
    
    // Create a renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Add orbit controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    
    // Add a grid
    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);
    
    // Add axes
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    
    // Create vectors
    state.vectors = {
        vector1: createArrow(scene, state.vector1, 0xff0000), // Red
        vector2: createArrow(scene, state.vector2, 0x0000ff), // Blue
        result: null,
        unitX: createArrow(scene, { x: 1, y: 0, z: 0 }, 0xff0000, 0.5), // Red
        unitY: createArrow(scene, { x: 0, y: 1, z: 0 }, 0x00ff00, 0.5), // Green
        unitZ: createArrow(scene, { x: 0, y: 0, z: 1 }, 0x0000ff, 0.5)  // Blue
    };
    
    // Toggle unit vectors visibility
    state.vectors.unitX.visible = state.showUnitVectors;
    state.vectors.unitY.visible = state.showUnitVectors;
    state.vectors.unitZ.visible = state.showUnitVectors;
    
    // Store references
    state.scene = scene;
    state.renderer = renderer;
    state.camera = camera;
    state.controls = controls;
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', function() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

// Initialize 2D vector visualization using Plotly
function init2DVectorVisualization(state) {
    // Clear the container
    const container = document.getElementById('vector-visualization-container');
    container.innerHTML = '';
    
    // Create a 2D plot
    const data = [
        // Vector 1
        {
            type: 'scatter',
            mode: 'lines+markers',
            x: [0, state.vector1.x],
            y: [0, state.vector1.y],
            line: {
                color: 'red',
                width: 3
            },
            marker: {
                size: 8,
                color: 'red'
            },
            name: 'Vector 1'
        },
        // Vector 2
        {
            type: 'scatter',
            mode: 'lines+markers',
            x: [0, state.vector2.x],
            y: [0, state.vector2.y],
            line: {
                color: 'blue',
                width: 3
            },
            marker: {
                size: 8,
                color: 'blue'
            },
            name: 'Vector 2'
        }
    ];
    
    // Add unit vectors if enabled
    if (state.showUnitVectors) {
        data.push(
            // Unit X
            {
                type: 'scatter',
                mode: 'lines+markers',
                x: [0, 1],
                y: [0, 0],
                line: {
                    color: 'rgba(255, 0, 0, 0.5)',
                    width: 2
                },
                marker: {
                    size: 6,
                    color: 'rgba(255, 0, 0, 0.5)'
                },
                name: 'Unit X'
            },
            // Unit Y
            {
                type: 'scatter',
                mode: 'lines+markers',
                x: [0, 0],
                y: [0, 1],
                line: {
                    color: 'rgba(0, 255, 0, 0.5)',
                    width: 2
                },
                marker: {
                    size: 6,
                    color: 'rgba(0, 255, 0, 0.5)'
                },
                name: 'Unit Y'
            }
        );
    }
    
    // Add result vector if available
    if (state.resultVector) {
        data.push({
            type: 'scatter',
            mode: 'lines+markers',
            x: [0, state.resultVector.x],
            y: [0, state.resultVector.y],
            line: {
                color: 'purple',
                width: 3
            },
            marker: {
                size: 8,
                color: 'purple'
            },
            name: 'Result'
        });
    }
    
    // Determine axis range
    const allX = [state.vector1.x, state.vector2.x];
    const allY = [state.vector1.y, state.vector2.y];
    
    if (state.resultVector) {
        allX.push(state.resultVector.x);
        allY.push(state.resultVector.y);
    }
    
    const maxX = Math.max(...allX.map(Math.abs), 1) * 1.2;
    const maxY = Math.max(...allY.map(Math.abs), 1) * 1.2;
    
    const layout = {
        title: '2D Vector Visualization',
        autosize: true,
        margin: {
            l: 50,
            r: 50,
            b: 50,
            t: 50,
            pad: 4
        },
        xaxis: {
            title: 'X',
            range: [-maxX, maxX],
            zeroline: true,
            zerolinecolor: '#888',
            zerolinewidth: 1
        },
        yaxis: {
            title: 'Y',
            range: [-maxY, maxY],
            zeroline: true,
            zerolinecolor: '#888',
            zerolinewidth: 1
        },
        showlegend: true,
        legend: {
            x: 0,
            y: 1
        }
    };
    
    Plotly.newPlot('vector-visualization-container', data, layout, { responsive: true });
    
    // Store reference to the plot
    state.plot2D = {
        data: data,
        layout: layout
    };
}

// Update the vector visualization
function updateVectorVisualization(state) {
    if (state.show3D) {
        update3DVectorVisualization(state);
    } else {
        update2DVectorVisualization(state);
    }
}

// Update the 3D vector visualization
function update3DVectorVisualization(state) {
    // Update vector 1
    updateArrow(state.vectors.vector1, state.vector1);
    
    // Update vector 2
    updateArrow(state.vectors.vector2, state.vector2);
    
    // Update result vector
    if (state.resultVector) {
        if (state.vectors.result) {
            updateArrow(state.vectors.result, state.resultVector);
        } else {
            state.vectors.result = createArrow(state.scene, state.resultVector, 0x800080); // Purple
        }
    } else if (state.vectors.result) {
        state.scene.remove(state.vectors.result);
        state.vectors.result = null;
    }
    
    // Toggle unit vectors visibility
    state.vectors.unitX.visible = state.showUnitVectors;
    state.vectors.unitY.visible = state.showUnitVectors;
    state.vectors.unitZ.visible = state.showUnitVectors;
}

// Update the 2D vector visualization
function update2DVectorVisualization(state) {
    // Update data for vector 1
    const data = [
        {
            x: [0, state.vector1.x],
            y: [0, state.vector1.y]
        },
        {
            x: [0, state.vector2.x],
            y: [0, state.vector2.y]
        }
    ];
    
    // Update result vector if available
    if (state.resultVector) {
        if (state.plot2D.data.length > 2) {
            data.push({
                x: [0, state.resultVector.x],
                y: [0, state.resultVector.y]
            });
        } else {
            // Add result vector
            const resultData = {
                type: 'scatter',
                mode: 'lines+markers',
                x: [0, state.resultVector.x],
                y: [0, state.resultVector.y],
                line: {
                    color: 'purple',
                    width: 3
                },
                marker: {
                    size: 8,
                    color: 'purple'
                },
                name: 'Result'
            };
            
            Plotly.addTraces('vector-visualization-container', resultData);
        }
    } else if (state.plot2D.data.length > 2) {
        // Remove result vector
        Plotly.deleteTraces('vector-visualization-container', 2);
    }
    
    // Determine axis range
    const allX = [state.vector1.x, state.vector2.x];
    const allY = [state.vector1.y, state.vector2.y];
    
    if (state.resultVector) {
        allX.push(state.resultVector.x);
        allY.push(state.resultVector.y);
    }
    
    const maxX = Math.max(...allX.map(Math.abs), 1) * 1.2;
    const maxY = Math.max(...allY.map(Math.abs), 1) * 1.2;
    
    // Update the plot
    Plotly.update('vector-visualization-container', data, {
        xaxis: {
            range: [-maxX, maxX]
        },
        yaxis: {
            range: [-maxY, maxY]
        }
    });
}

// Create an arrow for 3D visualization
function createArrow(scene, vector, color, scale = 1) {
    // Calculate direction and length
    const dir = new THREE.Vector3(vector.x, vector.y, vector.z);
    const length = dir.length() * scale;
    
    // Create arrow
    const arrowHelper = new THREE.ArrowHelper(
        dir.normalize(),
        new THREE.Vector3(0, 0, 0),
        length,
        color,
        0.2 * length,
        0.1 * length
    );
    
    scene.add(arrowHelper);
    return arrowHelper;
}

// Update an arrow
function updateArrow(arrow, vector) {
    // Calculate direction and length
    const dir = new THREE.Vector3(vector.x, vector.y, vector.z);
    const length = dir.length();
    
    // Update arrow
    arrow.setDirection(dir.normalize());
    arrow.setLength(length, 0.2 * length, 0.1 * length);
} 
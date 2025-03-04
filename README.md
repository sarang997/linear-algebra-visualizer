# ML Concepts Visualizer

A professional interactive web application for visualizing and understanding key mathematical concepts in machine learning, focusing on vectors, multivariate regression, loss functions, and gradient descent.

![ML Concepts Visualizer Screenshot](assets/screenshot.png)

## Overview

This tool helps students and practitioners build intuition for the mathematical foundations of machine learning through interactive visualizations. Whether you're studying Andrew Ng's Deep Learning Specialization or learning ML fundamentals on your own, these visualizations will help you develop a deeper understanding of the underlying concepts.

## Key Features

### Vector Visualization
- Interactive 3D visualization of vectors and vector operations
- Real-time updates as you adjust vector components
- Visualization of dot products, cross products, and vector projections
- Toggle between 2D and 3D views

### Multivariate Regression
- Interactive 3D visualization of regression planes
- Real-time parameter adjustments
- Feature importance visualization
- Dynamic model updates when adding/removing features

### Loss Function Visualization
- 3D surface plots of Mean Squared Error (MSE)
- Interactive contour plots showing the loss landscape
- Real-time visualization of regression line and errors
- Customizable data points

### Gradient Descent Visualization
- Animated optimization process
- Path visualization on contour plots
- Convergence graphs showing loss reduction
- Adjustable learning rate and iterations
- Detailed parameter tables showing weights, gradients, and updates

## Usage Guide

1. **Open the application**: Load the `index.html` file in any modern web browser

2. **Vector Visualization**:
   - Adjust vector components using the input fields
   - Toggle between 2D and 3D views
   - Explore vector operations in real-time

3. **Multivariate Regression**:
   - Adjust weights and bias using the sliders
   - Add or remove features to see model changes
   - Observe how the regression plane adapts

4. **Loss Function**:
   - Adjust parameters to see loss changes
   - Explore the 3D loss surface
   - Generate different data points to see how the loss landscape changes

5. **Gradient Descent**:
   - Set learning rate and iteration count
   - Start the animation to see the optimization process
   - Observe convergence behavior
   - Reset to try different parameters

## Technologies Used

- **HTML5/CSS3**: Structure and styling
- **JavaScript**: Core functionality and interactivity
- **Bootstrap 5**: Responsive layout and UI components
- **Plotly.js**: Interactive 3D and 2D visualizations
- **D3.js**: Data manipulation and visualization
- **Math.js**: Mathematical operations
- **KaTeX**: Mathematical equation rendering
- **Three.js**: 3D vector visualizations

## Learning Objectives

This visualizer helps you understand:

1. Vector operations in 2D and 3D space
2. How multivariate linear regression works with multiple features
3. How loss functions create optimization surfaces
4. How gradient descent navigates these surfaces to find optimal parameters
5. The relationship between model parameters, gradients, and learning rates

## Future Enhancements

- Additional loss functions (MAE, Huber loss)
- Regularization techniques (L1, L2)
- Advanced optimization algorithms (momentum, Adam)
- Polynomial regression
- Classification models and decision boundaries
- Neural network concept visualizations

## License

MIT License 
# Linear Algebra Visualizer for Machine Learning

An interactive web application to help understand key linear algebra concepts from Andrew Ng's Deep Learning Specialization, focusing on multivariate regression, loss functions, and gradient descent.

## Features

### 1. Multivariate Linear Regression Visualization

- Interactive 3D visualization of the regression plane for 2 features
- Adjustable weights and bias parameters with real-time updates
- Feature importance visualization for models with more than 2 features
- Add or remove features to see how the model changes

### 2. Loss Function Visualization

- 3D surface plot of the Mean Squared Error (MSE) loss function
- Contour plot showing the loss landscape
- Interactive controls to adjust weights and bias
- Real-time visualization of the regression line and errors
- Table of data points used in the model

### 3. Gradient Descent Visualization

- Animated visualization of gradient descent optimization
- Contour plot showing the path taken by gradient descent
- Convergence plot showing how loss decreases over iterations
- Adjustable learning rate and number of iterations
- Detailed parameter table showing weights, gradients, and updates
- Progress visualization of the regression line fitting the data

## How to Use

1. **Open the application**: Simply open the `index.html` file in a modern web browser.

2. **Multivariate Regression**:
   - Use the sliders to adjust weights and bias
   - Add or remove features using the buttons
   - Observe how the regression plane or line changes

3. **Loss Function**:
   - Adjust the weight and bias sliders to see how the loss changes
   - Observe the 3D loss surface and contour plot
   - Generate new data points to see different loss landscapes

4. **Gradient Descent**:
   - Adjust the learning rate and number of iterations
   - Click "Start Gradient Descent" to begin the animation
   - Observe how the algorithm converges to the minimum
   - Use the "Reset" button to start over

## Technical Details

This application uses the following technologies:

- **HTML5/CSS3**: For structure and styling
- **JavaScript**: For interactivity and calculations
- **Bootstrap 5**: For responsive layout and UI components
- **Plotly.js**: For interactive 3D and 2D visualizations
- **D3.js**: For data manipulation and visualization
- **Math.js**: For mathematical operations
- **KaTeX**: For rendering mathematical equations

## Learning Objectives

This visualizer helps you understand:

1. How multivariate linear regression works with multiple features
2. How the Mean Squared Error loss function creates a surface in parameter space
3. How gradient descent navigates this surface to find the minimum
4. The relationship between model parameters, gradients, and learning rate
5. How linear algebra concepts apply to machine learning algorithms

## Extending the Application

You can extend this application by:

1. Adding more loss functions (e.g., MAE, Huber loss)
2. Implementing regularization (L1, L2)
3. Adding more optimization algorithms (e.g., momentum, Adam)
4. Implementing polynomial regression
5. Adding classification models and their loss functions

## Credits

This application was created as a learning tool for students of Andrew Ng's Deep Learning Specialization and other machine learning courses.

## License

MIT License 
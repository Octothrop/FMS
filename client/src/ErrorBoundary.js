import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state to display fallback UI in the next render
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error if needed
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div className="error-boundary">
          <img 
            src="path_to_error_image.png" // Replace with your error image path
            alt="Error occurred" 
            className="error-image"
          />
          <p>Oops! Something went wrong.</p>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;

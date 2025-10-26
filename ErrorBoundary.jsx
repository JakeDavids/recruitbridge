import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) { 
    super(props); 
    this.state = { hasError: false, error: null }; 
  }
  
  static getDerivedStateFromError(error) { 
    return { hasError: true, error }; 
  }
  
  componentDidCatch(error, info) { 
    console.error("Admin error:", error, info); 
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 16, fontFamily: 'monospace' }}>
          <h1 style={{ color: 'red' }}>Admin crashed</h1>
          <pre data-testid="admin-error" style={{ background: '#f5f5f5', padding: 10, overflow: 'auto' }}>
            {String(this.state.error)}
          </pre>
          <button 
            onClick={() => window.location.reload()} 
            style={{ marginTop: 10, padding: '8px 16px' }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
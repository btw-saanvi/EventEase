import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error in React tree:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-oatly-bg bg-mesh flex items-center justify-center p-4">
          <div className="brutal-card bg-white max-w-md w-full p-8 text-center">
            <div className="w-16 h-16 bg-red-100 border-[3px] border-black shadow-[4px_4px_0px_#000] flex items-center justify-center mx-auto mb-6 text-red-600">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h1 className="font-heading text-2xl text-black uppercase mb-2">
              Something went wrong
            </h1>
            <p className="font-body text-sm text-black/70 mb-6">
              {this.state.error?.message || "An unexpected error occurred while rendering this page."}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="btn-brutal flex items-center justify-center gap-2 py-2.5 px-4 text-sm"
              >
                <RefreshCw className="w-4 h-4" /> Reload Page
              </button>
              <button
                onClick={this.handleGoHome}
                className="btn-brutal bg-oatly-yellow hover:bg-oatly-yellow/90 flex items-center justify-center gap-2 py-2.5 px-4 text-sm"
              >
                <Home className="w-4 h-4" /> Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

"use client";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <AlertCircle className="w-24 h-24 text-destructive" />
        </div>
        <h1 className="text-6xl font-bold text-primary mb-4">Error</h1>
        <h2 className="text-2xl font-semibold mb-4">Something Went Wrong</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          We encountered an unexpected issue while processing your request. Our
          team has been notified and is working to fix it.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/"
            className="flex items-center justify-center px-4 py-2 bg-primary text-white dark:text-black rounded-md hover:bg-primary/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center px-4 py-2 border border-input bg-background rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        If this problem persists, please contact our support team.
      </footer>
    </div>
  );
};

export default ErrorPage;

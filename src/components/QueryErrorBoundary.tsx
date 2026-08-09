import { Component, Fragment } from "react";
import { ErrorModal } from "@/components/ErrorModal";

interface QueryErrorBoundaryProps {
  children: React.ReactNode;
  title?: string;
}

interface QueryErrorBoundaryState {
  hasError: boolean;
  message: string;
  attempt: number;
}

/**
 * Catches errors thrown by Convex queries (e.g. network failure) and shows the
 * centered Error Modal with a Retry action that remounts the children.
 */
export class QueryErrorBoundary extends Component<
  QueryErrorBoundaryProps,
  QueryErrorBoundaryState
> {
  state: QueryErrorBoundaryState = { hasError: false, message: "", attempt: 0 };

  static getDerivedStateFromError(error: unknown) {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }

  componentDidCatch(error: unknown) {
    console.error("[MediPro] Data load error:", error);
  }

  handleRetry = () => {
    this.setState((s) => ({ hasError: false, attempt: s.attempt + 1 }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorModal
          open
          title={this.props.title ?? "Couldn't load your study data"}
          message={
            this.state.message ||
            "Please check your connection and try again. Your progress is safe."
          }
          onRetry={this.handleRetry}
        />
      );
    }
    return (
      <Fragment key={this.state.attempt}>{this.props.children}</Fragment>
    );
  }
}

import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('UI error:', error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-surface-2 p-6 text-center">
        <p className="text-lg font-bold text-teal-700">حدث خطأ غير متوقع</p>
        <p className="text-sm text-muted">
          Something went wrong. Please reload the page.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-full bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
        >
          إعادة تحميل / Reload
        </button>
      </div>
    );
  }
}

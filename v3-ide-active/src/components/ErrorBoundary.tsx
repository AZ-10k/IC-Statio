import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundaryClass extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <LanguageProvider>
          <ErrorFallback onReset={this.handleReset} error={this.state.error} />
        </LanguageProvider>
      );
    }

    return this.props.children;
  }
}

function ErrorFallback({ onReset, error }: { onReset: () => void; error: Error | null }) {
  const { language, isRTL } = useLanguage();

  const messages = {
    EN: {
      title: "Something went wrong",
      message: "We're sorry, but something unexpected happened. Please try reloading the page.",
      button: "Reload Page",
    },
    FR: {
      title: "Une erreur s'est produite",
      message: "Nous sommes désolés, mais quelque chose d'inattendu s'est produit. Veuillez réessayer de recharger la page.",
      button: "Recharger la page",
    },
    AR: {
      title: "حدث خطأ ما",
      message: "نأسف، ولكن حدث شيء غير متوقع. يرجى إعادة تحميل الصفحة.",
      button: "إعادة تحميل الصفحة",
    },
  };

  const t = messages[language];

  return (
    <div className={`min-h-screen flex items-center justify-center bg-background ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-md w-full mx-4 p-8 bg-card rounded-lg shadow-card text-center">
        <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h1 className="text-2xl font-semibold text-foreground mb-2">{t.title}</h1>
        <p className="text-muted-foreground mb-6">{t.message}</p>
        {import.meta.env.DEV && error && (
          <pre className="text-xs text-muted-foreground bg-muted p-4 rounded mb-4 text-left overflow-auto max-h-32">
            {error.toString()}
            {error.stack && `\n\n${error.stack}`}
          </pre>
        )}
        <Button onClick={onReset} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <RefreshCw className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
          {t.button}
        </Button>
      </div>
    </div>
  );
}

const ErrorBoundary = ({ children }: Props) => {
  return <ErrorBoundaryClass>{children}</ErrorBoundaryClass>;
};

export default ErrorBoundary;

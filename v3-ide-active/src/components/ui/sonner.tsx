import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-right"
      expand={true}
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-xl group-[.toaster]:backdrop-blur-sm",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:hover:bg-primary/90",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:hover:bg-muted/80",
          success: "group-[.toaster]:border-emerald-500/20 group-[.toaster]:bg-emerald-50 group-[.toaster]:text-emerald-900 dark:group-[.toaster]:bg-emerald-950 dark:group-[.toaster]:text-emerald-50",
          error: "group-[.toaster]:border-red-500/20 group-[.toaster]:bg-red-50 group-[.toaster]:text-red-900 dark:group-[.toaster]:bg-red-950 dark:group-[.toaster]:text-red-50",
          warning: "group-[.toaster]:border-amber-500/20 group-[.toaster]:bg-amber-50 group-[.toaster]:text-amber-900 dark:group-[.toaster]:bg-amber-950 dark:group-[.toaster]:text-amber-50",
          info: "group-[.toaster]:border-blue-500/20 group-[.toaster]:bg-blue-50 group-[.toaster]:text-blue-900 dark:group-[.toaster]:bg-blue-950 dark:group-[.toaster]:text-blue-50",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };

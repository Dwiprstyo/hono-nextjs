import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = "", variant = "primary", children, ...props }, ref) => {
        const baseClasses = "w-full font-medium p-4 rounded-xl transition-colors";
        const variantClasses =
            variant === "primary"
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-500 text-white hover:bg-gray-600";

        return (
            <button
                ref={ref}
                className={`${baseClasses} ${variantClasses} ${className}`}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";

export default Button;
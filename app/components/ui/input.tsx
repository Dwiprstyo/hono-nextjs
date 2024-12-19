import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", error, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <input
          ref={ref}
          className="w-full bg-[#1E1E1E] text-white p-4 rounded-xl focus:outline-none focus:border-gray-600 focus:border placeholder:text-gray-500 autofill:bg-[#1E1E1E] [&:-webkit-autofill]:bg-[#1E1E1E] [&:-webkit-autofill]:text-white [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]"
          {...props}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
import { Input } from "@/components/atoms/Input";
import { type InputHTMLAttributes } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  name: string;
}

export function FormField({ label, error, name, ...inputProps }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-zinc-300">
        {label}
      </label>
      <Input id={name} name={name} error={error} {...inputProps} />
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  );
}

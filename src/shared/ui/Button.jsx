import { LoaderCircle } from "lucide-react";
import { classNames } from "../lib/classNames";

export default function Button({
  children,
  className,
  variant = "primary",
  size = "medium",
  isLoading = false,
  disabled = false,
  type = "button",
  ...props
}) {
  return (
    <button
      className={classNames(
        "button",
        `button--${variant}`,
        `button--${size}`,
        className,
      )}
      disabled={disabled || isLoading}
      type={type}
      {...props}
    >
      {isLoading ? (
        <LoaderCircle className="button__spinner" aria-hidden="true" />
      ) : null}
      {children}
    </button>
  );
}

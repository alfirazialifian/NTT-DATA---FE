import { classNames } from "../lib/classNames";

export default function FormField({
  label,
  name,
  error,
  hint,
  required = false,
  children,
  className,
}) {
  const descriptionId = error || hint ? `${name}-description` : undefined;

  return (
    <div className={classNames("form-field", className)}>
      <label className="form-field__label" htmlFor={name}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      {children({
        id: name,
        name,
        "aria-invalid": Boolean(error),
        "aria-describedby": descriptionId,
      })}
      {error ? (
        <p className="form-field__error" id={descriptionId}>
          {error}
        </p>
      ) : hint ? (
        <p className="form-field__hint" id={descriptionId}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

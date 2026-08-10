import { classNames } from "../lib/classNames";

export default function Skeleton({ className, height, width, circle = false }) {
  return (
    <span
      aria-hidden="true"
      className={classNames(
        "skeleton",
        circle && "skeleton--circle",
        className,
      )}
      style={{ height, width }}
    />
  );
}

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { classNames } from "../lib/classNames";

export default function OverflowTooltip({
  as: Component = "span",
  children,
  className,
  content,
  onBlur,
  onFocus,
  onMouseEnter,
  onMouseLeave,
  ...props
}) {
  const tooltipId = useId();
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({
    left: 0,
    top: 0,
    placement: "top",
  });

  const measureOverflow = useCallback(() => {
    const element = elementRef.current;
    if (!element) return false;

    const overflowing =
      element.scrollWidth > element.clientWidth + 1 ||
      element.scrollHeight > element.clientHeight + 1;
    if (!overflowing) setIsVisible(false);
    return overflowing;
  }, []);

  const updatePosition = useCallback(() => {
    const element = elementRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const placement = rect.top >= 72 ? "top" : "bottom";
    const viewportPadding = Math.min(160, window.innerWidth / 2);
    const center = rect.left + rect.width / 2;

    setPosition({
      left: Math.min(
        Math.max(center, viewportPadding),
        window.innerWidth - viewportPadding,
      ),
      top: placement === "top" ? rect.top - 9 : rect.bottom + 9,
      placement,
    });
  }, []);

  const showTooltip = useCallback(() => {
    if (!measureOverflow()) return;
    updatePosition();
    setIsVisible(true);
  }, [measureOverflow, updatePosition]);

  const hideTooltip = useCallback(() => setIsVisible(false), []);

  useLayoutEffect(() => {
    measureOverflow();
    const element = elementRef.current;
    if (!element || typeof ResizeObserver === "undefined") return undefined;

    const observer = new ResizeObserver(measureOverflow);
    observer.observe(element);
    return () => observer.disconnect();
  }, [content, measureOverflow]);

  useEffect(() => {
    if (!isVisible) return undefined;

    function handleViewportChange() {
      if (measureOverflow()) updatePosition();
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") hideTooltip();
    }

    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [hideTooltip, isVisible, measureOverflow, updatePosition]);

  const tooltip = isVisible ? (
    <span
      className="overflow-tooltip"
      data-placement={position.placement}
      id={tooltipId}
      role="tooltip"
      style={{ left: position.left, top: position.top }}
    >
      {content}
    </span>
  ) : null;

  return (
    <>
      <Component
        {...props}
        aria-describedby={isVisible ? tooltipId : undefined}
        className={classNames("overflow-tooltip__trigger", className)}
        onBlur={(event) => {
          onBlur?.(event);
          hideTooltip();
        }}
        onFocus={(event) => {
          onFocus?.(event);
          showTooltip();
        }}
        onMouseEnter={(event) => {
          onMouseEnter?.(event);
          showTooltip();
        }}
        onMouseLeave={(event) => {
          onMouseLeave?.(event);
          hideTooltip();
        }}
        ref={elementRef}
      >
        {children}
      </Component>
      {typeof document !== "undefined" && tooltip
        ? createPortal(tooltip, document.body)
        : null}
    </>
  );
}

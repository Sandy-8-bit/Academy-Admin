import React from "react";
import { useLongPress } from "../../Hooks/useLongPress";

type ButtonState = "default" | "outline" | "danger";

interface ButtonSmProps {
  className?: string;
  state: ButtonState;
  text?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  imgUrl?: string;
  isPending?: boolean;
  iconPosition?: "left" | "right";
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onLongPress?: () => void;
  longPressThreshold?: number;
  longPressRepeatInterval?: number;
}

export const ButtonSm: React.FC<ButtonSmProps> = ({
  state,
  text,
  children,
  onClick,
  onLongPress,
  longPressThreshold = 500,
  longPressRepeatInterval = 100,
  type = "button",
  disabled = false,
  className = "",
  imgUrl,
  isPending = false,
  iconPosition = "left",
}) => {
  const longPressHandlers = useLongPress({
    onLongPress,
    onClick: onClick
      ? () => onClick({} as React.MouseEvent<HTMLButtonElement>)
      : undefined,
    threshold: longPressThreshold,
    repeatInterval: longPressRepeatInterval,
  });

  const buttonProps = onLongPress
    ? { ...longPressHandlers, onClick: undefined }
    : { onClick };

  const baseClasses =
    "btn-sm flex items-center justify-center gap-2 rounded-[9px] px-3 py-2 text-sm select-none transition-all duration-200 ease-in-out";

  const stateClasses = {
    default:
      "bg-blue-900 text-white hover:bg-blue-800 active:bg-blue-700",
    outline:
      "border border-blue-900 text-blue-900 hover:bg-blue-50 active:bg-blue-100",
    danger:
      "bg-[#DC3545] text-white hover:bg-[#BB2D3B] active:bg-[#A52834]",
  };

  return (
    <button
      type={type}
      disabled={disabled || isPending}
      className={`
        ${baseClasses}
        ${stateClasses[state]}
        ${disabled || isPending ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
      {...buttonProps}
    >
      {/* Left icon */}
      {imgUrl && iconPosition === "left" && (
        <img src={imgUrl} alt="" className="min-h-4 min-w-4" />
      )}

      {/* Text / children */}
      {children ? children : text}

      {/* Right icon */}
      {imgUrl && iconPosition === "right" && (
        <img src={imgUrl} alt="" className="min-h-4 min-w-4" />
      )}

      {/* Spinner */}
      {isPending && (
        <Spinner
          size="sm"
          className={state === "outline" ? "text-blue-900" : "text-white"}
        />
      )}
    </button>
  );
};

export default ButtonSm;

/* -------------------------------------------------
 * Spinner
 * -------------------------------------------------*/

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg
        className="animate-spin"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          className="opacity-25"
        />
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="31.4"
          strokeDashoffset="23.5"
          className="opacity-75"
        />
      </svg>
    </div>
  );
};

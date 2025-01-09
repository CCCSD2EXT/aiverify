import React from 'react';

type IconProps = {
  size?: number;
  color?: string;
  role?: string;
  ariaLabel?: string;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

function ScaleIcon({
  size = 20,
  color = '#000000',
  role,
  ariaLabel,
  disabled = false,
  className,
  style,
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      width={64}
      height={64}
      strokeWidth="0.3"
      stroke={color}
      className={className}>
      <path
        fill={color}
        d="M15.81 10l-2.5-5h0.69c0.276 0 0.5-0.224 0.5-0.5s-0.224-0.5-0.5-0.5h-0.79c-1.056-1.145-2.541-1.881-4.198-1.95l-0.012-0.050c0-0.552-0.448-1-1-1s-1 0.448-1 1v0.050c-1.681 0.073-3.178 0.807-4.247 1.947l-0.753 0.003c-0.276 0-0.5 0.224-0.5 0.5s0.224 0.5 0.5 0.5h0.69l-2.5 5h-0.19c0 1.1 1.34 2 3 2s3-0.9 3-2h-0.19l-2.55-5.090c0.064-0.039 0.118-0.089 0.159-0.148 0.873-1.019 2.148-1.669 3.575-1.702l0.006 10.94h-1v1h-2v1h8v-1h-2v-1h-1v-10.94c1.418 0.030 2.679 0.682 3.524 1.693 0.053 0.084 0.117 0.145 0.193 0.186l-2.527 5.061h-0.19c0 1.1 1.34 2 3 2s3-0.9 3-2h-0.19zM5 10h-4l2-3.94zM11 10l2-3.94 2 3.94h-4z"></path>
    </svg>
  );
}

function ChevronLeftIcon({
  size = 20,
  color = '#FFFFFF',
  role,
  ariaLabel,
  disabled = false,
  className,
  style,
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill={color}
      viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        d="M10.854 12l5.647-5.646a.5.5 0 0 0-.708-.708l-6 6a.5.5 0 0 0 0 .708l6 6a.5.5 0 0 0 .708-.708L10.854 12z"
      />
    </svg>
  );
}

function CheckCircleIcon({
  size = 20,
  color = '#000000',
  role,
  ariaLabel,
  disabled = false,
  className,
  style,
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={color}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      role={role}
      aria-label={ariaLabel}
      style={{
        width: size,
        height: size,
        ...style,
      }}>
      <defs>
        <mask id="check-mask">
          <rect
            width="100%"
            height="100%"
            fill="white"
          />
          <path
            d="M9 12l2 2 4-4"
            fill="none"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </mask>
      </defs>
      <circle
        cx="12"
        cy="12"
        r="10"
        fill={color}
        mask="url(#check-mask)"
      />
    </svg>
  );
}

function WarningCircleIcon({
  size = 20,
  color = '#000000',
  role,
  ariaLabel,
  disabled = false,
  className,
  style,
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={color}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      role={role}
      aria-label={ariaLabel}
      style={{
        width: size,
        height: size,
        ...style,
      }}>
      <rect
        x="0"
        fill="none"
        width="20"
        height="20"
      />
      <g>
        <path d="M10 2c4.42 0 8 3.58 8 8s-3.58 8-8 8-8-3.58-8-8 3.58-8 8-8zm1.13 9.38l.35-6.46H8.52l.35 6.46h2.26zm-.09 3.36c.24-.23.37-.55.37-.96 0-.42-.12-.74-.36-.97s-.59-.35-1.06-.35-.82.12-1.07.35-.37.55-.37.97c0 .41.13.73.38.96.26.23.61.34 1.06.34s.8-.11 1.05-.34z" />
      </g>
    </svg>
  );
}

export { ScaleIcon, ChevronLeftIcon, CheckCircleIcon, WarningCircleIcon };

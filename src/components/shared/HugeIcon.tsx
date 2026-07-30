import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

interface HugeIconProps {
  icon: IconSvgElement;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function HugeIcon({
  icon,
  size = 20,
  strokeWidth = 1.8,
  className,
}: HugeIconProps) {
  return (
    <HugeiconsIcon
      aria-hidden="true"
      className={className}
      color="currentColor"
      icon={icon}
      size={size}
      strokeWidth={strokeWidth}
    />
  );
}

import IcomoonReact from "icomoon-react";
import React from "react";
import iconSet from "./selection.json";

export interface IconTypeProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const Icon = ({
  size = 40,
  color,
  className,
  onClick,
  style,
  name,
  onMouseEnter,
  onMouseLeave,
}: IconTypeProps) => {
  return (
    <span
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <IcomoonReact
        iconSet={iconSet}
        color={color}
        size={size}
        icon={name}
        className={className}
        style={style}
      />
    </span>
  );
};

export default Icon;

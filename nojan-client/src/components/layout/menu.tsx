import classNames from "classnames";
import Link from "next/link";
import { useState } from "react";
import Icon from "../icon";

const Menu = ({
  d,
  isActive,
}: {
  d: { name: string; url?: string; action?: () => void; label?: string };
  isActive: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  if (d.action) {
    return (
      <div
        key={d.name}
        onClick={d.action}
        className={classNames(
          isActive
            ? "bg-white rounded-full p-3"
            : "p-3 rounded-full hover:bg-white",
          "transition-all duration-300 ease-in-out cursor-pointer flex items-center gap-3"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Icon
          className="transition-all duration-400 ease-in-out"
          name={d.name}
          size={35}
          color={isActive || isHovered ? "oklch(0.577 0.245 27.325)" : "black"}
        />
        <span
          className={`text-md ${
            isActive || isHovered ? "text-red-600 font-medium" : "text-gray-600"
          }`}
        >
          {d.label}
        </span>
      </div>
    );
  }

  return (
    <Link
      key={d.name}
      href={d.url || ""}
      className={classNames(
        isActive
          ? "bg-white rounded-full p-3"
          : "p-3 rounded-full hover:bg-white",
        "transition-all duration-300 ease-in-out flex items-center gap-3"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Icon
        className="transition-all duration-400 ease-in-out"
        name={d.name}
        size={35}
        color={isActive || isHovered ? "oklch(0.577 0.245 27.325)" : "black"}
      />
      <span
        className={`text-md ${
          isActive || isHovered ? "text-red-600 font-medium" : "text-gray-600"
        }`}
      >
        {d.label}
      </span>
    </Link>
  );
};

export default Menu;

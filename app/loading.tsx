"use client";

import { MutatingDots } from "react-loader-spinner";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Loading() {
  const { theme } = useTheme();
  const [color, setColor] = useState("#000");

  useEffect(() => {
    setColor(theme === "dark" ? "#ffffff" : "#000000");
  }, [theme]);

  return (
    <div className="flex items-center justify-center h-screen">
      <MutatingDots
        visible={true}
        height="100"
        width="100"
        color={color}
        secondaryColor={color}
        radius="12.5"
        ariaLabel="mutating-dots-loading"
      />
    </div>
  );
}

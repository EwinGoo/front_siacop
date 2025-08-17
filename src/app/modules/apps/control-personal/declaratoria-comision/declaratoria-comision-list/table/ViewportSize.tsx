import React, { useState, useEffect } from "react";

function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
}

export default function ViewportSize() {
  const { width, height, screenWidth, screenHeight } = useWindowSize();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Dimensiones de la pantalla</h2>
      <p>
        <strong>Viewport:</strong> {width} x {height}
      </p>
      <p>
        <strong>Pantalla total:</strong> {screenWidth} x {screenHeight}
      </p>
    </div>
  );
}

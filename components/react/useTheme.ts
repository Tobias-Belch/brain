import type { Theme } from "../types/Theme";
import { useEffect, useState } from "react";

type Result = Theme;

function getTheme(): Theme {
  const attr = document.documentElement.getAttribute("data-theme");
  return attr === "light" ? "light" : "dark";
}

export function useTheme(): Result {
  const [theme, setTheme] = useState<Theme>(getTheme());

  useEffect(() => {
    const onChange = () => setTheme(getTheme());

    // Watch for Starlight's data-theme attribute changes on <html>
    const observer = new MutationObserver(onChange);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return theme;
}

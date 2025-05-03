import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll the main scrollable container
    const wrapper = document.querySelector('.content-wrapper');
    if (wrapper) {
      wrapper.scrollTop = 0;
    }
  }, [pathname]);

  return null;
}
import { useEffect, useState } from "react";

const useIsSmartphone = () => {
  const [isSmartphone, setIsSmartphone] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsSmartphone(event.matches);
    };

    setIsSmartphone(mediaQuery.matches);

    mediaQuery.addEventListener("change", handleMediaQueryChange);
    return () =>
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
  }, []);

  return isSmartphone;
};

export default useIsSmartphone;

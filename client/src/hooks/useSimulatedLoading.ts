import { useState, useEffect } from "react";

/**
 * A hook strictly for simulating network requests in the prototype
 * to display Skeletons and showcase UX loading states.
 *
 * @param delay Simulated delay in ms
 * @returns boolean `true` while simulating load, `false` once done
 */
export const useSimulatedLoading = (delay = 600) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return loading;
};

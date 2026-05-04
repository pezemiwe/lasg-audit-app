import { useEffect } from "react";

export function useCounterAnimation(deps: unknown[] = []) {
  useEffect(() => {
    const counters = document.querySelectorAll(".counter");
    counters.forEach((counter) => {
      const target = +(counter.getAttribute("data-target") || 0);
      let count = 0;
      const inc = target / 50;
      const updateCount = () => {
        count += inc;
        if (count < target) {
          counter.textContent = Math.ceil(count).toString();
          setTimeout(updateCount, 15);
        } else {
          counter.textContent = target.toString();
        }
      };
      updateCount();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

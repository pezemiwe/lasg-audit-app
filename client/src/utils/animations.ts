export const animCount = (
  element: HTMLElement,
  target: number,
  suffix: string = "",
): void => {
  const duration = 2000;
  const start = 0;
  let startTime: number | null = null;
  const animate = (timestamp: number) => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(easeProgress * (target - start) + start);
    element.textContent = `${current.toLocaleString()}${suffix}`;
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      element.textContent = `${target.toLocaleString()}${suffix}`;
    }
  };
  requestAnimationFrame(animate);
};

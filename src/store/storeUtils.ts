export const uid = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const now = () => new Date().toISOString();

export const getEnv = (key: string): string => {
  // Check if the variable was injected into the window object by the server
  if (typeof window !== 'undefined' && (window as any).ENV && (window as any).ENV[key]) {
    return (window as any).ENV[key];
  }
  
  // Fallback to Vite's import.meta.env for development mode
  return (import.meta as any).env[key] || '';
};

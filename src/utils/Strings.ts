export const shortAddr = (a?: string): string => {
  if (!a) {
    return '';
  }
  return a.slice(0, 4) + "..." + a.slice(a.length - 4, a.length);
}
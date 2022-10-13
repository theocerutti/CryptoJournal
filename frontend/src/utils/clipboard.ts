export const copyToClipboard = (text: string): Promise<void> => {
  return navigator.clipboard.writeText(text);
};

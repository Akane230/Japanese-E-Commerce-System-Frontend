export const getStrength = (pw) => {
  if (!pw) return { score: 0, label: '', cls: '' };
  let s = 0;
  if (pw.length >= 8)              s++;
  if (/[A-Z]/.test(pw))           s++;
  if (/[0-9]/.test(pw))           s++;
  if (/[^A-Za-z0-9]/.test(pw))   s++;
  if (s <= 1) return { score: 1, label: 'Weak',   cls: 'weak' };
  if (s === 2) return { score: 2, label: 'Fair',   cls: 'fair' };
  return        { score: 3, label: 'Strong', cls: 'strong' };
}
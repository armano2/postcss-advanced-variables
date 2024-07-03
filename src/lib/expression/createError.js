export function createError(message, parent) {
  if (parent) {
    return parent.error(message, { plugin: 'postcss-advanced-variables' });
  }
  return new Error(message);
}

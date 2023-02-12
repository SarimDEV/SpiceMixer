export const truncate = (input, length) => {
  if (!input) {
    return '';
  }

  if (input.length > length) {
    return input.substring(0, length) + '...';
  }
  return input;
};

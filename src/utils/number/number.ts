export const onlyNumber = (value: string | number): number => {
  return Number(value.toString().replace(/\D+/gi, ''));
};

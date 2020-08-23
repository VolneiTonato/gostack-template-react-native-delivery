export const currencyFormatterPTBR = (value: number): string => {
  return Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const currencyBRLToDouble = (
  value: string | number,
  isDefault = false,
): number => {
  const valueAux = value.toString();
  let newNumber;

  if (/,/gi.test(valueAux))
    newNumber = Number(
      valueAux
        .replace('.', '')
        .replace(',', '.')
        .replace(/^\D+(\d{1,}\.\d{1,})?\D+/gi, `$1`),
    );
  else newNumber = Number(valueAux.replace(/^\D+(\d{1,}\.\d{1,})?\D+/gi, `$1`));

  if (isFinite(newNumber)) return newNumber;

  if (isDefault) return 0.0;

  throw new Error(`Not currency value`);
};

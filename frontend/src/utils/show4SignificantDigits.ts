export function show4SignificantDigits(balance: string): string {
  const [integerPart, decimalPart = ""] = balance.split(".");

  const formattedInteger = Number(integerPart).toLocaleString("en-US");

  const firstNonZeroIndex = decimalPart.search(/[1-9]/);

  if (!decimalPart || decimalPart === "0" || firstNonZeroIndex === -1) {
    return `${formattedInteger}.0`;
  }

  // Include all leading zeros plus 4 more digits
  const significantLength = firstNonZeroIndex + 4;
  const formattedDecimal = decimalPart.substring(
    0,
    Math.min(significantLength, decimalPart.length)
  );

  return `${formattedInteger}.${formattedDecimal}`;
}

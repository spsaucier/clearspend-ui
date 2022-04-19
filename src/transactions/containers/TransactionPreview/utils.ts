export function getReceiptData(file: File): FormData {
  const data = new FormData();
  data.append('receipt', file);
  return data;
}

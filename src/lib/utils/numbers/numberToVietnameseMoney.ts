export function numberToVietnameseMoney(amount: number): string {
  if (amount === 0) return 'Không đồng';

  const units = ['', 'nghìn', 'triệu', 'tỷ'];
  const digits = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];

  function readTriple(number: number): string {
    let str = '';
    const hundred = Math.floor(number / 100);
    const ten = Math.floor((number % 100) / 10);
    const unit = number % 10;

    if (hundred > 0) {
      str += digits[hundred] + ' trăm';
      if (ten === 0 && unit !== 0) str += ' linh';
    }

    if (ten > 1) {
      str += ` ${digits[ten]} mươi`;
      if (unit === 1) str += ' mốt';
      else if (unit === 5) str += ' lăm';
      else if (unit !== 0) str += ` ${digits[unit]}`;
    } else if (ten === 1) {
      str += ' mười';
      if (unit === 5) str += ' lăm';
      else if (unit !== 0) str += ` ${digits[unit]}`;
    } else if (ten === 0 && unit !== 0) {
      str += ` ${digits[unit]}`;
    }

    return str.trim();
  }

  const parts: string[] = [];
  let unitIndex = 0;

  while (amount > 0) {
    const num = amount % 1000;
    if (num !== 0) {
      const part = readTriple(num);
      parts.unshift(`${part} ${units[unitIndex]}`.trim());
    }
    amount = Math.floor(amount / 1000);
    unitIndex++;
  }

  const result = parts.join(' ').replace(/\s+/g, ' ');
  const capitalized = result.charAt(0).toUpperCase() + result.slice(1);

  return capitalized + ' đồng';
}

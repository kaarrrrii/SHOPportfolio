export function formatCoins(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value);
}

export function pluralizeCoins(value: number) {
  const mod10 = value % 10;
  const mod100 = value % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return "монетка";
  }

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return "монетки";
  }

  return "монеток";
}

export function formatCoinsLabel(value: number) {
  return `${formatCoins(value)} ${pluralizeCoins(value)}`;
}

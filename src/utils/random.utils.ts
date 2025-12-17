export function getRandomElement<T>(array: readonly T[]): T | undefined {
  if (array.length === 0) return undefined;
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

export function getRandomElements<T>(array: readonly T[], count: number): T[] {
  if (count <= 0 || array.length === 0) return [];
  const result: T[] = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * array.length);
    result.push(array[randomIndex]!);
  }
  return result;
}

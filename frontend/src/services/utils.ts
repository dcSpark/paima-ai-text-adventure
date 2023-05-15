export const truncateAddress = (address: string): string => {
  const start = address?.slice(0, 5);
  const end = address?.slice(address.length - 5);
  return `${start}...${end}`;
};

export type Characters = typeof characters[number];
export const characters = ['fire', 'water'] as const;

export const characterToNumberMap: Record<Characters, number> = {
  fire: 0,
  water: 1,
};

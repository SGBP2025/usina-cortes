export interface CreditPack {
  id: string;
  label: string;
  minutes: number;
  price_brl: number;
  highlight?: boolean;
}

export const CREDIT_PACKS: CreditPack[] = [
  {
    id: "pack_30",
    label: "Starter",
    minutes: 30,
    price_brl: 19.90,
  },
  {
    id: "pack_100",
    label: "Pro",
    minutes: 100,
    price_brl: 49.90,
    highlight: true,
  },
  {
    id: "pack_300",
    label: "Business",
    minutes: 300,
    price_brl: 119.90,
  },
];

export function getPackById(id: string): CreditPack | undefined {
  return CREDIT_PACKS.find((p) => p.id === id);
}

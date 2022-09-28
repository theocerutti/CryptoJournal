export {};

declare global {
  interface Investment {
    id: number;
    buyDate: Date;
    sellDate: Date;
    buyPrice: number;
    sellPrice: number;
    buyNote: string;
    sellNote: string;
    name: string;
    fees: number;
    investedAmount: number;
    holdings: number;
    locationName: string;
    primaryTag: string;
    secondaryTag: string;
    priceLink: string;
  }
}

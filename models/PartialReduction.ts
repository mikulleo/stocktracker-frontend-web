export interface PartialReduction {
    _id: string;
    stockSymbol: string;
    shares: number;
    sellPrice: number;
    sellDate: string;
    sellTag: string;
    sellNote: string;
    position: string;
    gainLossPercentage: number;
    gainLoss: number;
    normalizedGainLossPercentage: number;
    commission: number;
    partialReductions?: PartialReduction[];
}
    
export interface PartialReduction {
    _id: string;
    stockSymbol: string;
    shares: number;
    sellPrice: number;
    sellDate: string;
    sellTag: string;
    sellNote: string;
    position: string;
    partialReductions?: PartialReduction[];
}
    
import { PartialReduction } from "./PartialReduction";

export interface Position {
    _id: string;
    stockSymbol: string;
    shares: number;
    buyPrice: number;
    buyDate: Date;
    buyTag: string;
    buyCost: number;
    stopLoss: number;
    status: 'Open' | 'Closed';
    sellPrice?: number;
    sellDate?: Date;
    sellTag?: string;
    sellCost?: number;
    adjustedStopLoss?: number;
    commission: string;
    initialRisk: number;
    adjustedRisk: number;
    positionType: 'long' | 'short';
    partialReductions?: PartialReduction[];
  }
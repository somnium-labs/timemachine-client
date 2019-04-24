export namespace SharedModel {
    export interface Subject {
        assetCode: string;
        assetName: string;
        exchange: string;
        sector: string;
        industry: string;
        marketCap: number;
        per?: number;
        pbr?: number;
        evEvitda: number;
        divYield: number;
    }

    export interface TradeOption {
        startDate: string;
        endDate: string;
        capital: number;
        benchmark: string;
        commissionType: string;
        commission: number;
        slippageType: string;
        slippage: number;
        useOutstandingBalance: boolean;
        usePointVolume: boolean;
        tradeType: string;
        useBuyAndHold: boolean;
        useVolatilityBreakout: boolean;
        useMovingAverage: boolean;
    }

    export enum StrategyType {
        BuyAndHold,
        VolatilityBreakout,
        MovingAverage,
    }

    // export interface Record {
    //     date: Date;
    //     totalBalance: number;
    //     balance: number;
    //     ratingBalance: number;
    //     return: number;
    //     cumulativeReturn: number;
    //     returnRatio: number;
    //     cumulativeReturnRatio: number;
    //     volatilityRatio: number;
    //     mdd: number;
    //     max: number;
    // }
}

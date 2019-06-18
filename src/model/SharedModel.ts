
export interface ISubject {
    rowNumber: number;
    firstDate: Date;
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
    recentVolatility1Year: number;
    recentVolatility3Year: number;
    recentVolatility5Year: number;
    recentVolatility7Year: number;
    recentVolatility10Year: number;
}

export interface ITradeOption {
    country: string;
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

export interface IRecord {
    assetCode: string;
    assetName: string;
    exchange: string;
    volume: number;
    ratio: number;
    date: string;
    price: number;
}

export interface IAssetInfo {
    assetCode: string;
    exchange: string;
}

export interface IBenchmark {
    assetCode: string;
    volume: number;
    ratio: number;
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


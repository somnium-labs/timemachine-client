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
        // benchmark: string;
        commissionType: string;
        commission: number;
        slippageType: string;
        slippage: number;
        useOutstandingBalance: boolean;
        usePointVolume: boolean;
        tradeType: string;
    }
}

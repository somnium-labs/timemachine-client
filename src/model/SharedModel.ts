export namespace SharedModel {
    export interface Universe {
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
}

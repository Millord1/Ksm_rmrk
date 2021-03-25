

export abstract class Blockchain
{
    public symbol: string;
    public prefix: string;
    public isSubstrate: boolean;
    public wsProvider: string;

    public decimale: number;

    protected constructor(symbol: string, prefix: string, isSubstrate: boolean, wsProvider: string, decimale: number)
    {
        this.symbol = symbol;
        this.prefix = prefix;
        this.isSubstrate = isSubstrate;
        this.wsProvider = wsProvider;
        this.decimale = decimale;
    }


    public plancksToCrypto(value: number)
    {
        return value / Math.pow(10, this.decimale);
    }
    
}
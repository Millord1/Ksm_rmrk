
interface BlockchainInterface
{
    name: string;
    symbol: string;
    prefix: string;
}


export class Blockchain implements BlockchainInterface
{
    name;
    symbol;
    prefix;

    constructor(name, symbol, prefix){
        this.name = name;
        this.symbol = symbol;
        this.prefix = prefix;
    }
}

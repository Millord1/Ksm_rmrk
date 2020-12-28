import {BlockchainAddress} from "./Addresses/BlockchainAddress";


export interface BlockchainInterface
{
    name: string;
    symbol: string;
    prefix: string;
    isSubstrate: boolean;

    getAddressClass(): BlockchainAddress;

}

// export interface EntityInterface
// {
    // name;
    // metadata;
    // issuer;
    //
    // rmrkToObject(obj): this;
// }

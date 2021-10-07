import {Blockchain} from "./Blockchain";
import {Jetski} from "../Jetski/Jetski";
import {Interaction} from "../Remark/Interactions/Interaction";
import {CSCanonizeManager} from "canonizer/src/canonizer/CSCanonizeManager";


export abstract class GenericBlockchain extends Blockchain
{

    protected constructor(symbol: string, prefix: string, isSubstrate: boolean, wsProvider: string, decimale: number) {
        super(symbol, prefix, isSubstrate, wsProvider, decimale);
    }

    public async getBlockData(block: any, blockId: number, blockTimestamp: string, chain: Blockchain, jetski: Jetski): Promise<Array<any>>
    {
        return new Promise( async (resolve, reject)=>{

            let dataArray: Array<Promise<Interaction|string>> = [];

            for(const ex of block.block ? block.block.extrinsics : []){

                const { method: {
                  args, method, section
                } } = ex;

                if(section === "timestamp" && method === "set"){
                    blockTimestamp = Jetski.getTimestamp(ex);
                }

                const dateTimestamp = Number(blockTimestamp) * 1000;
                const date = new Date(dateTimestamp);
                // Display block date and number
                console.log('block ' + blockId + ' ' + date);

                if(section === "nft"){
                    if(args){
                        console.log(args.toString());
                    }else{
                        console.log(block.block.extrinsics);
                    }
                    console.log(method);
                    console.log(blockId);
                    process.exit();
                }else{
                    resolve([]);
                }

            }

        })

    }

    public async sendGossip(canonizeManager: CSCanonizeManager, block: number, blockchain: any): Promise<string>
    {
        return new Promise( async (resolve, reject)=>{
            resolve("nft send");
        })
    }

}
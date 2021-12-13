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

            console.log(blockId);

            let dataArray: Array<Promise<Interaction|string>> = [];

            const sections: Array<string> = [];

            block.block.extrinsics.forEach((ex: any, index: any) => {
                // the extrinsics are decoded by the API, human-like view

                console.log(index, ex.toHuman());

                const { isSigned, meta, method: { args, method, section } } = ex;

                // console.log(ex.method.section);
                // process.exit();

                // explicit display of name, args & documentation
                console.log(`${section}.${method}(${args.map((a: any) => a.toString()).join(', ')})`);
                // console.log(meta.documentation.map((d: any) => d.toString()).join('\n'));

                // signer/nonce info
                if (isSigned) {
                    console.log(`signer=${ex.signer.toString()}, nonce=${ex.nonce.toString()}`);
                }

                if(section != "timestamp"){
                    process.exit();
                }
            });

            reject ("no rmrk");

            // process.exit();

            // for(const ex of block.block ? block.block.extrinsics : []){
            //
            //     const { method: {
            //       args, method, section
            //     } } = ex;
            //
            //     console.log(ex);
            //
            //     sections.push(args);
            //
            //     if(section === "timestamp" && method === "set"){
            //         blockTimestamp = Jetski.getTimestamp(ex);
            //     }
            //
            //     const dateTimestamp = Number(blockTimestamp) * 1000;
            //     const date = new Date(dateTimestamp);
            //     // Display block date and number
            //     console.log('block ' + blockId + ' ' + date);
            //
            //     if(section === "nft"){
            //         if(args){
            //             console.log(args.toString());
            //             console.log("args");
            //         }else{
            //             console.log(block.block.extrinsics);
            //             console.log("extrinsics");
            //         }
            //         // console.log(method);
            //         console.log(blockId);
            //         // process.exit();
            //     }else{
            //         // console.log("nothing");
            //         // process.exit();
            //         // resolve([]);
            //     }
            //
            // }
            //
            // console.log(sections);
            // process.exit();

        })

    }

    public async sendGossip(canonizeManager: CSCanonizeManager, block: number, blockchain: any): Promise<string>
    {
        return new Promise( async (resolve, reject)=>{
            resolve("nft send");
        })
    }

}
import {GossiperManager} from "./GossiperManager";
import {Blockchain} from "canonizer/src/canonizer/Blockchain";
import {CSCanonizeManager} from "canonizer/src/canonizer/CSCanonizeManager";
import {SandraManager} from "canonizer/src/SandraManager";
import {CanonizerJetski} from "canonizer/src/canonizer/tools/jetski/CanonizerJetski";
import {BlockchainBlock} from "canonizer/src/canonizer/BlockchainBlock";


export class InstanceGossiper extends GossiperManager
{


    public constructor(chain: Blockchain, canonizeManager: CSCanonizeManager) {
        super(chain, canonizeManager);
    }



    public sendLastBlock(block: number, instanceCode: number): Promise<string>
    {
        return new Promise((resolve, reject)=>{

            const instance = instanceCode.toString();

            const sandra: SandraManager = this.canonizeManager.getSandra();
            const jetskiManager = new CanonizerJetski(this.canonizeManager, instance);
            const blockObj = new BlockchainBlock(this.chain.blockFactory, block, instance, sandra);

            const jetskiFactory = jetskiManager.getJetskifacory();

            const jetskiEntity = jetskiFactory.getOrCreateJetskiInstance(this.chain.getName(), blockObj, instance, sandra);
            jetskiEntity.setLatestBlock(blockObj);

            jetskiManager.gossipLatestBlock()
                .then(r=>{
                    console.log(r);
                    resolve (r);
                }).catch(e=>{
                    reject(e);
            });
        })

    }


    public checkInstance(blockchain: Blockchain, instanceCode: number)
    {



        // const instance = instanceCode.toString();
        // TODO get instance from XMLHttp ?
    }


}
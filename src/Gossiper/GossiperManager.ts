import {Blockchain} from "canonizer/src/canonizer/Blockchain";
import {CSCanonizeManager} from "canonizer/src/canonizer/CSCanonizeManager";
import {SandraManager} from "canonizer/src/SandraManager";
import {WestEnd} from "../Blockchains/WestEnd";
import {WestendBlockchain} from "canonizer/src/canonizer/Substrate/Westend/WestendBlockchain";
import {Kusama} from "../Blockchains/Kusama";
import {KusamaBlockchain} from "canonizer/src/canonizer/Kusama/KusamaBlockchain";

export abstract class GossiperManager
{

    protected chain: Blockchain;
    protected canonizeManager: CSCanonizeManager;

    protected constructor(chain: string, canonizeManager: CSCanonizeManager) {
        this.canonizeManager = canonizeManager;
        this.chain = this.getCanonizeChain(chain);
    }


    private getCanonizeChain(chainName: string)
    {

        const sandra: SandraManager = this.canonizeManager.getSandra();

        switch(chainName.toLowerCase()){

            case WestEnd.name.toLowerCase():
                return new WestendBlockchain(sandra);

            case Kusama.name.toLowerCase():
            default:
                return new KusamaBlockchain(sandra);

        }

    }


}
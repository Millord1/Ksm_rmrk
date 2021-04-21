import {Blockchain} from "canonizer/src/canonizer/Blockchain";
import {CSCanonizeManager} from "canonizer/src/canonizer/CSCanonizeManager";
import {GossiperFactory} from "./GossiperFactory";

export abstract class GossiperManager
{

    protected chain: Blockchain;
    protected canonizeManager: CSCanonizeManager;

    protected constructor(chain: Blockchain, canonizeManager: CSCanonizeManager) {
        this.canonizeManager = canonizeManager;
        this.chain = chain;
    }

}
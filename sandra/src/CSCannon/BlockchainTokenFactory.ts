import {EntityFactory} from "../EntityFactory.js";

import {CSCanonizeManager} from "./CSCanonizeManager.js";

export class BlockchainTokenFactory extends EntityFactory{

    is_a:string = 'tokenPath';
    contained_in_file:string = 'tokenPathFile';

    static ID:string = 'code' ;

    constructor(canonizeManager:CSCanonizeManager) {

        super('tokenPath','tokenPathFile',canonizeManager.getSandra());

        this.updateOnExistingRef = canonizeManager.getSandra().get(BlockchainTokenFactory.ID);
    }





}
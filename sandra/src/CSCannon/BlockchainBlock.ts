import {Entity} from "../Entity.js";
import {BlockchainAddressFactory} from "./BlockchainAddressFactory.js";
import {SandraManager} from "../SandraManager.js";
import {EntityFactory} from "../EntityFactory.js";
import {Reference} from "../Reference.js";

export class BlockchainBlock extends Entity {

    public static INDEX_SHORTNAME = 'blockIndex';
    public static  BLOCK_TIMESTAMP = 'timestamp';

    public constructor(factory:EntityFactory,blockId:number,blockTimestamp:string,sandraManager:SandraManager) {
        super(factory);

        this.addReference(new Reference(sandraManager.get(BlockchainBlock.INDEX_SHORTNAME),blockId.toString()))
        this.addReference(new Reference(sandraManager.get(BlockchainBlock.BLOCK_TIMESTAMP),blockTimestamp))


    }





}
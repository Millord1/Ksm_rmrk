import {Remark} from "../Remark";
import {Blockchain} from "../../Blockchains/Blockchain";
import {MetaData} from "../MetaData";

const slugify = require('slugify');

export abstract class Entity extends Remark
{

    public static undefinedEntity: string = "undefined entity";

    public metaData: MetaData | undefined;
    public url: string;

    protected constructor(rmrk: string, chain: Blockchain, url: string, version?: string) {
        super(rmrk, chain, version);
        this.url = url;
    }


    public addMetadata(meta: MetaData)
    {
        this.metaData = meta;
    }


    public static slugification(toSlugify: string): string
    {
        return slugify(toSlugify, {replacement: ' '});
    }

}
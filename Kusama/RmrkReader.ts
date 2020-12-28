import {Blockchain} from "../classes/Blockchains/Blockchain";
import {Nft} from "../classes/Nft";
import {Collection} from "../classes/Collection";
import {Send} from "../classes/Rmrk/Interactions/Send";
import {MintNft} from "../classes/Rmrk/Interactions/MintNft";


export class RmrkReader
{

    entityObj = {
        version: null,
        name: null,
        max: null,
        symbol: null,
        id: null,
        metadata: null,
        issuer: null,
        transferable: null,
        sn: null,
        collection: null
    }

    interactionObj = {
        type: '',
        interaction: '',
        version: '',
        nft: '',
        address: ''
    };

    chain;

    constructor(chain: Blockchain){
        this.chain = chain;
    }

    public readRmrk(rmrk: string){

        const firstChars = rmrk.substring(0, 4);

        if(firstChars.toLowerCase() === 'rmrk'){
            this.readInteraction(rmrk);
        }else{
            this.readEntity(rmrk);
        }

    }


    public readEntity(rmrk: string){

        const splitted = rmrk.split(',');

        splitted.forEach((index) => {

            const datas = index.split(':');

            for(let i = 0; i < datas.length; i++){
                datas[i] = datas[i].replace(/[&\/\\"']/g, '');
            }

            this.entityObj[datas[0]] = datas[1];
        })

        const myClass = (this.entityObj.id === null) ?
            new Nft(rmrk, this.chain, this.entityObj.version) :
            new Collection(rmrk, this.chain, this.entityObj.version);

        return myClass.rmrkToObject(this.entityObj);
    }



    public readInteraction(rmrk: string){

        const splitted = rmrk.split('::');

        let interaction = splitted[1];
        interaction = interaction.toLowerCase();

        let interactObj;

        switch (interaction){

            case 'mint':

                break;

            case 'changeissuer':

                break;

            case 'mintnft':

                splitted[2] = splitted[2].replace(/[&\/\\"']/g, '');
                const nftDatas = splitted[2].split(',');

                const nftObj = {
                    collection: null,
                    name: null,
                    transferable: null,
                    sn: null,
                    metadata: null
                }

                nftDatas.forEach((data)=>{
                    const datas = data.split(':');

                    if(datas.length > 2){
                        if(datas[0] === 'metadata' && datas[1] === 'ipfs'){
                            nftObj[datas[0]] = datas[1] + ':' + datas[2];
                        }
                    }else{
                        nftObj[datas[0]] = datas[1];
                    }
                })

                const nft = new Nft(rmrk, this.chain, null);

                interactObj = new MintNft(rmrk, nft, this.chain);

                break;



            case 'send' :

                this.interactionObj.type = splitted[0];
                this.interactionObj.interaction = splitted[1];
                this.interactionObj.version = splitted[2];
                this.interactionObj.nft = splitted[3];
                this.interactionObj.address = splitted[4];

                interactObj = new Send(rmrk, this.interactionObj, this.chain);

                break;

            case ' list' :

                break;

            case 'buy' :

                break;

            case 'consume' :

                break;
        }

        console.log(interactObj);
        return interactObj;

    }



}
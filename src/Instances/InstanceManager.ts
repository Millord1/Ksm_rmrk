import {Blockchain} from "../Blockchains/Blockchain";
import {Blockchain as CanonizeChain} from "canonizer/src/canonizer/Blockchain";
import {CSCanonizeManager} from "canonizer/src/canonizer/CSCanonizeManager";
import {InstanceGossiper} from "../Gossiper/InstanceGossiper";
import {GossiperFactory} from "../Gossiper/GossiperFactory";

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});


export interface QueryType{
    meta: MetaInterface,
    data: {
        chain: string,
        instance: string,
        last_block: string
    }
}

export interface ResponseType{
    meta: MetaInterface,
    data: Array<DataInterface>
}

export interface MetaInterface{
    server: string,
    env: string,
    version: string,
}

export interface DataInterface{
    chain: string,
    instanceName: string,
    creation_id: string,
    last_block: string
}


export class InstanceManager
{
    private readonly canonizeManager: CSCanonizeManager;
    private readonly canonizeChain: CanonizeChain;
    private readonly jwt: string;
    private readonly chainName: string;

    private apiUrl: string = "http://arkam.everdreamsoft.com/api/v1/jetski/";
    private lastBlockSaved: string = "";

    constructor(canonizeManager: CSCanonizeManager, chain: string, jwt: string) {
        this.canonizeManager = canonizeManager;
        this.chainName = chain;
        this.jwt = jwt;
        this.canonizeChain = GossiperFactory.getCanonizeChain(chain, canonizeManager.getSandra());
    }


    public getBlock()
    {
        return this.lastBlockSaved;
    }


    public getJwt()
    {
        return this.jwt;
    }


    public async startLock(block: number, instanceCode: number): Promise<string>
    {
        // return actual instanceCode if exists or new if not
        const chainName = this.canonizeChain.getName().toLowerCase();

        return new Promise(async (resolve, reject)=>{

            this.saveLastBlock(chainName, block, instanceCode)
                .then(()=>{
                    resolve (instanceCode.toString());
                }).catch((e)=>{
                    reject(e);
            })

            // const instancExists: boolean = await this.checkLockExists(chainName, instanceCode);
            //
            // if(!instancExists){
            //     // create new instance
            //     this.saveLastBlock(chainName, block, instanceCode)
            //         .then(()=>{
            //             resolve (instanceCode.toString());
            //         }).catch((e)=>{
            //             reject(e);
            //     })
            //
            // }else{
            //     reject("Instance already exists");
            // }

        });

    }




    public async checkLockExists(blockchainName: string, instanceCode: number): Promise<boolean>
    {
        // return true if instance already exists on the chain

        const url = this.apiUrl +"/instance/"+ blockchainName +"/"+ this.jwt;
        const response: QueryType|ResponseType = await this.apiCall(url);

        const instanceData: QueryType = (response as QueryType);

        if(instanceData.data.last_block){
            this.lastBlockSaved = instanceData.data.last_block;
        }

        return instanceData.data.instance ? instanceData.data.instance === instanceCode.toString() : false;
    }



    public async saveLastBlock(blockchainName: string, block: number, instanceCode: number): Promise<boolean>
    {
        return new Promise(async (resolve, reject)=>{

            const instanceGossiper = new InstanceGossiper(this.canonizeChain, this.canonizeManager);
            instanceGossiper.sendLastBlock(block, instanceCode)
                .then(()=>{
                    this.lastBlockSaved = block.toString();
                    resolve (true)
                }).catch(e=>{
                    reject(e);
             });

        })
    }


    public async getLastBlock(): Promise<string|undefined>
    {
        const url: string = this.apiUrl + "instance/" + this.chainName + "/" + this.jwt;

        await this.apiCall(url)
            .then((r)=>{
                const blockData = r as QueryType;
                if(blockData.data.last_block){
                    return blockData.data.last_block;
                }
                return undefined;
            }).catch(e=>{
                console.error(e);
            });
        return undefined;
    }



    public async resetInstance(blockchainName: string, instanceCode: number): Promise<boolean|string>
    {
        const url = this.apiUrl + "reset/" + blockchainName + "/" + instanceCode + "/" + this.jwt;

        return new Promise(async (resolve, reject)=>{
            await this.apiCall(url)
                .then(()=>{
                    resolve (true);
                }).catch(e=>{
                    console.error(e);
                    reject (e);
                });
        });
    }



    public async apiCall(url: string): Promise<QueryType|ResponseType>
    {
        return new Promise((resolve, reject)=>{

            const request = new XMLHttpRequest();

            request.open("GET", url);
            request.send();

            let response: QueryType|ResponseType;

            request.onreadystatechange = function(){
                if(this.readyState == 4 && this.status == 200){
                    try{
                        response = JSON.parse(this.responseText);
                        resolve (response);
                    }catch(e){
                        console.error(e);
                    }
                }else if(this.readyState == 4){
                    reject ("Bad request, error : "+this.status);
                }
            }

        })

    }


    public async exitProcess(block: number, instanceCode: number)
    {
        const save = await this.saveLastBlock(this.chainName, block, instanceCode);

        if(save){
            process.exit();
        }

        console.error("Block save failed, last block saved is "+this.lastBlockSaved);
        readline.question("Do you want to retry the save ? Y/n", async (answer: string)=>{

            answer = answer.toLowerCase();
            if(answer == "y" || answer == "yes"){
                await this.exitProcess(block, instanceCode);
            }else{
                process.exit();
            }
        })

    }


    public static getNewInstanceCode(): number
    {
        return (Date.now() / 1000);
    }


}
const fs = require('fs');
const path = require('path');


export class FileManager
{

    private static threadLock: string = "_thread.lock.json";
    private static dir: string = __dirname+ "\\";

    // Getters for have path of files
    private static getSavePath(chainName: string): string
    {
        const save: string = "_lastBlock.json";
        return this.dir + chainName + save;
    }

    public static getThreadLockPath(chainName: string)
    {
        return this.dir + chainName + this.threadLock;
    }

    private static getRescanPath(chainName: string)
    {
        return this.dir + chainName + "_toRescan.json";
    }


    public static startLock(startBlock: number, chain: string, id: number)
    {
        // create file for lock one thread

        const threadData = {
            startBlock: startBlock,
            chain: chain,
            id: id
        }

        const data = JSON.stringify(threadData);

        try{
            fs.writeFileSync(path.resolve(this.getThreadLockPath(chain)), data);
        }catch(e){
            console.error(e);
        }

    }



    public static checkLock(chain: string, id: number): boolean
    {
        if( fs.existsSync( path.resolve(this.getThreadLockPath(chain)) ) ){
            const threadData = fs.readFileSync( path.resolve(this.getThreadLockPath(chain)) );
            const data = JSON.parse(threadData);
            return data.id == id;
        }
        return false;
    }


    public static getLastBlock(chain: string): number|undefined
    {
        // read file for get last block
        if( fs.existsSync( path.resolve(this.getSavePath(chain)) ) ){
            const lastBlock = fs.readFileSync( path.resolve(this.getSavePath(chain)) );
            const data = JSON.parse(lastBlock);

            return data.lastBlock;
        }

        return undefined
    }


    public static exitProcess(blockNumber: number, chain: string, toRescan: Array<number>)
    {
        // save block and exit process
        console.log('exit process ...');
        blockNumber--;

        if(this.saveLastBlock(blockNumber, chain)){
            console.log('saved block : '+blockNumber);
        }else{
            console.log('Fail to save block : '+blockNumber);
        }

        const rescan: string = JSON.stringify(toRescan);

        if(toRescan.length > 0){

            if(!fs.existsSync(this.getRescanPath(chain))){

                try{
                    fs.writeFileSync(path.resolve(this.getRescanPath(chain)), rescan);
                    console.log("Rescan saved");
                }catch(e){
                    console.error(e);
                }

            }else{

                try{
                    const blocks = fs.readFileSync(this.getRescanPath(chain));
                    const oldBlocks: Array<number> = JSON.parse(blocks);

                    const newArray: Array<number> = oldBlocks.concat(oldBlocks, toRescan);
                    const toPush = JSON.stringify(newArray);

                    fs.writeFileSync(this.getRescanPath(chain), toPush);
                    console.log("Rescan saved");
                }catch(e){
                    console.error(e);
                }

            }

        }

        process.exit();
    }



    public static saveLastBlock(lastBlock: number, chain: string): boolean
    {
        // write file with last block
        const saveBlock = {
            lastBlock: lastBlock
        }

        const data = JSON.stringify(saveBlock);

        try{
            fs.writeFileSync(path.resolve( this.getSavePath(chain)), data);
            return true;
        }catch(e){
            console.error(e);
            return false;
        }

    }
}
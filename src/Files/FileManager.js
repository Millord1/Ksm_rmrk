"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileManager = void 0;
const fs = require('fs');
const path = require('path');
class FileManager {
    // Getters for have path of files
    static getSavePath(chainName) {
        const save = "_lastBlock.json";
        return this.dir + chainName + save;
    }
    static getThreadLockPath(chainName) {
        return this.dir + chainName + this.threadLock;
    }
    static getRescanPath(chainName) {
        return this.dir + chainName + "_toRescan.json";
    }
    static startLock(startBlock, chain, id) {
        // create file for lock one thread
        const threadData = {
            startBlock: startBlock,
            chain: chain,
            id: id
        };
        const data = JSON.stringify(threadData);
        try {
            fs.writeFileSync(path.resolve(this.getThreadLockPath(chain)), data);
        }
        catch (e) {
            console.error(e);
        }
    }
    static checkLock(chain, id) {
        if (fs.existsSync(path.resolve(this.getThreadLockPath(chain)))) {
            const threadData = fs.readFileSync(path.resolve(this.getThreadLockPath(chain)));
            const data = JSON.parse(threadData);
            return data.id == id;
        }
        return false;
    }
    static getLastBlock(chain) {
        // read file for get last block
        if (fs.existsSync(path.resolve(this.getSavePath(chain)))) {
            const lastBlock = fs.readFileSync(path.resolve(this.getSavePath(chain)));
            const data = JSON.parse(lastBlock);
            return data.lastBlock;
        }
        return undefined;
    }
    static exitProcess(blockNumber, chain, toRescan) {
        // save block and exit process
        console.log('exit process ...');
        blockNumber--;
        if (this.saveLastBlock(blockNumber, chain)) {
            console.log('saved block : ' + blockNumber);
        }
        else {
            console.log('Fail to save block : ' + blockNumber);
        }
        const rescan = JSON.stringify(toRescan);
        if (toRescan.length > 0) {
            if (!fs.existsSync(this.getRescanPath(chain))) {
                try {
                    fs.writeFileSync(path.resolve(this.getRescanPath(chain)), rescan);
                    console.log("Rescan saved");
                }
                catch (e) {
                    console.error(e);
                }
            }
            else {
                try {
                    const blocks = fs.readFileSync(this.getRescanPath(chain));
                    const oldBlocks = JSON.parse(blocks);
                    const newArray = oldBlocks.concat(oldBlocks, toRescan);
                    const toPush = JSON.stringify(newArray);
                    fs.writeFileSync(this.getRescanPath(chain), toPush);
                    console.log("Rescan saved");
                }
                catch (e) {
                    console.error(e);
                }
            }
        }
        process.exit();
    }
    static saveLastBlock(lastBlock, chain) {
        // write file with last block
        const saveBlock = {
            lastBlock: lastBlock
        };
        const data = JSON.stringify(saveBlock);
        try {
            fs.writeFileSync(path.resolve(this.getSavePath(chain)), data);
            return true;
        }
        catch (e) {
            console.error(e);
            return false;
        }
    }
}
exports.FileManager = FileManager;
FileManager.threadLock = "_thread.lock.json";
FileManager.dir = __dirname + "\\";
//# sourceMappingURL=FileManager.js.map
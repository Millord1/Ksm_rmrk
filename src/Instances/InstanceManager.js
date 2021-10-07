"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstanceManager = void 0;
const InstanceGossiper_1 = require("../Gossiper/InstanceGossiper");
const GossiperFactory_1 = require("../Gossiper/GossiperFactory");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
class InstanceManager {
    constructor(canonizeManager, chain, jwt) {
        // private apiUrl: string = "https://arkam.everdreamsoft.com/api/v1/jetski/";
        this.apiUrl = "http://localhost:8000/api/v1/jetski/";
        this.lastBlockSaved = "0";
        this.canonizeManager = canonizeManager;
        this.chainName = chain;
        this.jwt = jwt;
        this.canonizeChain = GossiperFactory_1.GossiperFactory.getCanonizeChain(chain, canonizeManager.getSandra());
    }
    getBlock() {
        return this.lastBlockSaved;
    }
    getJwt() {
        return this.jwt;
    }
    async startLock(block, instanceCode) {
        // return actual instanceCode if exists or new if not
        const chainName = this.canonizeChain.getName().toLowerCase();
        return new Promise(async (resolve, reject) => {
            this.saveLastBlock(chainName, block, instanceCode)
                .then(() => {
                resolve(instanceCode.toString());
            }).catch((e) => {
                reject(e);
            });
        });
    }
    async checkLockExists(blockchainName, instanceCode) {
        // return true if instance already exists on the chain
        const url = this.apiUrl + "instance/" + blockchainName + "/" + this.jwt;
        const response = await this.apiCall(url);
        const instanceData = response;
        if (instanceData.data.last_block) {
            this.lastBlockSaved = instanceData.data.last_block;
        }
        return instanceData.data.instance ? instanceData.data.instance === instanceCode.toString() : false;
    }
    async saveLastBlock(blockchainName, block, instanceCode) {
        return new Promise(async (resolve, reject) => {
            const instanceGossiper = new InstanceGossiper_1.InstanceGossiper(this.canonizeChain, this.canonizeManager);
            await instanceGossiper.sendLastBlock(block, instanceCode)
                .then(() => {
                this.lastBlockSaved = block.toString();
                resolve(true);
            }).catch(e => {
                reject(e);
                return;
            });
        });
    }
    async getLastBlock() {
        const url = this.apiUrl + "instance/" + this.chainName + "/" + this.jwt;
        return new Promise(async (resolve, reject) => {
            await this.apiCall(url)
                .then((r) => {
                const blockData = r;
                try {
                    this.lastBlockSaved = blockData.data.last_block;
                }
                catch (e) {
                    reject(e);
                }
                resolve(this.getBlock());
            }).catch(e => {
                reject(e);
                return;
            });
        });
    }
    async resetInstance(blockchainName, instanceCode) {
        const url = this.apiUrl + "reset/" + blockchainName + "/" + instanceCode + "/" + this.jwt;
        return new Promise(async (resolve, reject) => {
            this.apiCall(url)
                .then(() => {
                resolve(true);
            }).catch(e => {
                console.error(e);
                reject(e);
                return;
            });
        });
    }
    async apiCall(url) {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.open("GET", url);
            request.send();
            let response;
            request.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    try {
                        response = JSON.parse(this.responseText);
                        resolve(response);
                    }
                    catch (e) {
                        console.error(e);
                    }
                }
                else if (this.readyState == 4) {
                    reject("Bad request, error : " + this.status);
                    return;
                }
            };
        });
    }
    async exitProcess(block, instanceCode) {
        InstanceManager.processExit = true;
        // exit process with save block before
        this.saveLastBlock(this.chainName, --block, instanceCode)
            .then(() => {
            process.exit();
        }).catch(e => {
            InstanceManager.processExit = false;
            console.error(e);
            console.error("Block save failed, last block saved is " + this.lastBlockSaved);
            readline.question("Do you want to retry the save ? Y/n", async (answer) => {
                answer = answer.toLowerCase();
                if (answer == "y" || answer == "yes") {
                    await this.exitProcess(block, instanceCode);
                }
                else {
                    process.exit();
                }
            });
        });
    }
    static getNewInstanceCode() {
        return (Date.now() / 1000);
    }
}
exports.InstanceManager = InstanceManager;
InstanceManager.processExit = false;
//# sourceMappingURL=InstanceManager.js.map
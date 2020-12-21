import {ApiPromise, WsProvider} from '@polkadot/api';

// KSM address
const MILLORD = 'GeZVQ6R7mSZUZxBqq5PDUXrx64KXroVDwqjmAjaeXdF54Xd';

class getDatas{

    addr: string;
    wsProvider = new WsProvider('wss://kusama-rpc.polkadot.io/');
    api;

    constructor(addr: string) {
        this.addr = addr;
        this.getApi();
    }

    private async getApi(){

        let myApi;

        if (typeof this.api === 'undefined'){
            myApi = await ApiPromise.create({ provider: this.wsProvider });
        }else{
            myApi = this.api;
        }

        return myApi;
    }


    public async basicDatas(){

        const api = await this.getApi();

        console.log(`Genesis hash #${api.genesisHash.toHex()}`);
        api.rpc.chain.subscribeNewHeads((header) => {
            console.log(`Chain is at #${header.number}`);
        });
    }

    public async balance(){

        const api = await this.getApi();

        // @ts-ignore
        const { nonce, data: balance } = await api.query.system.account(this.addr);
        console.log(`balance of ${balance.free} and a nonce of ${nonce}`);
    }


    public async allAccountDatas(){

        const api = await this.getApi();

        // @ts-ignore
        const datas = await api.query.system.account(this.addr);
        console.log(datas);
    }


}

const myAddr = new getDatas(MILLORD);
// myAddr.balance();
// myAddr.basicDatas();
myAddr.allAccountDatas();

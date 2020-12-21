import { ApiPromise, WsProvider } from '@polkadot/api';

// KSM address
const MILLORD = 'GeZVQ6R7mSZUZxBqq5PDUXrx64KXroVDwqjmAjaeXdF54Xd';

class getDatas{

    addr: string;
    wsProvider = new WsProvider('wss://kusama-rpc.polkadot.io/');


    constructor(addr: string) {
        this.addr = addr;
    }


    public async basicDatas(){

        const api = await ApiPromise.create({ provider: this.wsProvider });

        console.log(`Genesis hash #${api.genesisHash.toHex()}`);
        api.rpc.chain.subscribeNewHeads((header) => {
            console.log(`Chain is at #${header.number}`);
        });
    }

    public async balance(){

        const api = await ApiPromise.create({ provider: this.wsProvider });

        // @ts-ignore
        const { nonce, data: balance } = await api.query.system.account(this.addr);
        console.log(`balance of ${balance.free} and a nonce of ${nonce}`);
    }


}

const myAddr = new getDatas(MILLORD);
myAddr.balance();
myAddr.basicDatas();

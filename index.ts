import {ScanBlock} from "./Kusama/ScanBlock";
import {testScan} from "./StartScan";

const {program} = require('commander');
// import {startScan} from "./StartScan";


const helloWorld  = () => {
    console.log("Hello world");
}

program.command("hello").action(helloWorld);

program.command("fetch")
    .option("--chain <chain>", "chain name")
    .option("--block <block>", "block number")
    .action(testScan);

program.parse(process.argv);
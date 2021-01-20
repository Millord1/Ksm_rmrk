
import {testScan} from "./StartScan.js";

const {program} = require('commander');


const helloWorld  = () => {
    console.log("Hello world");
}

program.command("hello").action(helloWorld);

program.command("fetch")
    .option("--chain <chain>", "chain name")
    .option("--block <block>", "block number")
    .action(testScan);

program.parse(process.argv);

import {testScan} from "./StartScan.js";
import {defaultWalker} from "./scenarios.js";

const {program} = require('commander');


const helloWorld  = () => {
    console.log("Hello world");
}

program.command("hello").action(helloWorld);

program.command("fetch")
    .option("--chain <chain>", "chain name")
    .option("--block <block>", "block number")
    .option("--nb <nb>", "number of blocks to scan", 0)
    .action(testScan);

program.command("story")
    .action(defaultWalker);

program.parse(process.argv);
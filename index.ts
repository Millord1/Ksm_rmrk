
import {testScan} from "./StartScan.js";
import {batchBlock, defaultWalker, obxiumBlocks} from "./scenarios.js";

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

program.command("bruno")
    .action(obxiumBlocks);

program.command('batch')
    .option("--block <block>", "block number")
    .action(batchBlock);

program.parse(process.argv);
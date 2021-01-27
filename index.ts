
import {testScan} from "./StartScan.js";
import {defaultWalker, obxiumBlocks} from "./scenarios.js";

const {program} = require('commander');


const helloWorld  = () => {
    console.log("Hello world");
}

program.command("hello").action(helloWorld);

program.command("fetch")
    .option("--chain <chain>", "chain name")
    .option("--block <block>", "block number")
    .action(testScan);

program.command("story")

    .action(defaultWalker);

program.command("bruno")
    .action(obxiumBlocks);

program.parse(process.argv);

import {scanOneBlock, testScan} from "./StartScan.js";
import {defaultWalker} from "./scenarios.js";
import {testJetski} from "./Tests/JetskiTests.js";

const {program} = require('commander');


const helloWorld  = () => {
    console.log("Hello world");
}

program.command("hello").action(helloWorld);

program.command("fetch")
    .option("--chain <chain>", "chain name")
    .option("--block <block>", "block number")
    .option("--nb <nb>", "number of blocks to scan", 0)
    .option("--limit <limit>", "block number to stop", 0)
    .action(testScan);

program.command("story")
    .action(defaultWalker);

program.command("tests").action(testJetski);

program.command("scan")
    .option("--block <block>", "Block number")
    .action(scanOneBlock);

program.parse(process.argv);
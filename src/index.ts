import {scan, startScanner} from "./Jetski/StartScan";

const {program} = require('commander');

program.command("fetch")
    .option("--chain <chain>", "chain name")
    .option("--block <block>", "", 0)
    .option("--env <env>", "env name", "gossip")
    .action(startScanner);


program.command("scan")
    .option("--chain <chain>", "chain name", "kusama")
    .option("--env <env>", "env name", "gossip")
    .option("--block <block>")
    .action(scan)

program.parse(process.argv);



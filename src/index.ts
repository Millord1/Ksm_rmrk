import {scan, startScanner} from "./Jetski/StartScan";

const {program} = require('commander');

program.command("fetch")
    .option("--chain <chain>", "chain name")
    .option("--block <block>", "", 0)
    .action(startScanner);


program.command("scan")
    .option("--chain <chain>", "chain name", "kusama")
    .option("--block <block>")
    .action(scan)

program.parse(process.argv);



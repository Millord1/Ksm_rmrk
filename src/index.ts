import {scan, startScanner, test} from "./Jetski/StartScan";

const {program} = require('commander');

program.command("fetch")
    .option("--chain <chain>", "chain name")
    .option("--block <block>", "", 0)
    .action(startScanner);


program.command("scan")
    .option("--chain <chain>", "chain name", "kusama")
    .option("--block <block>")
    .action(scan)

program.command("hello").action(test);

program.parse(process.argv);



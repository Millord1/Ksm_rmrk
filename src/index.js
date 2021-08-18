"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StartScan_1 = require("./Jetski/StartScan");
const { program } = require('commander');
program.command("fetch")
    .option("--chain <chain>", "chain name")
    .option("--block <block>", "", 0)
    .option("--env <env>", "env name", "gossip")
    .action(StartScan_1.startScanner);
program.command("scan")
    .option("--chain <chain>", "chain name", "kusama")
    .option("--env <env>", "env name", "gossip")
    .option("--block <block>")
    .action(StartScan_1.scan);
program.parse(process.argv);
//# sourceMappingURL=index.js.map
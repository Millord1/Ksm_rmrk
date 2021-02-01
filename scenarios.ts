import {Option} from "commander";
import {forceScan} from "./StartScan.js";
import {BatchReader} from "./BatchReader.js";
import {Kusama} from "./classes/Blockchains/Kusama.js";
const {program} = require('commander');

const fs = require('fs');
const path = require('path');

var exec = require('child_process').exec, child;

export const defaultWalker =  (opts: Option) => {


    // let blocks:Array<number> = [
    //     4892941,4892977,4892993,4893005,4893017,4893031,	4893349,4960562,4960567,
    //     4960570,	5083411,5083441,5098160,5238231];

    let blocks:Array<number> = [

        4960570,	5083411,5083441,5098160,5238231];

    let index:number = 0 ;
    let speed:number = 1000 ;

    blocks.forEach(blockIndex =>{


        setTimeout(function(){console.log("reading" +blockIndex); forceScan(blockIndex); }, speed*index);

        index++ ;


    });



}


export const obxiumBlocks = (opts: Option) => {

    // let blocks : Array<number> = [
    //
    //     4892957, 4892977, 4892993, 4893005, 4893017, 4893031, 4893349, 4960562, 4960567, 4960570, 5083411, 5083441, 5098160, 5238224, 5238231,
    //     5306899, 5306904, 5306933, 5367976, 5378742, 5393445, 5419694, 5419739, 5419840, 5420035, 5420272, 5420337, 5420425, 5420484, 5420541,
    //     5437915, 5437924, 5437960, 5437968, 5437975, 5437981
    //
    // ];

    let blocks : Array<number> = [
        5898481,5803669,5799848,5756453,5954879,5954949,
    ];

    let index:number = 0 ;
    let speed:number = 1000 ;

    blocks.forEach(blockIndex =>{

        setTimeout(function(){console.log("reading " + blockIndex); forceScan(blockIndex); }, speed*index);
        index++ ;
    });


}


export const batchBlock = (opts: Option) => {

    //@ts-ignore
    let blockNumber = opts.block;
    const blockToScan = blockNumber - 200;

    let index:number = 0 ;
    let speed:number = 250 ;

    const fileToRead = path.resolve(__dirname, "batchBlocks.json");

    if( !fs.existsSync(fileToRead) ){

        fs.closeSync(fs.openSync(fileToRead, 'w'));
        fs.writeFileSync(fileToRead, []);
    }

    for (let i = blockNumber; i>blockToScan; i--){

        const batchReader = new BatchReader(new Kusama());

        const blocks = fs.readFileSync(fileToRead);
        const previousBlock = JSON.parse(blocks);

        setTimeout(function (){

            console.log('reading ' + i);
            batchReader.getBatchBlocks(i).then((array) => {
                if(array.length > 0){
                    previousBlock.push(array);
                    const json = JSON.stringify(previousBlock);
                    console.log('write block ' + i);
                    fs.writeFileSync(fileToRead, json);
                }
            });

        }, speed * index);

        index ++;
    }




}

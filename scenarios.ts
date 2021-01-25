import {Option} from "commander";
import {forceScan} from "./StartScan.js";


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
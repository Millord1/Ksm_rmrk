import {CollectionInterface, NftInterface} from "./Interactions/Interaction";

export class VersionChecker
{

   private readonly version: string;

   constructor(version: string) {
        this.version = VersionChecker.findVersion(version);
   }


   private static findVersion(version: string): string
   {
       if(version.includes("1.0.0")){
           return "1.0.0";
       }
       return "";
   }


    public checkAssetVersion(data: NftInterface): boolean
    {
        if(this.version == "1.0.0"){
            return VersionChecker.assetVOne(data);
        }else{
            return false;
        }
    }


    public checkCollectionVersion(data: CollectionInterface): boolean
    {
        if(this.version === "1.0.0"){
            return VersionChecker.collectionVOne(data);
        }else{
            return false;
        }
    }


    private static collectionVOne(data: CollectionInterface): boolean
    {
        return !Number.isNaN(data.max);
    }


    private static assetVOne(data: NftInterface): boolean
    {
        // Remark 1.0.0

        if(data.instance.includes('-')){
            return false;
        }

        const computed = data.contractId.split('-');

        if(computed.length != 4){
            return false;
        }else{
            if(Number.isNaN(computed[0])){
                return false;
            }
        }

        return !Number.isNaN(data.sn);
    }



}
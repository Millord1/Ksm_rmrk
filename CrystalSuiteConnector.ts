import {EntityFactory} from "./sandra/src/EntityFactory";

import {Gossiper} from "./sandra/src/Gossiper";

export class CrystalSuiteConnector{

    private url:string ;
    private env: string;
    private factoryHeaderPath:string = 'admin/dbview/headers/'
    private viewPath:string = 'alex/getViews/?json=1'
    private gossipPath:string = 'alex/gossip/'


    public constructor(url:string,env:string,) {

        this.url = url ;
        this.env = env ;


    }



    public gossip(gossiper:Gossiper){



        return new Promise<EntityFactory[]>(res => {
            $.ajax(this.url
                +this.gossipPath,

                {
                    data:JSON.stringify(gossiper.exposeGossip()),
                    dataType: 'json',
                    type: 'POST'
                })
                .done(function (data: any) {

                }).then(function(data: any) {

                console.log("gossip result");
                console.log(data);


            });
        });







    }




}
import {EntityFactory} from "./sandra/src/EntityFactory";
import {App} from "../../app.js";
import {Gossiper} from "./sandra/src/Gossiper";

export class CrystalSuiteConnector{

    private url:string ;
    private env: string;
    private factoryHeaderPath:string = 'admin/dbview/headers/'
    private viewPath:string = 'alex/getViews/?json=1'
    private gossipPath:string = 'alex/gossip/'
    private app: App;

    public constructor(url:string,env:string,app:App) {

        this.url = url ;
        this.env = env ;
        this.app = app ;

    }

    public async functionGetFactoryHeaders(factory:EntityFactory){

        var app:App = this.app
        let datatable: any = [];

        return new Promise(res => {
            $.ajax(this.url
                +this.factoryHeaderPath
                //@ts-ignore
                +factory.tableName
                +'?jwt='+this.getCookie(),
                {
                    dataType: 'json',
                    type: 'GET',


                })
                .fail(err =>{this.userShouldLogin()})
                .done(function (data: any) {


                }).then(function(data: any) {


                data.forEach((element: any) => {

                    datatable.push({ "data": element })
                })

                res(datatable);
            });
        });
    }

    public async getViews(){

        var app:App = this.app
        let viewList: EntityFactory[] = [];

        return new Promise<EntityFactory[]>(res => {
            $.ajax(this.url
                +this.viewPath+'&jwt='+this.getCookie(),

                {
                    dataType: 'json',
                    type: 'GET'
                })
                .done(function (data: any) {

                }).then(function(data: any) {

                data.forEach((element: any) => {

                    // @ts-ignore
                    viewList.push({ viewName: element.name,tableName:element.table})
                })

                res(viewList);
            });
        });
    }

    public  userShouldLogin(){

        window.location.replace( "./alexandria/loginMinisite");


    }

    public getCookie(){

        var cookieName = 'CSAccount_jwt'


        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${cookieName}=`);
        if (parts.length === 2) { // @ts-ignore
            return parts.pop().split(';').shift();
        }

        return null ;

    }

    public gossip(gossiper:Gossiper){



        return new Promise<EntityFactory[]>(res => {
            $.ajax(this.url
                +this.gossipPath+'?jwt='+this.getCookie(),

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
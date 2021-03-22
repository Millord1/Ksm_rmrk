"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrystalSuiteConnector = void 0;
class CrystalSuiteConnector {
    constructor(url, env) {
        this.factoryHeaderPath = 'admin/dbview/headers/';
        this.viewPath = 'alex/getViews/?json=1';
        this.gossipPath = 'alex/gossip/';
        this.url = url;
        this.env = env;
    }
    gossip(gossiper) {
        return new Promise(res => {
            $.ajax(this.url
                + this.gossipPath, {
                data: JSON.stringify(gossiper.exposeGossip()),
                dataType: 'json',
                type: 'POST'
            })
                .done(function (data) {
            }).then(function (data) {
                console.log("gossip result");
                console.log(data);
            });
        });
    }
}
exports.CrystalSuiteConnector = CrystalSuiteConnector;
//# sourceMappingURL=CrystalSuiteConnector.js.map
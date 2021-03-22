"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsCannonApiManager = void 0;
let XMLHttpRequest = null;
let nodeXMLHttp = false;
try {
    XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
}
catch (e) {
    console.log(e);
}
class CsCannonApiManager {
    constructor(manager, apiUrl) {
        this.canonize = manager;
        this.apiUrl = apiUrl;
    }
    async getCollections() {
        let response = await this.apiCall('collections/');
        //console.log(response)
        let collections = [];
        response.data.forEach((collection) => {
            let oneCollection = this.canonize.createCollection(collection);
            collections.push(oneCollection);
        });
        return collections;
    }
    async apiCall(path) {
        let url = this.apiUrl;
        let base = 'api/v1/';
        return new Promise((resolve, reject) => {
            const xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", url + base + path);
            xmlhttp.send();
            console.log(url + base + path);
            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    let response = JSON.parse(this.responseText);
                    resolve(response);
                }
                else if (this.readyState == 4)
                    reject('Bad request :' + this.status);
            };
        });
    }
}
exports.CsCannonApiManager = CsCannonApiManager;
//# sourceMappingURL=CsCannonApiManager.js.map
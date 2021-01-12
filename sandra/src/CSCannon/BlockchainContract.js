var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Entity } from "../Entity.js";
import { Reference } from "../Reference.js";
import { BlockchainContractFactory } from "./BlockchainContractFactory.js";
var BlockchainContract = /** @class */ (function (_super) {
    __extends(BlockchainContract, _super);
    function BlockchainContract(factory, id, sandraManager) {
        var _this = this;
        if (factory == null)
            factory = new BlockchainContractFactory(sandraManager);
        _this = _super.call(this, factory) || this;
        _this.addReference(new Reference(sandraManager.get('id'), id));
        return _this;
    }
    return BlockchainContract;
}(Entity));
export { BlockchainContract };
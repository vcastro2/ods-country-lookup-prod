"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
/*
    TODO: Refactor to support primary vs. secondary countries
    Primary falls within centroid of polygon
*/
var ResponseModel_1 = require("./ResponseModel");
var CountryCodeResponseModel = /** @class */ (function (_super) {
    __extends(CountryCodeResponseModel, _super);
    function CountryCodeResponseModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CountryCodeResponseModel;
}(ResponseModel_1.ResponseModel));
exports.CountryCodeResponseModel = CountryCodeResponseModel;
var CountryModel = /** @class */ (function () {
    function CountryModel() {
    }
    return CountryModel;
}());
exports.CountryModel = CountryModel;

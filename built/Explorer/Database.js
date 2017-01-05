define(["require", "exports", "knockout", "../Common/Authorization", "./Collection", "../Common/DocumentClientFactory"], function (require, exports, ko, Authorization, Collection, DocumentClientFactory) {
    "use strict";
    var Database = (function () {
        function Database(container, data) {
            this.container = container;
            this.self = data._self;
            this.rid = data._rid;
            this.id = ko.observable(data.id);
            this.collections = ko.observableArray();
            this.collectionsVisible = ko.observable(false);
        }
        Database.prototype.click = function () {
            this.container.selectedDatabase(this);
            var collectionsVisible = !this.collectionsVisible();
            this.collectionsVisible(collectionsVisible);
            if (collectionsVisible) {
                this.readCollections();
            }
        };
        Database.prototype.addCollection = function () {
            console.log("add collection to " + this.id());
        };
        Database.prototype.delete = function () {
            console.log("delete " + this.id());
        };
        Database.prototype.readCollections = function () {
            var _this = this;
            Authorization.AuthHeadersUtil.getForReadCollections(this.rid)
                .then(function (authHeaders) {
                var options = {
                    initialHeaders: authHeaders
                };
                var client = DocumentClientFactory.createDocumentClient();
                var collectionsIterator = client.readCollections(_this.self, options);
                collectionsIterator.toArray(function (error, collections) {
                    if (error) {
                        throw new Error(error);
                    }
                    var collectionsViews = collections.map(function (c) { return new Collection(_this.container, _this, c); });
                    _this.collections(collectionsViews);
                });
            });
        };
        Database.prototype.mergeCollections = function (collections) {
            this.collections(collections);
        };
        return Database;
    }());
    return Database;
});

define(["require", "exports", "knockout", "../Common/Authorization", "../Common/DocumentClientFactory", "./DocumentId"], function (require, exports, ko, Authorization, DocumentClientFactory, DocumentId) {
    "use strict";
    var Collection = (function () {
        function Collection(container, database, data) {
            this.container = container;
            this.self = data._self;
            this.rid = data._rid;
            this.database = database;
            this.id = ko.observable(data.id);
            this.indexingPolicy = ko.observable();
            this.partitionKey = ko.observable();
            this.documentIds = ko.observableArray();
        }
        Collection.prototype.click = function () {
            this.container.selectedDatabase(this.database);
            this.container.selectedCollection(this);
            this.container.selectedDocument(undefined);
        };
        Collection.prototype.delete = function () {
            console.log("delete collection " + this.id());
        };
        Collection.prototype.queryDocuments = function () {
            var _this = this;
            Authorization.AuthHeadersUtil.getForQueryDocuments(this.rid)
                .then(function (authHeaders) {
                var options = {
                    initialHeaders: authHeaders
                };
                var client = DocumentClientFactory.createDocumentClient();
                var documentsIterator = client.queryDocuments(_this.self, "select c.id, c._self, c._rid from c", options);
                documentsIterator.toArray(function (error, documents) {
                    if (error) {
                        throw new Error(error);
                    }
                    var documentsIdsViews = documents.map(function (document) { return new DocumentId(_this.container, _this.self, _this.rid, document); });
                    _this.container.selectedCollectionIds(documentsIdsViews);
                });
            });
        };
        return Collection;
    }());
    return Collection;
});

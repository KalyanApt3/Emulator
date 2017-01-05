define(["require", "exports", "knockout", "../Common/Authorization", "../Common/DocumentClientFactory"], function (require, exports, ko, Authorization, DocumentClientFactory) {
    "use strict";
    var DocumentId = (function () {
        function DocumentId(container, collectionSelf, collectionRid, data) {
            this.container = container;
            this.collectionSelf = collectionSelf;
            this.collectionRid = collectionRid;
            this.self = data._self;
            this.rid = data._rid;
            this.id = ko.observable(data.id);
        }
        DocumentId.prototype.click = function () {
            this.readDocument();
        };
        DocumentId.prototype.readDocument = function () {
            var _this = this;
            Authorization.AuthHeadersUtil.getForQueryDocuments(this.collectionRid)
                .then(function (authHeaders) {
                var options = {
                    initialHeaders: authHeaders
                };
                var client = DocumentClientFactory.createDocumentClient();
                var documentsIterator = client.queryDocuments(_this.collectionSelf, "select * from c where c.id = \"" + _this.id() + "\"", options);
                documentsIterator.toArray(function (error, documents) {
                    if (error) {
                        throw new Error(error);
                    }
                    var document = documents[0];
                    _this.container.selectedDocument(document);
                });
            });
        };
        return DocumentId;
    }());
    return DocumentId;
});

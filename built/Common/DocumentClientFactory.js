define(["require", "exports", "./Request"], function (require, exports, request) {
    "use strict";
    var DocumentDB = window.DocumentDB;
    var DocumentClientFactory = (function () {
        function DocumentClientFactory() {
        }
        DocumentClientFactory.createDocumentClient = function (endpoint, requestTimeoutMs) {
            endpoint = endpoint || "https://localhost:" + location.port;
            requestTimeoutMs = requestTimeoutMs || 5000;
            DocumentDB.RequestHandler._createXmlHttpRequest = function () { return new request.HttpRequest(); };
            DocumentDB.RequestHandler._preProcessUrl = DocumentClientFactory._preProcessUrl;
            var connectionPolicy = {
                RequestTimeout: requestTimeoutMs
            };
            return DocumentDB.createClient(endpoint, undefined /*auth*/, connectionPolicy);
            ;
        };
        DocumentClientFactory._preProcessUrl = function (url, path, queryParams) {
            path = path || "";
            queryParams = queryParams ? "?" + queryParams : "";
            return url + path + queryParams;
        };
        return DocumentClientFactory;
    }());
    return DocumentClientFactory;
});

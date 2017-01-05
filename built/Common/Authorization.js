define(["require", "exports", "q"], function (require, exports, Q) {
    "use strict";
    var resourceTypes = {
        databases: "dbs",
        collections: "colls",
        documents: "docs",
        sprocs: "sprocs",
        udfs: "udfs",
        triggers: "triggers",
        users: "users",
        permissions: "permissions",
        attachments: "attachments",
        media: "media",
        conflicts: "conflicts"
    };
    var AuthHeadersUtil = (function () {
        function AuthHeadersUtil() {
        }
        AuthHeadersUtil.getForReadDatabases = function () {
            return AuthHeadersUtil._getAuthorizationHeaders("get", resourceTypes.databases, "");
        };
        AuthHeadersUtil.getForQueryDatabases = function () {
            return AuthHeadersUtil._getAuthorizationHeaders("post", resourceTypes.databases, "");
        };
        AuthHeadersUtil.getForPostDatabases = function () {
            return AuthHeadersUtil._getAuthorizationHeaders("post", resourceTypes.databases, "");
        };
        AuthHeadersUtil.getForReadCollections = function (databaseRid) {
            return AuthHeadersUtil._getAuthorizationHeaders("get", resourceTypes.collections, databaseRid);
        };
        AuthHeadersUtil.getForQueryCollections = function (databaseRid) {
            return AuthHeadersUtil._getAuthorizationHeaders("post", resourceTypes.collections, databaseRid);
        };
        AuthHeadersUtil.getForPostCollections = function (databaseRid) {
            return AuthHeadersUtil._getAuthorizationHeaders("post", resourceTypes.collections, databaseRid);
        };
        AuthHeadersUtil.getForQueryDocuments = function (collectionRid) {
            return AuthHeadersUtil._getAuthorizationHeaders("post", resourceTypes.documents, collectionRid);
        };
        AuthHeadersUtil.getForReadDocument = function (documentRid) {
            return AuthHeadersUtil._getAuthorizationHeaders("get", resourceTypes.documents, documentRid);
        };
        AuthHeadersUtil._getAuthorizationHeaders = function (verb, resourceType, resourceId) {
            var deferred = Q.defer();
            var date = new Date().toUTCString();
            Q($.ajax({
                type: 'GET',
                url: "/_explorer/authorization/" + verb + "/" + resourceType + "/" + resourceId,
                headers: {
                    "x-ms-date": date,
                    "authorization": "."
                }
            }).done(function (data) {
                deferred.resolve({
                    "x-ms-date": date,
                    "authorization": data.Token
                });
            }));
            return deferred.promise;
        };
        return AuthHeadersUtil;
    }());
    exports.AuthHeadersUtil = AuthHeadersUtil;
});

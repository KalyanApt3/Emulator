define(["require", "exports", "q", "../Common/Authorization", "./DocumentClientFactory"], function (require, exports, Q, Authorization, DocumentClientFactory) {
    "use strict";
    var DocumentDB = window.DocumentDB;
    var DocumentClientUtility = (function () {
        function DocumentClientUtility() {
        }
        DocumentClientUtility.getOrCreateDatabaseAndCollection = function (databaseId, collectionId) {
            var client = DocumentClientFactory.createDocumentClient();
            return Authorization.AuthHeadersUtil.getForReadDatabases().then(function (authHeaders) {
                var options = { initialHeaders: authHeaders };
                return DocumentClientUtility._getOrCreateDatabase(client, databaseId)
                    .then(function (database) { return DocumentClientUtility._getOrCreateCollection(client, database, collectionId); });
            });
        };
        DocumentClientUtility._getOrCreateDatabase = function (client, databaseId) {
            var deferred = Q.defer();
            var querySpec = {
                query: 'SELECT * FROM root r WHERE r.id= @id',
                parameters: [{
                        name: '@id',
                        value: databaseId
                    }]
            };
            Authorization.AuthHeadersUtil.getForQueryDatabases()
                .then(function (readDatabasesToken) {
                client.queryDatabases(querySpec, { initialHeaders: readDatabasesToken }).toArray(function (queryDatabasesError, results) {
                    if (queryDatabasesError) {
                        deferred.reject(queryDatabasesError);
                        return;
                    }
                    if (results.length > 0) {
                        deferred.resolve(results[0]);
                        return;
                    }
                    Authorization.AuthHeadersUtil.getForPostDatabases()
                        .then(function (postDatabasesToken) {
                        client.createDatabase({ id: databaseId }, { initialHeaders: postDatabasesToken }, function (createDatabaseError, created) {
                            if (createDatabaseError) {
                                deferred.reject(createDatabaseError);
                                return;
                            }
                            deferred.resolve(created);
                        });
                    });
                });
            });
            return deferred.promise;
        };
        DocumentClientUtility._getOrCreateCollection = function (client, database, collectionId) {
            var deferred = Q.defer();
            var querySpec = {
                query: 'SELECT * FROM root r WHERE r.id=@id',
                parameters: [{
                        name: '@id',
                        value: collectionId
                    }]
            };
            Authorization.AuthHeadersUtil.getForQueryCollections(database._rid)
                .then(function (readCollectionsToken) {
                client.queryCollections(database._self, querySpec, { initialHeaders: readCollectionsToken }).toArray(function (queryCollectionsError, results) {
                    if (queryCollectionsError) {
                        deferred.reject(queryCollectionsError);
                        return;
                    }
                    if (results.length > 0) {
                        var exisiting = results[0];
                        deferred.resolve(exisiting);
                        return;
                    }
                    Authorization.AuthHeadersUtil.getForPostCollections(database._rid)
                        .then(function (postCollectionsToken) {
                        client.createCollection(database._self, { id: collectionId }, { initialHeaders: postCollectionsToken }, function (createCollectionError, created) {
                            if (createCollectionError) {
                                deferred.reject(createCollectionError);
                                return;
                            }
                            deferred.resolve(created);
                        });
                    });
                });
            });
            return deferred.promise;
        };
        return DocumentClientUtility;
    }());
    return DocumentClientUtility;
});

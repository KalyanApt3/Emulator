import * as request from "./Request";
import * as Q from "q";
import * as DataModels from "../Contracts/DataModels";

import * as Authorization from "../Common/Authorization";
import DocumentClientFactory = require("./DocumentClientFactory");

var DocumentDB: any = (<any>window).DocumentDB;

class DocumentClientUtility {
    public static getOrCreateDatabaseAndCollection(databaseId: string, collectionId: string): Q.Promise<DataModels.Collection> {
        var client = DocumentClientFactory.createDocumentClient();
        
        return Authorization.AuthHeadersUtil.getForReadDatabases().then(authHeaders => {
                var options = { initialHeaders: authHeaders };
                return DocumentClientUtility._getOrCreateDatabase(client, databaseId)
                    .then((database: DataModels.Database) => DocumentClientUtility._getOrCreateCollection(client, database, collectionId));
            });
    }

    private static _getOrCreateDatabase(client: any, databaseId: string): Q.Promise<DataModels.Database> {
        var deferred = Q.defer<DataModels.Database>();
        
        var querySpec = {
            query: 'SELECT * FROM root r WHERE r.id= @id',
            parameters: [{
                name: '@id',
                value: databaseId
            }]
        };

        Authorization.AuthHeadersUtil.getForQueryDatabases()
            .then(readDatabasesToken => {
                client.queryDatabases(querySpec, { initialHeaders: readDatabasesToken }).toArray((queryDatabasesError: any, results: any[]) => {
                        if (queryDatabasesError) {
                            deferred.reject(queryDatabasesError);
                            return;
                        }

                        if (results.length > 0) {
                            deferred.resolve(results[0]);
                            return;
                        }

                        Authorization.AuthHeadersUtil.getForPostDatabases()
                            .then(postDatabasesToken => {
                                client.createDatabase({ id: databaseId }, { initialHeaders: postDatabasesToken }, (createDatabaseError: any, created: any) => {
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
    }

    private static _getOrCreateCollection(client: any, database: DataModels.Database, collectionId: string): Q.Promise<DataModels.Collection> {
        var deferred = Q.defer<DataModels.Collection>();

        var querySpec = {
            query: 'SELECT * FROM root r WHERE r.id=@id',
            parameters: [{
                name: '@id',
                value: collectionId
            }]
        };

        Authorization.AuthHeadersUtil.getForQueryCollections(database._rid)
            .then(readCollectionsToken => {
                client.queryCollections(database._self, querySpec, { initialHeaders: readCollectionsToken }).toArray((queryCollectionsError: any, results: any[]) => {
                    if (queryCollectionsError) {
                        deferred.reject(queryCollectionsError);
                        return;
                    }
            
                    if (results.length > 0) {
                        var exisiting: DataModels.Collection = results[0];
                        deferred.resolve(exisiting);
                        return;
                    }
            
                    Authorization.AuthHeadersUtil.getForPostCollections(database._rid)
                        .then(postCollectionsToken => {
                            client.createCollection(database._self, { id: collectionId }, { initialHeaders: postCollectionsToken }, (createCollectionError: any, created: DataModels.Collection) => {
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
    }
}

export = DocumentClientUtility;
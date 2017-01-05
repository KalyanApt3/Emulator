import * as ko from "knockout";
import * as Q from "q";
import * as DataModels from "../Contracts/DataModels";

var resourceTypes = {
        databases: "dbs",
        collections: "colls",
        documents: "docs",
        sprocs: "sprocs",
        udfs:  "udfs",
        triggers: "triggers",
        users: "users", 
        permissions: "permissions",
        attachments: "attachments", 
        media: "media",
        conflicts: "conflicts"
    };

export class AuthHeadersUtil {
    public static getForReadDatabases(): Q.Promise<DataModels.AuthHeaders> {
        return AuthHeadersUtil._getAuthorizationHeaders("get", resourceTypes.databases, "");
    }

    public static getForQueryDatabases(): Q.Promise<DataModels.AuthHeaders> {
        return AuthHeadersUtil._getAuthorizationHeaders("post", resourceTypes.databases, "");
    }
    
    public static getForPostDatabases(): Q.Promise<DataModels.AuthHeaders> {
        return AuthHeadersUtil._getAuthorizationHeaders("post", resourceTypes.databases, "");
    }
    
    public static getForReadCollections(databaseRid: string): Q.Promise<DataModels.AuthHeaders> {
        return AuthHeadersUtil._getAuthorizationHeaders("get", resourceTypes.collections, databaseRid);
    }

    public static getForQueryCollections(databaseRid: string): Q.Promise<DataModels.AuthHeaders> {
        return AuthHeadersUtil._getAuthorizationHeaders("post", resourceTypes.collections, databaseRid);
    }

    public static getForPostCollections(databaseRid: string): Q.Promise<DataModels.AuthHeaders> {
        return AuthHeadersUtil._getAuthorizationHeaders("post", resourceTypes.collections, databaseRid);
    }

    public static getForQueryDocuments(collectionRid: string): Q.Promise<DataModels.AuthHeaders> {
        return AuthHeadersUtil._getAuthorizationHeaders("post", resourceTypes.documents, collectionRid);
    }

    public static getForReadDocument(documentRid: string): Q.Promise<DataModels.AuthHeaders> {
        return AuthHeadersUtil._getAuthorizationHeaders("get", resourceTypes.documents, documentRid);
    }

    private static _getAuthorizationHeaders(verb: string, resourceType: string, resourceId?: string): Q.Promise<DataModels.AuthHeaders> {
        var deferred = Q.defer<DataModels.AuthHeaders>();
        var date = new Date().toUTCString();

        Q($.ajax({
            type: 'GET',
            url: "/_explorer/authorization/" + verb + "/" + resourceType + "/" + resourceId,
            headers: {
                "x-ms-date": date,
                "authorization": "."
            }
        }).done((data: DataModels.KeyResource) => {
            deferred.resolve({
                "x-ms-date": date,
                "authorization": data.Token
            });
        }));
        
        return deferred.promise;
    }
}
import * as request from "./Request";

var DocumentDB: any = (<any>window).DocumentDB;

class DocumentClientFactory {
    public static createDocumentClient(endpoint?: string, requestTimeoutMs?: number): any {
        endpoint = endpoint || "https://localhost:" + location.port;
        requestTimeoutMs = requestTimeoutMs || 5000;
        
        DocumentDB.RequestHandler._createXmlHttpRequest = () => new request.HttpRequest();
        DocumentDB.RequestHandler._preProcessUrl = DocumentClientFactory._preProcessUrl;

        var connectionPolicy = {
            RequestTimeout: requestTimeoutMs
        };

        return DocumentDB.createClient(endpoint, undefined/*auth*/, connectionPolicy);;
    }

    static _preProcessUrl(url: string, path: string, queryParams: string) {
        path = path || "";
        queryParams = queryParams ? "?" + queryParams : "";

        return url + path + queryParams;
    }
}

export = DocumentClientFactory;
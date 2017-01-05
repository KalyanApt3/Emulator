import * as ko from "knockout";
import* as  Authorization from "../Common/Authorization";
import * as Contracts from "../Contracts/ViewModels";
import * as DataModels from "../Contracts/DataModels";

import DocumentClientFactory = require("../Common/DocumentClientFactory");

class DocumentId {
    public container: Contracts.Explorer;
    public collectionSelf: string;
    public collectionRid: string;
    public self: string;
    public rid: string;
    public id: KnockoutObservable<string>;

    constructor(container: Contracts.Explorer, collectionSelf: string, collectionRid: string, data: any) {
        this.container = container;
        this.collectionSelf = collectionSelf;
        this.collectionRid = collectionRid;
        this.self = data._self;
        this.rid = data._rid;
        this.id = ko.observable(data.id);
    }

    public click() {
        this.readDocument();
    }

    public readDocument() {
        Authorization.AuthHeadersUtil.getForQueryDocuments(this.collectionRid)
            .then(authHeaders => {
                var options = {
                    initialHeaders: authHeaders
                }; 

                var client: any = DocumentClientFactory.createDocumentClient();
                var documentsIterator = client.queryDocuments(this.collectionSelf,`select * from c where c.id = "${this.id()}"`, options);
                
                documentsIterator.toArray((error: any, documents: any[]) =>{
                    if (error){
                        throw new Error(error);
                    }

                    var document: any = documents[0];
                    this.container.selectedDocument(document);
                });
            });
    }
}

export = DocumentId;

import * as ko from "knockout";
import* as  Authorization from "../Common/Authorization";
import * as ViewModels from "../Contracts/ViewModels";
import * as DataModels from "../Contracts/DataModels";

import DocumentClientFactory = require("../Common/DocumentClientFactory");
import DocumentId = require("./DocumentId");

class Collection implements ViewModels.Collection {
    public container: ViewModels.Explorer;
    public self: string;
    public rid: string;
    public database: ViewModels.Database;

    public id: KnockoutObservable<string>;
    public indexingPolicy: KnockoutObservable<any>;
    public partitionKey: KnockoutObservable<any>;
    public documentIds: KnockoutObservableArray<DocumentId>;
    
    constructor(container: ViewModels.Explorer, database: ViewModels.Database, data: any) {
        this.container = container;
        this.self = data._self;
        this.rid = data._rid;
        this.database = database;

        this.id = ko.observable(data.id);
        this.indexingPolicy = ko.observable();
        this.partitionKey = ko.observable();
        this.documentIds = ko.observableArray<DocumentId>();
    }

    public click() {
        this.container.selectedDatabase(this.database);
        this.container.selectedCollection(this);
        this.container.selectedDocument(undefined);
    }

    public delete() {
        console.log("delete collection " + this.id());
    }
        
    public queryDocuments() {
        Authorization.AuthHeadersUtil.getForQueryDocuments(this.rid)
            .then(authHeaders => {
                var options = {
                    initialHeaders: authHeaders
                }; 

                var client: any = DocumentClientFactory.createDocumentClient();
                var documentsIterator = client.queryDocuments(this.self, "select c.id, c._self, c._rid from c", options);
                
                documentsIterator.toArray((error: any, documents: DataModels.DocumentId[]) =>{
                    if (error){
                        throw new Error(error);
                    }

                    var documentsIdsViews: DocumentId[] = documents.map(document => new DocumentId(this.container, this.self, this.rid, document));
                    this.container.selectedCollectionIds(documentsIdsViews);
                });
            });
    }
}

export = Collection;
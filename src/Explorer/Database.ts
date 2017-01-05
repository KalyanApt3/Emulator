import * as ko from "knockout";
import* as  Authorization from "../Common/Authorization";
import * as ViewModels from "../Contracts/ViewModels";
import * as DataModels from "../Contracts/DataModels";

import Collection = require("./Collection");
import DocumentClientFactory = require("../Common/DocumentClientFactory");

class Database implements ViewModels.Database {
    public container: ViewModels.Explorer;
    public self: string;
    public rid: string;
    public id: KnockoutObservable<string>;
    public collections: KnockoutObservableArray<Collection>;
    public collectionsVisible : KnockoutObservable<boolean>;

    constructor(container: ViewModels.Explorer, data: any) {
        this.container = container;
        this.self = data._self;
        this.rid = data._rid;

        this.id = ko.observable(data.id);
        this.collections = ko.observableArray<Collection>();
        this.collectionsVisible = ko.observable(false);
    }

    public click() {
        this.container.selectedDatabase(this);

        var collectionsVisible = !this.collectionsVisible();
        this.collectionsVisible(collectionsVisible);

        if (collectionsVisible) {
            this.readCollections();
        }
    }

    public addCollection() {
        console.log("add collection to " + this.id());
    }
    
    public delete() {
        console.log("delete " + this.id());
    }
    
    public readCollections() {
        Authorization.AuthHeadersUtil.getForReadCollections(this.rid)
            .then(authHeaders => {
                var options = {
                    initialHeaders: authHeaders
                }; 

                var client: any = DocumentClientFactory.createDocumentClient();
                var collectionsIterator = client.readCollections(this.self, options);
                
                collectionsIterator.toArray((error: any, collections: DataModels.Collection[]) =>{
                    if (error){
                        throw new Error(error);
                    }

                    var collectionsViews: Collection[] = collections.map(c => new Collection(this.container, this, c));
                    this.collections(collectionsViews);
                });
            });
    }

    public mergeCollections(collections: Collection[]) {
        this.collections(collections);
    }
}

export = Database;
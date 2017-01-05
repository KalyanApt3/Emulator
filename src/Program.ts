import * as ko from "knockout";

import Explorer = require("./Explorer/Explorer");
import Quickstart = require("./Quickstart/Quickstart");

class Program {
    public quickstart: Quickstart = new Quickstart();
    public explorer: Explorer = new Explorer();
    public selectedDatabaseId: KnockoutComputed<string>;
    public selectedCollectionId: KnockoutComputed<string>;

    constructor() {
        this.quickstart = new Quickstart();
        this.explorer = new Explorer();

        this.selectedDatabaseId = ko.computed<string>(() => {
            return this.explorer.selectedCollection && this.explorer.selectedCollection() && this.explorer.selectedCollection() && this.explorer.selectedCollection().database && this.explorer.selectedCollection().database.id() || "";
        });

        this.selectedCollectionId = ko.computed(() => {
            return this.explorer.selectedCollection && this.explorer.selectedCollection() && this.explorer.selectedCollection().id() || "";
        });
    }

    public toggleLeftPaneExpanded() {
        this.explorer.toggleLeftPaneExpanded();
    }

    public refreshCollections() { 
        this.explorer.refreshAllDatabases();
    }
    
    public refreshCollection() {
        this.explorer.selectedCollection().queryDocuments();
    }

    public addCollection() {
        this.explorer.onClickBtnAddCollection();
    }

    public addCollection_submit() {
        this.explorer.addCollectionPane.submit();
    }
}

ko.applyBindings(new Program());

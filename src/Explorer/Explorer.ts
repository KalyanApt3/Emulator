import * as ko from "knockout";
import * as Q from "q";

import * as Authorization from "../Common/Authorization";
import * as DocumentDB from "DocumentDB";
import * as ViewModels from "../Contracts/ViewModels";
import * as DataModels from "../Contracts/DataModels";

import AddCollectionPane = require( "./AddCollectionPane");
import Collection =  require("./Collection");
import Database =  require("./Database");
import DocumentClientFactory = require( "../Common/DocumentClientFactory");
import DocumentId =  require("./DocumentId");

class Explorer implements ViewModels.Explorer {
    //Left pane
    public isLeftPaneExpanded: KnockoutObservable<boolean> = ko.observable<boolean>(true);

    // add collection
    public addCollectionPane: ViewModels.AddCollectionPane;
   
    // 
    public databases: KnockoutObservableArray<Database> = ko.observableArray<Database>();
    public databasesIds: KnockoutObservableArray<string> = ko.observableArray<string>();
    public isTreeExpanded: KnockoutObservable<boolean> = ko.observable<boolean>(true);
    public selectedDatabase: KnockoutObservable<ViewModels.Database> = ko.observable<ViewModels.Database>();
    public selectedCollection: KnockoutObservable<ViewModels.Collection> = ko.observable<ViewModels.Collection>();
    public selectedCollectionIds: KnockoutObservableArray<DocumentId> = ko.observableArray<DocumentId>();
    public selectedDocument: KnockoutObservable<any> = ko.observable<any>();

    //Filter
    public filter_predicate = ko.observable();

    public documents: KnockoutObservableArray<any> = ko.observableArray<any>();
    public selectedDocumentId: KnockoutObservable<string> = ko.observable<string>();
    public editor: monaco.editor.IStandaloneCodeEditor;

    constructor() {
        this.addCollectionPane = new AddCollectionPane(this);

        this._createEditor({ value: JSON.stringify("{}", null, 4), language: 'json' });
      
        this.selectedDocument.subscribe((selectedDocument: any) => {
            this._createEditor({ value: JSON.stringify(selectedDocument, null, 4), language: 'json' });
        });

        this.selectedDatabase.subscribe((database: Database) => {
            if (database.collectionsVisible()) {
                database.readCollections();
            }
        });

        this.selectedCollection.subscribe((collection: Collection) => {
            collection.queryDocuments();
        });

        $("#Explorer").click(this.activate);

        this.refreshAllDatabases();
    }

    private _createEditor(options: monaco.editor.IEditorConstructionOptions) {
        require(['vs/editor/editor.main'], () => {
            var container = document.getElementById('container');
            container.innerHTML = "";
            this.editor = null;

            if (options.value) { 
                this.editor = monaco.editor.create(container, options);
            }                        
        });
    }

    public activate() {
        $(".activemenuitems").removeClass('activemenu');
        $("#Explorer .activemenuitems ").addClass('activemenu');
        $("#divExplorer").show();
        $("#divQuickStart").hide();
    }
    public toggleLeftPaneExpanded() {
        this.isLeftPaneExpanded(!this.isLeftPaneExpanded());
    }

    public toggleTreeExpanded() {
        this.isTreeExpanded(!this.isTreeExpanded());
        $("#mini").removeClass('toggle-mini activescreen').addClass('toggle-left');
        $("#main").removeClass('toggle-left').addClass('toggle-main activescreen');
        $("#content").removeClass('toggle-minicontent').addClass('toggle-maincontent');
    }
    
    public refreshAllDatabases() {
        Authorization.AuthHeadersUtil.getForReadDatabases()
            .then(authHeaders => {
                var options = {
                    initialHeaders: authHeaders
                };
                var client = DocumentClientFactory.createDocumentClient();
                client.readDatabases(options).toArray((error: any, databses: DataModels.Database[]) => {
                    if (error) {
                        throw new Error(error);
                    }

                    this.databases(databses.map(database => new Database(this, database)));
                    this.databasesIds(databses.map(database => database.id));
                });
            });
    }

    public databaseClicked() {
    }

    public addCollectionToDatabase() {
    }

    public deleteDatabase() {
    }

    public deleteCollection() {
    }

    public deleteDocument() {
    }
        
    public showFilter() {
        $(".addcollection-info").fadeOut();
        $(".filter-info").fadeIn().find(".filter-info-in").animate({ "right": 0 }, 200);
    }
        
    public onClickBtnAddCollection() {
        $(".filter-info").fadeOut();
        $(".addcollection-info").fadeIn().find(".addcollection-info-in").animate({ "right": 0 }, 200);
    }

    public onClickFilterInfo() {
        $(".filter-info").fadeOut();
    }

    public onClickCollection(collection: any) {
    }

    public onClickDatabase(database: any) {
        console.log(ko.toJSON(database, null, 2));
    }
}

export = Explorer;
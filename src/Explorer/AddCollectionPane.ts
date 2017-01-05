import * as ko from "knockout";
import * as kv from "knockout.validation";

import * as DataModels from "../Contracts/DataModels";
import * as ViewModels from "../Contracts/ViewModels";
import DocumentClientUtility = require("../Common/DocumentClientUtility");

class AddCollectionPane implements ViewModels.AddCollectionPane {
    public container: ViewModels.Explorer;
    public visible: KnockoutObservable<boolean> = ko.observable<boolean>(false);

    public collectionId: KnockoutObservable<string> = ko.observable<string>()
        .extend({
            required : {
                message : 'Please specify the collectionid.',
                onlyIf : function() { 
                    return this.validateNow(); 
                }
            }
        })
        .extend({
            // Custom validation
            validation : [{
                validator : function(val: any) {
                    return (val !== undefined && val.toLowerCase() === val);
                },
                message : 'Only upper case characters are accepted.',
                onlyIf  : function() {
                    return this.validateNow()
                }
            }]
        });

    public validateNow: KnockoutObservable<boolean> = ko.observable<boolean>(false);
    public errors: KnockoutValidationErrors= ko.validation.group(this); 
    public partitionkey: KnockoutObservable<string> = ko.observable<string>();
    public newOrExisitngDatabase: KnockoutObservable<string> = ko.observable<string>("new");
    public newDatabaseName: KnockoutObservable<string> = ko.observable<string>()
        .extend({
            required : {
                message : 'Please specify the Database name.',
                onlyIf  : function() {
                    return this.newOrExisitngDatabase() === "new" || this.validateDBName();
                }
            }
        });

    public selectedExisitingDatabaseName: KnockoutObservable<string> = ko.observable<string>()
        .extend({
            required: {
                message: 'Please select the Database name.',
                onlyIf: function () {
                    return this.newOrExisitngDatabase() === "old" || this.validateDBName();
                }
            }
        });
    
    constructor(container: ViewModels.Explorer) {
        this.container = container;
    }

    public onClickCancel() {
        $(".addcollection-info").fadeOut();
    }

    public submit() {
        this.validateNow(true);
            if(this.errors().length > 0)
            {
                alert('errors');    
                return;    
            }  

        let databaseId: string = (this.newOrExisitngDatabase() === "new") ? this.newDatabaseName() : this.selectedExisitingDatabaseName();
        let collectionId: string = this.collectionId();

        DocumentClientUtility.getOrCreateDatabaseAndCollection(databaseId, collectionId)
            .then((collection: DataModels.Collection) => {
                $(".addcollection-info").fadeOut();
            });
    }
}
export = AddCollectionPane;
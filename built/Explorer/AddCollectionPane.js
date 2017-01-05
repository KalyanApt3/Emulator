define(["require", "exports", "knockout","../../Externals/knockout.validation", "../Common/DocumentClientUtility"], function (require, exports, ko, kv, DocumentClientUtility) {
    "use strict";

    //#region - Knockout validations - 22ndDec

        kv.configuration.decorateInputElement = true
        kv.configuration.errorsAsTitle = true
        kv.configuration.errorsAsTitleOnModified = false
        kv.configuration.insertMessages = false;

        ko.validation.init({
            errorElementClass: "error",
            decorateElement: true,
            registerExtenders: true,
            messagesOnModified: true,
            errorClass: 'validationMessage'
        }, true); 

     //#endregion    

    var AddCollectionPane = (function () {
        function AddCollectionPane(container) {
           
           var self  = this;      //22ndDec   
           
           self.visible = ko.observable(false);

           self.validateNow = ko.observable(false);   //22ndDec 
 
           // All the extend chaining below included - 22ndDec 
           self.collectionId = ko.observable().extend({
                                                            required : {
                                                                          message : 'Please specify the collectionid.',         
                                                                          onlyIf  : function() { return self.validateNow(); }
                                                                        }                                                
                                                        })
                                                .extend({     // Custom validation

                                                            validation : [{
                                                                           validator : function(val) {
                                                                                                return (val !== undefined && val.toLowerCase() === val);
                                                                            },
                                                                            message : 'Only upper case characters are accepted.',
                                                                            onlyIf  : function() {return self.validateNow()}       
                                                                         }] 
                                                });         

            self.partitionkey = ko.observable();
            self.newOrExisitngDatabase = ko.observable("new"); 
           self.validateDBName = ko.observable(false); 
           
            self.newDatabaseName = ko.observable().extend({
                                                            required : {
                                                                          message : 'Please specify the Database name.',         
                                                                          onlyIf  : function() { 
                                                                              return self.newOrExisitngDatabase() === "new" || self.validateDBName(); 
                                                                            }
                                                                        }                                                
                                                   });
            self.selectedExisitingDatabaseName = ko.observable().extend({
                                                                            required : {
                                                                                        message : 'Please select the Database name.',         
                                                                                        onlyIf  : function() { 
                                                                                            return self.newOrExisitngDatabase() === "old" || self.validateDBName(); 
                                                                                            }
                                                                                        }                                                
                                                                        });
            self.errors = ko.validation.group(self);  //22ndDec
            self.container = container;

            this.validateNow(true);     //22ndDec 

        }
        AddCollectionPane.prototype.onClickCancel = function () {
            $(".addcollection-info").fadeOut();
        };
        AddCollectionPane.prototype.onClickOk = function () {
            $(".addcollection-info").fadeOut();
        };
        AddCollectionPane.prototype.submit = function () {

            //below if included - 22ndDec
            this.validateNow(true);
            if(this.errors().length > 0)
            {
                alert('errors');    
                return;    
            }    

            //TODO validate
            var databaseId = (this.newOrExisitngDatabase() === "new") ? this.newDatabaseName() : this.selectedExisitingDatabaseName();
            var collectionId = this.collectionId();
            DocumentClientUtility.getOrCreateDatabaseAndCollection(databaseId, collectionId)
                .then(function (collection) {
                $(".addcollection-info").fadeOut();
            });
        };
        return AddCollectionPane;
    }());
    return AddCollectionPane;
});

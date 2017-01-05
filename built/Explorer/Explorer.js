define(["require", "exports", "knockout", "../Common/Authorization", "./AddCollectionPane", "./Database", "../Common/DocumentClientFactory"], function (require, exports, ko, Authorization, AddCollectionPane, Database, DocumentClientFactory) {
    "use strict";
    var Explorer = (function () {
        function Explorer() {
            var _this = this;
            //Left pane
            this.isLeftPaneExpanded = ko.observable(true);
            // 
            this.databases = ko.observableArray();
            this.databasesIds = ko.observableArray();
            this.isTreeExpanded = ko.observable(true);
            this.selectedDatabase = ko.observable();
            this.selectedCollection = ko.observable();
            this.selectedCollectionIds = ko.observableArray();
            this.selectedDocument = ko.observable();
            //Filter
            this.filter_predicate = ko.observable();
            this.documents = ko.observableArray();
            this.selectedDocumentId = ko.observable();
            this.addCollectionPane = new AddCollectionPane(this);
            this._createEditor({ value: JSON.stringify("{}", null, 4), language: 'json' });
            this.selectedDocument.subscribe(function (selectedDocument) {
                _this._createEditor({ value: JSON.stringify(selectedDocument, null, 4), language: 'json' });
            });
            this.selectedDatabase.subscribe(function (database) {
                if (database.collectionsVisible()) {
                    database.readCollections();
                }
            });
            this.selectedCollection.subscribe(function (collection) {
                collection.queryDocuments();
            });
            $("#Explorer").click(this.activate);
            this.refreshAllDatabases();
        }
        Explorer.prototype._createEditor = function (options) {
            var _this = this;
            require(['vs/editor/editor.main'], function () {
                var container = document.getElementById('container');
                container.innerHTML = "";
                _this.editor = null;
                if (options.value) {
                    _this.editor = monaco.editor.create(container, options);
                }
            });
        };
        Explorer.prototype.activate = function () {
            $(".activemenuitems").removeClass('activemenu');
            $("#Explorer .activemenuitems ").addClass('activemenu');
            $("#divExplorer").show();
            $("#divQuickStart").hide();
        };
        Explorer.prototype.toggleLeftPaneExpanded = function () {
            this.isLeftPaneExpanded(!this.isLeftPaneExpanded());
        };
        Explorer.prototype.toggleTreeExpanded = function () {
            this.isTreeExpanded(!this.isTreeExpanded());
            $("#mini").removeClass('toggle-mini activescreen').addClass('toggle-left');
            $("#main").removeClass('toggle-left').addClass('toggle-main activescreen');
            $("#content").removeClass('toggle-minicontent').addClass('toggle-maincontent');
        };
        Explorer.prototype.refreshAllDatabases = function () {
            var _this = this;
            Authorization.AuthHeadersUtil.getForReadDatabases()
                .then(function (authHeaders) {
                var options = {
                    initialHeaders: authHeaders
                };
                var client = DocumentClientFactory.createDocumentClient();
                client.readDatabases(options).toArray(function (error, databses) {
                    if (error) {
                        throw new Error(error);
                    }
                    _this.databases(databses.map(function (database) { return new Database(_this, database); }));
                    _this.databasesIds(databses.map(function (database) { return database.id; }));
                });
            });
        };
        Explorer.prototype.databaseClicked = function () {
        };
        Explorer.prototype.addCollectionToDatabase = function () {
        };
        Explorer.prototype.deleteDatabase = function () {
        };
        Explorer.prototype.deleteCollection = function () {
        };
        Explorer.prototype.deleteDocument = function () {
        };
        Explorer.prototype.showFilter = function () {
            $(".addcollection-info").fadeOut();
            $(".filter-info").fadeIn().find(".filter-info-in").animate({ "right": 0 }, 200);
        };
        Explorer.prototype.onClickBtnAddCollection = function () {
            $(".filter-info").fadeOut();
            $(".addcollection-info").fadeIn().find(".addcollection-info-in").animate({ "right": 0 }, 200);
        };
        Explorer.prototype.onClickFilterInfo = function () {
            $(".filter-info").fadeOut();
        };
        Explorer.prototype.onClickCollection = function (collection) {
        };
        Explorer.prototype.onClickDatabase = function (database) {
            console.log(ko.toJSON(database, null, 2));
        };
        return Explorer;
    }());
    return Explorer;
});

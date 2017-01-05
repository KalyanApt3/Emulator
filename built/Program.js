define(["require", "exports", "knockout", "./Explorer/Explorer", "./Quickstart/Quickstart"], function (require, exports, ko, Explorer, Quickstart) {
    "use strict";
    var Program = (function () {
        function Program() {
            var _this = this;
            this.quickstart = new Quickstart();
            this.explorer = new Explorer();
            this.quickstart = new Quickstart();
            this.explorer = new Explorer();
            this.selectedDatabaseId = ko.computed(function () {
                return _this.explorer.selectedCollection && _this.explorer.selectedCollection() && _this.explorer.selectedCollection() && _this.explorer.selectedCollection().database && _this.explorer.selectedCollection().database.id() || "";
            });
            this.selectedCollectionId = ko.computed(function () {
                return _this.explorer.selectedCollection && _this.explorer.selectedCollection() && _this.explorer.selectedCollection().id() || "";
            });
        }
        Program.prototype.toggleLeftPaneExpanded = function () {
            this.explorer.toggleLeftPaneExpanded();
        };
        Program.prototype.refreshCollections = function () {
            this.explorer.refreshAllDatabases();
        };
        Program.prototype.refreshCollection = function () {
            this.explorer.selectedCollection().queryDocuments();
        };
        Program.prototype.addCollection = function () {
            this.explorer.onClickBtnAddCollection();
        };
        Program.prototype.addCollection_submit = function () {
            this.explorer.addCollectionPane.submit();
        };
        return Program;
    }());
    ko.applyBindings(new Program());
});

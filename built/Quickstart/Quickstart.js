define(["require", "exports"], function (require, exports) {
    "use strict";
    var Quickstart = (function () {
        function Quickstart() {
            $("#Quickstart").click(this.activate);
        }
        Quickstart.prototype.activate = function () {
            $(".activemenuitems").removeClass('activemenu');
            $("#Quickstart .activemenuitems ").addClass('activemenu');
            $("#divExplorer").hide();
            $("#divQuickStart").show();
        };
        return Quickstart;
    }());
    return Quickstart;
});

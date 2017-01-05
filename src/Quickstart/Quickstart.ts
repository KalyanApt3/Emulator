class Quickstart{
    constructor() {
        $("#Quickstart").click(this.activate);
    }

    public activate(){
        $(".activemenuitems").removeClass('activemenu');
        $("#Quickstart .activemenuitems ").addClass('activemenu');
        $("#divExplorer").hide();
        $("#divQuickStart").show();
    }
}

export = Quickstart;
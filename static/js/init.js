var init = function() {
    var timer = new Timer('#refresh-counter');
    data_manager = new DataManager();
    
    var refresh = function() {
        timer.reset();
        data_manager.refreshData(function () {
            timer.start();
        });
    }

    
    $("#refresh").click(refresh);
    
    var tab_callbacks = {
        'word-graph': views.redrawWordGraph,
        'post-graph': views.redrawPostGraphs,
        'post-table': views.redrawPostTable
    }
    TabManager('.tab','.box', tab_callbacks);
    
    $("#search").click( views.redrawWordGraph );
    $("#q").val("HN");
    $("#search").click();
    refresh();
}

$(document).ready(init);

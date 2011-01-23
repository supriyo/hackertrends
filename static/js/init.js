

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
        'word-graph': function () {}, //refreshWordGraph
        'post-graph': views.redrawPostGraphs,
        'post-table': views.redrawPostTable
    }
    TabManager('.tab','.box', tab_callbacks);
    
    $("#search").click( function () {
        //TODO: Move this into a graph function
        var q = $("#q").val();
        if(q!=''){
            $.getJSON('/query-time-series/', {q:q}, function (response) {
                var lines = [];
                for(var i=0; i < response.length; i++){
                    var line = [];
                    for(var j=0; j<response[i].length; j++){
                        var date = response[i][j]["_id"]["date"];
                        line.push([Date.parse(date), response[i][j]["value"]["count"]])
                    }
                    lines.push(line);
                }
                $.plot($("#wordfrequency"), lines, {
                    series:{
                      points: {show:true},
                      lines: {show:true}
                    },
                    legend: {
                        show: false
                    },
                    xaxis: {
                        mode: "time"
                      },
                    yaxis: {
                        min: 0,
                        ticks: function(range) {
                            var ticks = []
                            for(var i=0; i< 2*range.max; i++){
                                ticks.push(i);
                            }
                            return ticks;
                        }
                    }
                });
            });
        }
    });
    
    // $("#q").val("Apple");
    // $("#search").click();
    refresh();
}
$(document).ready(init);





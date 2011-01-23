

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
                    for(var j=0; j<response[i].data.length; j++){
                        var date = response[i].data[j]["_id"]["date"];
                        line.push([Date.parse(date), response[i].data[j]["value"]["count"]])
                    }
                    lines.push({label: response[i].label, data: line});
                }
                $.plot($("#wordfrequency"), lines, {
                    series: {
                        points: {show:true},
                        lines: {show:true}
                    },
                    legend: {
                        show: true,
                        container: $("#legend")
                    },
                    xaxis: {
                        mode: "time",
                        ticks: function (range){
                            var ticks = [];
                            for(var t=range.min; t<=range.max; t+=1000*60*60*24){
                                ticks.push(t);
                            }
                            return ticks;
                        },
                        minTickSize: [1, "day"]
                    },
                    yaxis: {
                        min: 0,
                        ticks: function(range) {
                            var ticks = [];
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
    
    $("#q").val("Apple");
    $("#search").click();
    refresh();
}
$(document).ready(init);





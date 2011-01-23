var views = {
    redrawPostTable: function () {
        var data = data_manager.posts;
        $("table#post-table-table").empty();
    
        var append_html = '<tr><th class="number">#</th>' +
                        '<th class="title">title</th>' +
                        '<th class="rank">max rank</th>' +
                        '<th class="rank">score</th>' +
                        '<th class="rank">#&nbsp;comments</th>' +
                        '<th class="age">age</th>' +
                        '<th class="age">last seen</th>' +
                        '<th class="age">time in top 30</th>' +
                        '<th class="age">time to max rank</th></tr>';
    
        var current_rank = 0;
        var odd_even = 'odd';
        for(var i = 0; i < data.length; i++) {

            if (current_rank != data[i].rank) {
                if(odd_even === 'odd') {
                    odd_even = 'even';
                } else {
                    odd_even = 'odd';
                }
                current_rank = data[i].rank;
            }
        
            append_html += '<tr class="data-row ' + odd_even +'" title="posted by ' + data[i].user + '">';
            append_html += '<td class="number">' + (i + 1).toString() + '</td>';
            append_html += '<td class="title"><a href="http://news.ycombinator.com/item?id='+ data[i].hn_id.toString() +'">' + data[i].title_text +' &raquo;</a></td>';
            append_html += '<td class="rank">' + data[i].rank +'</td>';
            append_html += '<td class="rank">' + data[i].score +'</td>';
            append_html += '<td class="rank">' + data[i].num_comments +'</td>';
            append_html += '<td class="age">' + data[i].rel_age +' <span>hours</span></td>';
            append_html += '<td class="age">' + data[i].last_seen +' <span>hours</span></td>';
            append_html += '<td class="age">' + data[i].time_in_top_30 +' <span>hours</span></td>';
            append_html += '<td class="age">' + data[i].time_to_max_rank +' <span>hours</span></td>';
            append_html += '</tr>';
        }
        $("table#post-table-table").append(append_html);
    },

    redrawPostGraphs: function () {
    
        var post_graphs = postGraphsOptions();
    
        var data = data_manager.posts;
        $("#post-graphs-box .graph").empty();
        var data_set = {
            "countvsrank": [],
            "top30vsrank": [],
            "commentsvsrank": [],
            "commentsvstop30": [],
            "countvstimemaxrank": []
        }
    
        // Prime counts
        for(var i = 1; i <= 30; i++) { data_set.countvsrank.push([i,0]); }
        for(var i = 0; i <= data_manager.post_max.time_to_max_rank; i++) { data_set.countvstimemaxrank.push([i,0]); }
    
        // Load data into data_set
        for(var i = 0; i < data.length; i++) {
            data_set.countvsrank[data[i].rank - 1][1] = data_set.countvsrank[data[i].rank - 1][1] + 1;
            data_set.top30vsrank.push( utils.jitterXY( [data[i].rank, data[i].time_in_top_30] ) );
            data_set.commentsvsrank.push( utils.jitterXY( [data[i].rank, data[i].num_comments] ) );
            data_set.commentsvstop30.push( utils.jitterXY( [data[i].time_in_top_30, data[i].num_comments] ) );
            data_set.countvstimemaxrank[data[i].time_to_max_rank][1] = data_set.countvstimemaxrank[data[i].time_to_max_rank][1] + 1;
        }
    
        for (var i in data_set) {
            $.plot($("#" + i), [data_set[i]], post_graphs[i]);
        }
    }
}
function postGraphsOptions () {
        return {
            "countvsrank": {
                series: {
                    bars: { show: true }
                },
                yaxis: {
                    min: 0,
                },
                xaxis: {
                    ticks: 30,
                    min: 1,
                    max: 31
                },
                grid: {
                    tickColor: "#eee"
                }
            },
            "top30vsrank": {
                series: {
                    points: { show: true }
                },
                yaxis: {
                    min: 0,
                },
                xaxis: {
                    ticks: 30,
                    min: 0,
                    max: 31
                },
                grid: {
                    tickColor: "#eee"
                }
            },
            "commentsvsrank": {
                series: {
                    points: { show: true }
                },
                yaxis: {
                    min: 0,
                },
                xaxis: {
                    ticks: 30,
                    min: 0,
                    max: 31
                },
                grid: {
                    tickColor: "#eee"
                }
            },
            "commentsvstop30": {
                series: {
                    points: { show: true }
                },
                yaxis: {
                    min: 0,
                },
                xaxis: {
                    ticks: data_manager.post_max.time_in_top_30,
                    min: 0,
                    max: data_manager.post_max.time_in_top_30
                },
                grid: {
                    tickColor: "#eee"
                }
            },
            "countvstimemaxrank": {
                series: {
                    bars: { show: true }
                },
                yaxis: {
                    min: 0,
                },
                xaxis: {
                    ticks: data_manager.post_max.time_to_max_rank,
                    min: 0,
                    max: data_manager.post_max.time_to_max_rank
                },
                grid: {
                    tickColor: "#eee"
                }
            }
        }
    }

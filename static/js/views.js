function redrawPostTable(data) {
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
    console.log($("table#post-table-table"));
    $("table#post-table-table").append(append_html);
}

// var graphs = {
//     "countvsrank": {
//         series: {
//             bars: { show: true }
//         },
//         yaxis: {
//             min: 0,
//         },
//         xaxis: {
//             ticks: 30,
//             min: 1,
//             max: 31
//         },
//         grid: {
//             tickColor: "#eee"
//         }
//     },
//     "top30vsrank": {
//         series: {
//             points: { show: true }
//         },
//         yaxis: {
//             min: 0,
//         },
//         xaxis: {
//             ticks: 30,
//             min: 0,
//             max: 31
//         },
//         grid: {
//             tickColor: "#eee"
//         }
//     },
//     "commentsvsrank": {
//         series: {
//             points: { show: true }
//         },
//         yaxis: {
//             min: 0,
//         },
//         xaxis: {
//             ticks: 30,
//             min: 0,
//             max: 31
//         },
//         grid: {
//             tickColor: "#eee"
//         }
//     },
//     "commentsvstop30": {
//         series: {
//             points: { show: true }
//         },
//         yaxis: {
//             min: 0,
//         },
//         xaxis: {
//             ticks: dm.post_max.time_in_top_30,
//             min: 0,
//             max: dm.post_max.time_in_top_30
//         },
//         grid: {
//             tickColor: "#eee"
//         }
//     },
//     "countvstimemaxrank": {
//         series: {
//             bars: { show: true }
//         },
//         yaxis: {
//             min: 0,
//         },
//         xaxis: {
//             ticks: dm.post_max.time_to_max_rank,
//             min: 0,
//             max: dm.post_max.time_to_max_rank
//         },
//         grid: {
//             tickColor: "#eee"
//         }
//     }
// }
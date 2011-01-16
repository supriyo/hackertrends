var request = require('request'),
    jsdom = require('jsdom'),
    sys = require('sys');

var window;
var data = [];

var requestCallback = function (error, response, body) {
    sys.puts(response.statusCode);
    if (!error && response.statusCode == 200) {
        window = jsdom.jsdom(body).createWindow();
        jsdom.jQueryify(window, 'jquery-1.4.2.min.js' , function() {
            window.$('.title').each(function () {
                var self = window.$(this);
                var title_a = self.children('a');
                var title_text = title_a.text();
                sys.puts('\n\n');
                if (title_text !== '' && title_text !== 'More') {
                    var title_domain = self.children('span.comhead').text().replace(' (','').replace(') ','');
                    var title_href = title_a.attr('href');
                    
                    var subtext = self.parent().next().children('td.subtext');
                    var score = parseInt(subtext.children('span').text().replace(' points',''));
                    var user = subtext.children('a[href^="user?id="]').text();
                    var hn_id = parseInt(subtext.children('a[href^="item?id="]').attr('href').replace('item?id=',''));
                    var num_comments = parseInt(subtext.children('a[href^="item?id="]').text().replace(' comments',''));
                    
                    var subtext_text = subtext.html();
                    var right_index = -1, left_index = -1;
                    right_index = subtext_text.indexOf('ago') - 1;
                    left_index = subtext_text.indexOf('</a>') + 5;
                    
                    var age = '';
                    if (left_index < right_index) {
                        age = subtext_text.substring(left_index, right_index);
                    }
                    
                    var rank = parseInt(self.prev().prev('td.title').text().replace('.',''));
                    
                    var obj = {
                        rank: rank,
                        title_text: title_text,
                        title_domain: title_domain,
                        title_href: title_href,
                        score: score,
                        hn_id: hn_id,
                        num_comments: num_comments,
                        age: parseAge(age),
                        user: user
                    }
                    for (var i in obj) {
                        sys.puts(i + '=' + obj[i]);
                    }
                    updateData(obj);
                }

            });
        });
    }
}

// returns age in hours
function parseAge(age) {
    if(age.indexOf('day') > -1) {
        return parseInt(age.replace(' day','')) * 24;
    } else if (age.indexOf('days') > -1) {
        return parseInt(age.replace(' days','')) * 24;
    } else if (age.indexOf('hour') > -1) {
        return parseInt(age.replace(' hour',''));
    } else if (age.indexOf('hours') > -1) {
        return parseInt(age.replace(' hours',''));
    } else {
        return 0;
    }
}

function updateData(obj) {
    data.push(obj);
    if (data.length === 30) {
        sys.puts('finished!');
    }
}

function init() {
    request({uri:'http://news.ycombinator.com'}, requestCallback);
}

init();



// <tr>
//     <td align=right valign=top class="title">1.</td>
//     <td>
//         <center>
//             <a id=up_2107264 onclick="return vote(this)" href="vote?for=2107264&dir=up&by=alecperkins&auth=bf4dc7d9bf5f42292f3e9935e8359f03dde70644&whence=%6e%65%77%73">
//                 <img src="http://ycombinator.com/images/grayarrow.gif" border=0 vspace=3 hspace=2>
//             </a>
//             <span id=down_2107264></span>
//         </center>
//     </td>
//     <td class="title">
//         <a href="http://blog.backblaze.com/2011/01/05/10-petabytes-visualized/">10 petabytes - visualized</a>
//         <span class="comhead"> (backblaze.com) </span>
//     </td>
// </tr>
// <tr>
//     <td colspan=2></td>
//     <td class="subtext">
//         <span id=score_2107264>19 points</span> by <a href="user?id=geekfactor">geekfactor</a> 1 hour ago  | <a href="item?id=2107264">7 comments</a>
//     </td>
// </tr>
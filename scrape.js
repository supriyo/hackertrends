(function () {
    
    function Post (new_post_object) {
    var target_obj = new_post_object;
    sys.puts('saving post: ' + target_obj.title_text);

    getCollection( function (post_collection) {

        var q = { hn_id: target_obj.hn_id }

        var q_callback = function (error, result) {
            if ( !error ) {
                var changed = false;

                if (result) {
                    if(target_obj.rank < result.rank) {
                        result.rank = target_obj.rank;
                        changed = true;
                        result.rank_max_time = new Date();
                    }
                    if(target_obj.num_comments > result.num_comments) {
                        result.num_comments = target_obj.num_comments;
                        changed = true;
                        result.comments_max_time = new Date();
                    }
                    if(target_obj.score > result.score) {
                        result.score = target_obj.score;
                        changed = true;
                        result.score_max_time = new Date();
                    }
                    target_obj = result;
                } else {
                    target_obj.added_at = new Date(); // this plus age to get actual age
                    target_obj.rank_max_time = new Date();
                    target_obj.comments_max_time = new Date();
                    target_obj.score_max_time = new Date();
                }
                
                target_obj.updated_at = new Date(); // acts as a 'last seen on front page' tracker
                
                if(result) {
                    if(changed) {
                        post_collection.save(target_obj, function () {
                            sys.puts('updated: ' + target_obj.title_text);
                            updatePostCount();
                        });
                    } else {
                        sys.puts('same: ' + target_obj.title_text);
                        updatePostCount();
                    }
                } else {
                    post_collection.insert(target_obj, function () {
                        sys.puts('inserted: ' + target_obj.title_text);
                        updatePostCount();
                    });
                }
            }
        }
        
        post_collection.findOne(q, q_callback);
    });
}



function Scrape () {

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
                        if(isNaN(num_comments)){
                            num_comments = 0;
                        }
                        
                        var subtext_text = subtext.html();
                        var right_index = -1,
                            left_index = -1;
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
                        Post(obj);
                    }

                });
            });
        }
    }

    request({uri:'http://news.ycombinator.com'}, requestCallback);
}

function parseAge(age) {
    if(age.indexOf('day') > -1) {
        age = parseFloat(age.replace(' day','')) * 24;
    } else if (age.indexOf('days') > -1) {
        age = parseFloat(age.replace(' days','')) * 24;
    } else if (age.indexOf('hour') > -1) {
        age = parseFloat(age.replace(' hour',''));
    } else if (age.indexOf('hours') > -1) {
        age = parseFloat(age.replace(' hours',''));
    } else {
        age = 0;
    }
    //convert age in hours to ms
    age = age * 60 * 60 * 1000;
    var date = new Date();
    date.setTime(date.getTime() - age);
    return date;
}

function updatePostCount () {
    num_posts_parsed++;
    if(num_posts_parsed === 30) {
        db.close();
    }
}

function getCollection (callback) {
    db.collection('posts', function (error, post_collection) {
        if(!error) {
            callback(post_collection);
        }
    });
}



var HOST = "localhost";
var PORT = 27017;

var request = require('request'),
    jsdom = require('jsdom'),
    sys = require('sys'),
    DB = require('mongodb/db').Db,
    Server= require('mongodb/connection').Server;

var db = new DB('hackertrends', new Server(HOST, PORT, {auto_reconnect: false}, {}));
db.open(function () {});

var num_posts_parsed = 0;

Scrape();

})();
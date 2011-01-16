
var mongoose = require('mongoose').Mongoose;

mongoose.model('Post', {

    properties: ['rank','title_text','title_domain','title_href','score','hn_id','num_comments','age','user'],

    cast: {
        rank: Number,
        title_text: String,
        title_domain: String,
        title_href: String,
        score: Number,
        hn_id: Number,
        num_comments: Number,
        age: Number,
        user: String
    },

    methods: {
        save: function(fn){
            this.updated_at = new Date();
            this.__super__(fn);
        },
        populate: function (new_obj) {
            this.rank = new_obj.rank;
            this.title_text = new_obj.title_text;
            this.title_domain = new_obj.title_domain;
            this.title_href = new_obj.title_href;
            this.score = new_obj.score;
            this.hn_id = new_obj.hn_id;
            this.num_comments = new_obj.num_comments;
            this.age = new_obj.age;
            this.user = new_obj.user;
        }
    }

});

var db = mongoose.connect('mongodb://localhost/db');
var Post = db.model('Post');

var Scraper = function () {

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
            sys.puts('finished fetching!');
            sys.puts('storing data');
            for(var i = 0; i < data.length; i++) {
                sys.puts('processing: ' + data[i].hn_id.toString() + ' ' + data[i].title_text);
                var post_object = data[i];
                Post.find({ hn_id: post_object.hn_id }).all(function(objs) {
                    if(objs.length > 0) {
                        sys.puts('exists: ' + objs[0].hn_id.toString() + ' ' + objs[0].title_text);
                        sys.puts((post_object.rank - objs[0].rank).toString());
                    } else {
                        var p = new Post();
                        console.log('new: ' + post_object.hn_id.toString() + ' ' + post_object.title_text);
                        p.populate(post_object);
                        p.save(function () {
                            sys.puts('saved: ' + p.hn_id.toString() + ' ' + p.title_text);
                        });
                    }
                });
            }
        }
    }

    function scrapeData() {
        request({uri:'http://news.ycombinator.com'}, requestCallback);
    }

    this.init = function () {
        scrapeData();
    }
    
    return this;
}

var scraper = new Scraper();
scraper.init();
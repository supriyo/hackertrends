var urls = {
    get_words: '/words/',
    get_posts: '/posts/',
    get_word: '/word/'
}

var TabManager = function(tab_selector, box_selector, callbacks) {
    var boxes = $(box_selector);
    var tabs = $(tab_selector);
    tabs.each( function () {
        var self = $(this);
        self.click( function () {
            boxes.hide();
            $(".selected").removeClass("selected");
            self.addClass("selected");
            target = self.attr('name');
            $(box_selector+"[name=" + target +"]").show();
            if(callbacks && callbacks[target]) {
                callbacks[target]();
            }
        });
    });

    var refreshCurrentTab = function (sender, event_args) {
        var hash = window.location.hash.substring(1);
        if(hash) {
            tabs.filter("[name=" + hash + "]").click();
        } else {
            tabs.first().click();
        }
    }

    data_refresh = new CustomEvent("refresh-data");
    data_refresh.subscribe(refreshCurrentTab);
    
    refreshCurrentTab();
    return this;
}

var DataManager = function() {
    var self = this;
    self.posts = [];
    self.words = [];
    
    self.post_max = {
        time_to_max_rank: 0,
        time_in_top_30: 0
    }
    
    self.word_max = {
        avg_score: 0,
        avg_comments: 0
    }
    
    var refreshing_posts = false,
        refreshing_words = false;
    
    function updateCounts() {
        $("#post-count").text(self.posts.length + ' posts');
        $("#word-count").text(self.words.length + ' words');
    }
    
    function refreshPostData() {
        self.posts = [];
        refreshing_posts = true;
        $.ajax({
            url: urls.get_posts,
            data: { rank: 30 },
            success: function (response) {
                for(var i = 0; i < response.length; i++) {
                    var post = new Post(response[i]);
                    self.posts.push(post);
                    
                    if(post.time_to_max_rank > self.post_max.time_to_max_rank) {
                        self.post_max.time_to_max_rank = post.time_to_max_rank;
                    }
                    
                    if (post.time_in_top_30 > self.post_max.time_in_top_30) {
                        self.post_max.time_in_top_30 = post.time_in_top_30;
                    }
                }
                refreshing_posts = false;
                data_refresh.fire(null, { message: '' });
            },
            dataType: "jsonp"
         });
    }
    
    function refreshWordData() {
        self.words = [];
        refreshing_words = true;
        $.ajax({
            url: urls.get_words,
            data: {  },
            success: function (response) {
                for(var i = 0; i < response.length; i++) {
                    var word = new Word(response[i]);
                    self.words.push(word);
                    
                    if(word.avg_score > self.word_max.avg_score) {
                        self.word_max.avg_score = word.avg_score;
                    }
                    
                    if(word.avg_comments > self.word_max.avg_comments) {
                        self.word_max.avg_comments = word.avg_comments;
                    }
                }
                refreshing_words = false;
            },
            dataType: "json"
         });
    }
    
    this.refreshData = function (callback) {
        refreshWordData();
        refreshPostData();
        $(document).ajaxSuccess(function(e, xhr, settings) {
            if ((settings.url == urls.get_posts || settings.url == urls.get_words) && !refreshing_posts && !refreshing_words) {
                //update view
                updateCounts();
                if(callback) {
                    callback();
                }
            }
        });
    }
    
    this.sortPosts = function (sort) {
        self.posts.sort(sort_functions(sort));
    }
    this.sortWords = function (sort) {
        self.words.sort(sort_functions(sort));
    }
    
    function sort_functions(sort) {
        if(sort.substring(0,1) === "-") {
            return function (a,b) { return b[sort.substring(1)] - a[sort.substring(1)]; }
        } else {
            return function (a,b) { return a[sort] - b[sort]; }
        }
    }
    
    return self;
}
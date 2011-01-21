var Word = function (word) {
    var self = this;
    for(var i in word) {
        self[i] = word[i];
    }
    
    return self;
}

var Post = function (post) {
    var self = this;
    
    for(var i in post) {
        self[i] = post[i];
    }
    self.time_to_max_rank = Math.floor(((new Date(self.rank_max_time)).getTime()-(new Date(self.age)).getTime())/(1000*60*60));
    self.rel_age = Math.floor(((new Date()).getTime()-(new Date(self.age)).getTime())/(1000*60*60));
    self.time_in_top_30 = Math.floor(((new Date(self.updated_at)).getTime()-(new Date(self.added_at)).getTime())/(1000*60*60));
    self.last_seen = Math.floor(((new Date()).getTime()-(new Date(self.updated_at)).getTime())/(1000*60*60));
    
    return self;
}
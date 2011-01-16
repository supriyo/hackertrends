function map() {
    var words = this.title.match(/\w+/g);
    
    if(words == null) return;
    
    for(var i = 0; i < words.length; i++){
        emit(words[i], {count:1, score: this.score});
    }
}
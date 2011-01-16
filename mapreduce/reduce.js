function reduce(key, values){
    var total = 0;
    var total_score = 0;
    for (var i = 0; i < values.length; i++){
        total += values[i].count;
        total_score += values[i].score
    }
    
    return {count: total, avg_score: total/total_score};
}
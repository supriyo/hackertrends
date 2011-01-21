

var init = function() {
    TabManager('.tab','.box');
    var timer = new Timer('#refresh-counter');
    data_manager = new DataManager();
    
    var refresh = function() {
        timer.reset();
        data_manager.refreshData(function () {
            timer.start();
            console.log(data_manager);
        });
    }
    
    $("#refresh").click(refresh);
    
    refresh();
}
$(document).ready(init);





var Timer = function (target_selector) {
    var self = this;
    var counter = $(target_selector);
    var count = -1;
    
    self.timer = undefined;
    
    self.paused = true;
    
    self.start = function () {
        self.paused = false;
        self.timer = setInterval(function () {
            count++;
            counter.text('(' + self.timerText() + ' old)');
        },1000);
    }
    
    self.reset = function () {
        self.pause();
        counter.text('( ~ )');
        count = -1;
    }

    self.pause = function () {
        if(!self.paused) {
            console.log(self.timer);
            clearInterval(self.timer);
            console.log('clear');
            self.paused = true;
        }
    }
    
    self.timerText = function () {
        var sec = count % 60;
        var min = Math.floor(count/60).toString();
        sec = ( (sec < 10) ? ':0' : ':' ) + sec.toString();
        return min + sec;
    }
    return this;
}

var utils = {
    jitterXY: function (point) {
        var x_factor = 0.1;
        var y_factor = 0.1;
        
        var x_offset = point[0] === 0 ? 0 : x_factor / -2;
        var y_offset = point[1] === 0 ? 0 : y_factor / -2;
        
        point[0] = point[0] + x_offset + (Math.random() * (x_offset * -2 + x_factor / 2) ) ;
        point[1] = point[1] + y_offset + (Math.random() * (y_offset * -2 + y_factor / 2)) ;
        
        point[0] = (point[0] < 0) ? 0 : point[0];
        point[1] = (point[1] < 0) ? 0 : point[1];
        return point;
    }
}

//from http://www.geekdaily.net/2008/04/02/javascript-defining-and-using-custom-events/
var CustomEvent = function() {
	//name of the event
	this.eventName = arguments[0];
	var mEventName = this.eventName;

	//function to call on event fire
	var eventAction = null;

	//subscribe a function to the event
	this.subscribe = function(fn) {
		eventAction = fn;
	};

	//fire the event
	this.fire = function(sender, eventArgs) {
		if(eventAction != null) {
			eventAction(sender, eventArgs);
		}
		else {
			alert('There was no function subscribed to the ' + mEventName + ' event!');
		}
	};
};

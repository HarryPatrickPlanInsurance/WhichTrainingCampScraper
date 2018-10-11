function CallAfterDelay(callback, delay){
	var timer;
	var then = new Date().getTime();
	function run(){
		var now = new Date().getTime();
		var ellapsed = now - then;
		then = now;
		var requiredDelay = delay - ellapsed;
		if(requiredDelay >0){
			if(!timer){
				timer = new Timer(function(){
					then = new Date().getTime();
					callback();
					}, delay, 1);
			}
			else{
				timer.setDelay(requiredDelay);
				timer.reset();
			}
		}
		else{
			callback();
		}
	}
	new Task(callback).run();
	return run;
}
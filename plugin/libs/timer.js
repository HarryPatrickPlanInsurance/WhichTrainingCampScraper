
	function Timer(funct, delayMs, times)
{
    var self = this;
    var timesCount = 0;
    if (times == undefined)
    {
        times = -1;
    }
    if (delayMs == undefined)
    {
        delayMs = 10;
    }
    function tick()
    {
        if (times >= 0)
        {
            timesCount++;
            if (timesCount >= times)
            {
                self.stop();
            }
        }
        try
        {
            funct();
        }
        catch (ex)
        {
            console.log(ex);
        }
    }
        var interval;
        function setInterval()
        {
            interval = window.setInterval(tick, delayMs);
        }
        function cancelInterval()
        {
            if (interval)
            {
                clearInterval(interval);
            }
        }
        this.stop = function ()
        {
            cancelInterval();
        };
        this.reset = function ()
        {
            timesCount = 0;
            cancelInterval();
            setInterval();
        };
		this.setDelay=function(delay)
		{
			self.stop();
			delayMs = delay;
			self.reset();
		};
    setInterval();
}
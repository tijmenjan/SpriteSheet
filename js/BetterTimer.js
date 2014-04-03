function BetterTimer(fps, callback)
{
    this.start = null;
    this.lastframe = new Date().getTime();
    
    this.fps = fps;
    this.microseconds = Math.round(1000/this.fps);
    this.lastcomp = 0;
    this.stopped = false;


    this.stop = function() {
          this.stopped = true;
    }

    this.instance = function()
    {
        if (this.start == null) {
             this.start = new Date().getTime();
        }
       callback();
       var diff = ((new Date().getTime() - this.lastframe)-this.microseconds);
       var self = this;
       this.lastframe = new Date().getTime();
       this.lastcomp = diff;
       if (this.stopped==false) {
           window.setTimeout(function(){self.instance()}, this.microseconds-diff);
       }
    }

    var self = this;
    window.setTimeout(function(){self.instance()}, this.microseconds);
}
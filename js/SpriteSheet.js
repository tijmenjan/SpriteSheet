//SpriteSheet 1.0
//Tijmen Mulder - Mulder She Wrote
//Questions? Suggestions?
//Tijmen@muldershewrote.com

//--Description--

//This simple lib will allow you to play a spritesheet created with texturepacker.
//It's created for usage in a website, not a canvas game. There are other libs for that purpose.

//In texturepacker, select JSON (Array) as output, and disable 'Allow rotation'.

//You can use the texturepacker png directly, or create jpeg and png mask.
//When using a jpeg file, it will look for filename-mask.png. Look at the attached assets if it's not clear.

//--USAGE--

// name = new SpriteSheet(atlas file, image file, container css selector, callback function,scale (optional), type (html or canvas, optional), fps (optional));
// EXAMPLE
// ss = new SpriteSheet("animation.json", "animation.png", "#sscontainer", callbackfunction,1, 'canvas', 30);
//-----------------------
//
//
//--METHODS--
//-----------------------
// play(from frame (optional), to frame (optional), type (nothing, yoyo or loop, optional), fps (optional));
//
// DESCRIPTION
// Will play an animation.
//
// EXAMPLE
// ss.play(); 
//
// NOTES
// Without a from and to frame the animation will play all the frames
//-----------------------
// ss.playto(frame,fps (optional))
//
// DESCRIPTION
// It plays to a frame from the current frame (so backwards of forwards).
//-----------------------
// stop()
//
// DESCRIPTION
// Well, it stops the animation....
//-----------------------
// gotoFrame(frame)
//
// DESCRIPTION
// Goes to frame and stops a playing animation
//-----------------------
//
//--CALLBACK FUNCTION--
//
//The callback function will receive 1 argument. For now it can be 'loaded' or 'complete' (in an animation is complete).
//
// EXAMPLE
// function callbackfunction(action) {
// 	if (action == 'loaded') {
//		ss.play();
//	}
//	if (action == 'complete') {
//		ss.play();	
//	}
// }











function SpriteSheet(atlasfile,imagefile,container,callback,scale,type,fps) {
	this.atlas = atlasfile;
	this.image = imagefile;
	this.frames = new Object();
	this.img = new Image();
	this.imgmask = new Image();
	this.imgloaded = false;
	this.atlasloaded = false;
	this.maskloaded = false;
	this.container = container;
	this.mover = '';
	this.currentframe = 0;
	this.startframe = 0;
	this.targetframe = 0;
	this.dir = 0;
	this.originalfps = fps || 30;
	this.interval = null;
	this.callb = callback;
	this.height = 0;
	this.width = 0;
	this.scale = scale || 1;
	this.type =  type || 'canvas';
	this.imagetype = 'png';
	this.loaded = false;
	this.animationtype = '';
	this.debug = false;
	this.method = '';
	this.innited = false;



	//PUBLIC FUNCTIONS

	this.stop = function() {
		this.stopanimation('stop, stop called');
	}

	this.gotoFrame = function(nr) {
		this.stopanimation('stop, single frame');
		nr = nr - 1;
		this.currentframe = nr;
		this.loadFrame(nr);
	}

	this.playTo = function(frame,fps) {
		this.animationtype = 'playto';
		frame = frame - 1;
		this.db('playto '+ frame + ' - '+this.currentframe);
		if (frame != this.currentframe) {
			this.stopanimation('stop, frame != currentframe');
			if (fps) {
				this.fps = fps;
			}
			else {
				this.fps = this.originalfps;
			}
			if (frame < this.currentframe) {
				this.dir = 1;
				this.targetframe = frame;
			}
			if (frame > this.currentframe) {
				this.dir = 0;
				this.targetframe = frame;
			}
			var self = this;
			self.timer = new BetterTimer(this.fps,function(){self.next()});
		}
	}

	this.play = function(from,to,type,fps) {
		//this.db('play '+from+', '+to);
		this.animationtype = type || '';
		if (fps) {
			this.fps = fps;
		}
		else {
			this.fps = this.originalfps;
		}
		this.db('fps '+ this.fps);

		this.stopanimation('stop, play function called');
		if (from == null) {
			from = 0;
		}
		else {
			from = from - 1;
		}
		
		if (to == null) {
			to = this.frames.length-1;
		}
		else {
			to = to - 1;
		}

		if (from < to) {
			this.dir = 0;
		}
		else {
			this.dir = 1;
		}



		
		this.startframe = from;
		this.currentframe = from;
		this.targetframe = to;
		this.db('fromto, '+from+", "+to+', '+this.currentframe+','+this.dir);
		var self = this;
		self.timer = new BetterTimer(this.fps,function(frame){self.next(frame)});
	}
	
	//\PUBLIC FUNCTIONS


	this.imageloaded = function(type,image) {

		if (type == 'image') {
			this.img = image;
			this.imgloaded = true;
			this.checkLoaded();
		}
		if (type == 'mask') {
			this.imgmask = image;
			this.maskloaded = true;
			this.checkLoaded();
		}
	}

	this.checkLoaded = function() {
		var self = this;
		window.setTimeout(function(){self.checkLoaded2()}, 100);
	}

	this.checkLoaded2 = function() {
		if (this.imgloaded == true && this.atlasloaded == true && ((this.maskloaded == true || this.type == 'html') || this.imagetype == 'png') && this.innited == false)	{
			this.innited = true;
			if (this.type == 'html') {
				this.mover = $("<div class='dynamicimagemover' style='position:relative;overflow:none;'></div>");
				$(this.container).append(this.mover);
				$(this.mover).css('background-image', 'url(' + this.img.src + ')');
				$(this.mover).css('-webkit-background-size',(this.width*this.scale)+"px "+(this.height*this.scale)+"px");
			}
			else if (this.type == 'canvas') {
				this.canvashtml = "<canvas id='sscanvas' style='position:relative;pointer-events:none;'></canvas>";
				$(this.container).append(this.canvashtml);
				this.canvas = $(this.container).find("#sscanvas")[0];
				this.context = this.canvas.getContext('2d');
				this.canvasimage = new Image();
				this.canvasimage.src = this.img.src;

			}

			this.db("first frame: 1, last frame: "+this.frames.length);
			this.loaded = true;
			this.callb("loaded");
		}
	} 

	this.db = function(txt) {
		if (this.debug && console != undefined) {
			console.log(txt);
		}
	}

	this.next = function() {

		var res = this.loadFrame(this.currentframe);
		var nf = this.currentframe;

		if (this.dir == 0) {
			nf++;
		}
		else if (this.dir == 1) {
			nf--;
		}
		
		if (this.frames[nf] && res == true) {
			this.currentframe = nf;
		}
	}

	this.stopanimation = function(msg) {
		if (this.timer) {
			this.db("stop animation "+(this.currentframe+1) + ': '+ msg);
			this.timer.stop();
			this.timer = null;
		}
	}

	this.loadFrame = function(nr) {
		if (this.loaded == true) {
			var cf = this.frames[nr];
			if (cf == undefined) {
				this.stopanimation('stop, frame '+(nr+1) + ' does not exist');
			}
			if (this.type == 'html') {
				$(this.container).css("width",(cf.sourceSize.w*this.scale) + 'px');
				$(this.container).css("height",(cf.sourceSize.h*this.scale) + 'px');
				$(this.mover).css("width",(cf.frame.w*this.scale) + 'px');
				$(this.mover).css("height",(cf.frame.h*this.scale) + 'px');
				$(this.mover).css("left",(cf.spriteSourceSize.x*this.scale) + 'px');
				$(this.mover).css("top",(cf.spriteSourceSize.y*this.scale) + 'px');
				$(this.mover).css('backgroundPosition', (0-(cf.frame.x*this.scale))+'px '+(0-(cf.frame.y*this.scale))+'px');
			}
			else if (this.type == 'canvas') {
				$(this.canvas).attr("width",(cf.sourceSize.w*this.scale) + 'px');
				$(this.canvas).attr("height",(cf.sourceSize.h*this.scale) + 'px');
		
				this.context.drawImage(this.canvasimage, Math.round((cf.frame.x)), Math.round((cf.frame.y)),Math.round(cf.frame.w),Math.round(cf.frame.h),Math.round(cf.spriteSourceSize.x*this.scale),Math.round(cf.spriteSourceSize.y*this.scale),Math.round(cf.frame.w*this.scale),Math.round(cf.frame.h*this.scale));
				this.context.globalCompositeOperation = 'xor';
				
				if (this.imagetype == 'jpg') {
					this.context.drawImage(this.imgmask, Math.round((cf.frame.x)), Math.round((cf.frame.y)),Math.round(cf.frame.w),Math.round(cf.frame.h),Math.round(cf.spriteSourceSize.x*this.scale),Math.round(cf.spriteSourceSize.y*this.scale),Math.round(cf.frame.w*this.scale),Math.round(cf.frame.h*this.scale));
				}
			}
			
			var ret = true;
			if (this.animationtype == '')
 			{
 				if ((nr) == this.targetframe) {
 					this.stopanimation('stop, play target reached');
					this.callb("complete");
					ret = false;
 				}
 			}

 			else if (this.animationtype == 'loop') {
 				if ((nr) == this.targetframe) {
 					this.play(this.startframe+1,this.targetframe+1,this.animationtype);
 					this.callb("complete");
 					ret = false;
 				}
 			}

 			else if (this.animationtype == 'playto') {
 				if ((nr) == this.targetframe) {
 					this.stopanimation('stop, playto  target reached');
					this.callb("complete");
					ret =  false;
 				}
 			}

 			else if (this.animationtype == 'yoyo') {
 				if ((nr) == this.targetframe) {
 					this.play(this.targetframe+1,this.startframe+1,this.animationtype);
					this.callb("complete");
					ret =  false;
 				}
 			}
 			
 			return ret;
		}
		else {
			this.stopanimation('stop, spritesheet not loaded');
		}
	}


	this.loadImage = function(callbackname,image) {
		 var self = this;
		 var tempimage = new Image();

		  $(tempimage).attr({
		        src: image
		  });

		  if (tempimage.complete || tempimage.readyState === 4) {

		      self.imageloaded(callbackname,tempimage);

		  } else {
		  	$(tempimage).load(function (response, status, xhr) {
		    	if (status == 'error') {
		               alert('image could not be loaded '+ image);

		            } else {
						self.imageloaded(callbackname,tempimage);	               
		            }
		        });
		    }
	}

	
	this.loadBoth = function() {
		var self = this;
		$.ajax({
			  dataType: "json",
			  url: this.atlas,
			  type: "get",
			  success: function(e) {
			  		self.atlasloaded = true;
			  		self.frames = e.frames;
			  		self.width = e.meta.size.w;
			  		self.height = e.meta.size.h;
			  		self.checkLoaded();
			  },

			  fail: function(e) {
			    var responseCode = e.status;
				    if(responseCode = 412) {
				    	alert('error loading!');
				    }
			   }
		});

		this.loadImage("image",this.image); 

		if (this.imagetype == 'jpg' && this.type == 'canvas') {
			this.loadImage('mask',this.image.replace(".jpg","-mask.png"));
		}



	}

	this.checkType = function() {
		var t = this.image.split('.').pop().toLowerCase();
		if (t == 'jpg' || t == 'jpeg') {
			this.imagetype = 'jpg';
		}
		else {
			this.imagetype = 'png';
		}
	}

	this.build = function() {
		this.checkType();
		this.loadBoth();
	}

	this.build();
	return this;

}

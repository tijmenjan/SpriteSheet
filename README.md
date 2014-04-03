SpriteSheet 1.0  
Tijmen Mulder - Mulder She Wrote  
Questions? Suggestions?  
Tijmen@muldershewrote.com  

Live example
==============
http://www.muldershewrote.nl/examples/tutorial-spritesheet

Description
==============
This simple lib will allow you to play a spritesheet created with TexturePacker.
It's created for usage in a website, not a canvas game. There are other libs for that purpose.

In TexturePacker, select JSON (Array) as output, and disable 'Allow rotation'.

You can use the TexturePacker png directly, or create jpeg and png mask.
When using a jpeg file, it will look for filename-mask.png. Look at the attached assets if it's not clear.

Usage
==============
name = new SpriteSheet(atlas file, image file, container css selector, callback function,scale (optional), type (html or canvas, optional), fps (optional));

EXAMPLE

	ss = new SpriteSheet("animation.json", "animation.png", "#sscontainer", callbackfunction,1, 'canvas', 30);



Methods
==============
**play(from frame (optional), to frame (optional), type (nothing, yoyo or loop, optional), fps (optional));**

*DESCRIPTION*  
Will play an animation.

*EXAMPLE*  
ss.play(); 

*NOTES*   
Without a from and to frame the animation will play all the frames

**ss.playto(frame,fps (optional))**  

*DESCRIPTION*  
It plays to a frame from the current frame (so backwards of forwards).


**stop()**  

*DESCRIPTION*  
Well, it stops the animation....

**gotoFrame(frame)**  

*DESCRIPTION*  
Goes to frame and stops a playing animation

CALLBACK FUNCTION
==============

The callback function will receive 1 argument. For now it can be 'loaded' or 'complete' (in an animation is complete).

**EXAMPLE**  

	function callbackfunction(action) {
		if (action == 'loaded') {
			ss.play();
		}
		if (action == 'complete') {
			ss.play();	
		}
	}
/**
The Help Text Viewer provides the possibility to enhance your forms by adding help buttons.
These buttons display a help message when clicked or hovered. 

Optionally, the buttons can be hidden by default, with a global switch (the Help Text Trigger) to show or hide them. 
*/
define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "mxui/dom",
    "dojo/dom-style",
    "dojo/dom-geometry",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/html",
    "dojo/_base/event",
    "dojo/dom-geometry",
    "dojo/topic"

], function (declare, _WidgetBase, dom, domStyle, domGeometry, dojoArray, lang, html, event, domGeom, topic) {
    "use strict";

    return declare("HelpText.widget.HelpText", [_WidgetBase], {

	inputargs: {
		text : '',
		startvisible : false,
		showonhover : true,
		width : 300,
		height : 300,
		closeClick : false
	},
	
	//IMPLEMENTATION
	domNode: null,
	topic : "CustomWidget/HelpText",
	imgNode : null,
	handle : null,
	helpNode : null,
	helpvisible: false,
	windowEvt : null,
	
  postCreate : function(){
		logger.debug(this.id + ".postCreate");

		//img node
		this.imgNode = dom.create("div", {
			'class' : 'HelpTextButton'
		});
		this.domNode.appendChild(this.imgNode);
		this.connect(this.imgNode, 'onclick', lang.hitch(this, this.toggleHelp, true));
		if (this.showonhover) {
			this.connect(this.imgNode, 'onmouseenter', lang.hitch(this, this.showHelp, true, false));
			this.connect(this.imgNode, 'onmouseleave', lang.hitch(this, this.showHelp, false, false));
		}
		
		//help node
		this.createHelp();
		
		this.stateChange(this.startvisible);
		this.handle = dojo.subscribe(this.topic, this, this.stateChange);
		
		this.actLoaded();
	},

	stateChange : function(newstate) {
		if (newstate)
		domStyle.set(this.imgNode, "display", "block")
		else if (!this.startvisible) {
			this.helpvisible = false;
			domStyle.set(this.imgNode, "display", "none");
			this.showHelp(false);
		}
	},
	
	createHelp : function () {
		this.helpNode = dom.create('div',{'class' : 'HelpTextBox'});
		var input = this.text.replace(/\n/g, '<br />');
		html.set(this.helpNode, input);
		domStyle.set(this.helpNode, {
			'width' : this.width + 'px',
			'maxHeight' : this.height + 'px'
		});
		this.connect(this.helpNode, 'onclick', lang.hitch(this, this.toggleHelp, true));
		document.body.appendChild(this.helpNode);
	},

	toggleHelp : function(clicked, e) {
		this.helpvisible = !this.helpvisible;
		this.showHelp(this.helpvisible, clicked);
		event.stop(e);
	},
	
	windowClick : function () {
		this.disconnect(this.windowEvt);
		this.windowEvt = null;
		this.toggleHelp(true);
	},
	
	showHelp : function(show, clicked) {
		if (show || this.helpvisible) {
			var coords = domGeom.position(this.imgNode, true);
			if (this.closeClick && clicked)
				this.windowEvt = this.connect(document.body, 'onclick', this.windowClick);
			
				domStyle.set(this.helpNode, {
				'display' : 'block',
				'top' : (coords.y + 30)+'px',
				'left': (window.innerWidth < coords.x + 30 + this.width ? coords.x - this.height - 30 : coords.x + 30)+'px'
			});
		}
		else
		domStyle.set(this.helpNode, 'display', 'none');
	},
	
	suspended : function() {
		this.disconnect(this.windowEvt);
		this.windowEvt = null;
		this.showHelp(false);
	},
	
	uninitialize : function() {
		try {
			this.disconnect(this.windowEvt);
			this.windowEvt = null;
			logger.debug(this.id + ".uninitialize");
			if (this.helpNode != null)
					document.body.removeChild(this.helpNode);
			if (this.handle != null)
			this.handle.remove();
		}
		catch(e) {
			logger.warn("error on helptextviewer unload: " + e);
		}
	}
	});
	});

require([ "HelpText/widget/HelpText" ]);

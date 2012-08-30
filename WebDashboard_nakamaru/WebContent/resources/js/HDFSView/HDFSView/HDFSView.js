/*******************************************************************************
 * WGP 0.2 - Web Graphical Platform (https://sourceforge.net/projects/wgp/)
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2012 Acroquest Technology Co.,Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 ******************************************************************************/
HDFSView = wgp.AbstractView.extend({
    initialize:function(argument){
    	
    	$("#" + this.$el.attr("id")).css("background-color","#222222");
    	
    	this.viewType = wgp.constants.VIEW_TYPE.VIEW;
    	this.collection = new MapElementList();
		if(argument["collection"]){
	    	this.collection = argument["collection"];
		}

    	this.width = argument["width"];
    	this.height = argument["height"];
    	this.maxId = 0;
    	
        var realTag = $("#" + this.$el.attr("id"));
        if (this.width == null) {
            this.width = realTag.width();
        }
        if (this.height == null) {
            this.height = realTag.height();
        }

        this.viewCollection = {};
		this.registerCollectionEvent();
		this.render();
		
		var mainCircle = {
				width : 300,
				height : 300,
				innerRate : 0.2
		}
		
		var mainCircleAdd = {
			    type:wgp.constants.CHANGE_TYPE.ADD,
			    state:wgp.constants.STATE.NORMAL,
			    objectName:"MapStateElementViewWithRemovingMethod",
			    objectId : 1,
			    pointX : viewArea2.width / 2 - mainCircle.width / 2,
			    pointY : viewArea2.height / 2 - mainCircle.height / 2,
			    width : mainCircle.width,
			    height : mainCircle.width,
			    color : "#222222",
			    zIndex : 0
		};

		var coreCircleAdd = {
			    type:wgp.constants.CHANGE_TYPE.ADD,
			    state:wgp.constants.STATE.NORMAL,
			    objectName:"MapStateElementViewWithRemovingMethod",
			    objectId : 1,
			    pointX : (viewArea2.width  - mainCircle.width * mainCircle.innerRate) / 2,
			    pointY : (viewArea2.height  - mainCircle.height * mainCircle.innerRate) / 2,
			    width : mainCircle.width * mainCircle.innerRate,
			    height : mainCircle.width * mainCircle.innerRate,
			    color : "#3aa6d0",
			    zIndex : 1
		};
		
		var mainCircleUpdate = {
			    type:wgp.constants.CHANGE_TYPE.UPDATE,
			    objectId : 1,
			    zIndex : 0
		};

		var countMainCircle = -1;
		var countDataNode = -1;
		var countBlockTransfer = -1;
		var countRack = -1;
		
		
		var mainCircleInterval = function(windowId){
			function innerFunction(){
				countMainCircle++;
				if(countMainCircle < 1){
					console.log('circle add'+countMainCircle);
					var addData = [{
					    windowId:windowId,
					    data:[mainCircleAdd, coreCircleAdd]
					}];
					appView.notifyEvent(addData);
				}else{
					/*
					console.log('change'+countMainCircle);
					var addData = [{
					    windowId:windowId,
					    data:[mainCircleUpdate]
					}];
					appView.notifyEvent(addData);
					*/
				}
			};
			return innerFunction;
		};
		
		
		////////////////////////////////////////////////////
		
		var dn = [];
		var numDataNode = 100;
		for(var i=0; i<numDataNode; i++){
			dn[i] = {
				    type:wgp.constants.CHANGE_TYPE.ADD,
				    state:wgp.constants.STATE.NORMAL,
				    objectName:"DataNodeRectangle",
				    objectId : i,
				    width : mainCircle.width * Math.PI /numDataNode,
				    height : Math.random() * 200,
				    max_height : 300,
				    angle : 360/numDataNode*i,
				    zIndex : 0,
				    centerX : viewArea2.width/2,
				    centerY : viewArea2.height/2,
				    radius : mainCircle.width/2
			};
		}

		var dn2 = [];
		for(var i=0; i<numDataNode; i++){
			dn2[i] = {
				    type:wgp.constants.CHANGE_TYPE.UPDATE,
				    state:wgp.constants.STATE.NORMAL,
				    objectName:"DataNodeRectangle",
				    objectId : i,
				    width : mainCircle.width * Math.PI /numDataNode,
				    height : Math.random() * 200,
				    angle : 360/numDataNode*i,
				    zIndex : 0,
				    centerX : viewArea2.width/2,
				    centerY : viewArea2.height/2,
				    radius : mainCircle.width/2
			};
		}

		
		var dataNodeInterval = function(windowId){
			function innerFunction(){
				countDataNode++;
				if(countDataNode < 1){
					console.log('dn add'+countDataNode);
					var addData = [{
					    windowId:windowId,
					    data:dn
					}];
					appView.notifyEvent(addData);
				}else{
					console.log('dn change '+countDataNode);
					var addData = [{
					    windowId:windowId,
					    data:dn2
					}];
					appView.notifyEvent(addData);					
				}
			};
			return innerFunction;
		};

		////////////////////////////////////////////////////

		var bt = [];
		var numTransfer = 100;
		for(var i=0; i<numTransfer; i++){
			bt[i] = {
				    type:wgp.constants.CHANGE_TYPE.ADD,
				    state:wgp.constants.STATE.NORMAL,
				    objectName:"BlockTransferRectangle",
				    objectId : i,
				    centerX : viewArea2.width/2,
				    centerY : viewArea2.height/2,
				    width : 3,
				    angle : 360/numDataNode*i,
				    radius : mainCircle.width/2,
				    zIndex : 1,
				    color : "rgba(255,255,255,"+Math.random()+")"
			};
		}
		var blockTransferInterval = function(windowId){
			function innerFunction(){
				countBlockTransfer++;
				if(countBlockTransfer < 1){
					console.log('bt add'+countBlockTransfer);
					var addData = [{
					    windowId:windowId,
					    data:bt
					}];
					appView.notifyEvent(addData);
				}
			};
			return innerFunction;
		};
		
		////////////////////////////////////////////////////

		function getColor(i){
			if(i%2 == 0){
				return "#ffa33f";
			}else{
				return "#bf8c53";				
			}
		}
		
		var rk = [];
		var numRack = 10;
		for(var i=0; i<numRack; i++){
			rk[i] = {
				    type:wgp.constants.CHANGE_TYPE.ADD,
				    state:wgp.constants.STATE.NORMAL,
				    objectName:"RackCurve",
				    objectId : i,
				    centerX : viewArea2.width/2,
				    centerY : viewArea2.height/2,
				    from : 360/numDataNode * i * 10 - 180/numDataNode,
				    to : 360/numDataNode * (i+1) * 10 - 180/numDataNode,
				    radius : mainCircle.width/2*0.98,
				    zIndex : 2,
				    color : getColor(i)
			};
		}
		
		console.log(rk);
		
		var rackInterval = function(windowId){
			function innerFunction(){
				countRack++;
				if(countRack < 1){
					console.log('rk add'+countRack);
					var addData = [{
					    windowId:windowId,
					    data:rk
					}];
					appView.notifyEvent(addData);
				}
			};
			return innerFunction;
		};

		
		setInterval(mainCircleInterval("contents_area_tab_0"),1000);
		setInterval(dataNodeInterval("contents_area_tab_0"),1000);
		setInterval(blockTransferInterval("contents_area_tab_0"),1000);
		setInterval(rackInterval("contents_area_tab_0"),1000);

    },
    
    
    
    
    
    
    render:function(){
        this.paper =  new Raphael(document.getElementById(this.$el.attr("id")), this.width, this.height);    	
    },
    onAdd:function(mapElement){
    	var id = mapElement.id;
		if(id == null){
			id = this.maxId;
			this.maxId++;

			var idAttributeName = mapElement.idAttribute;
			mapElement.set({idAttributeName : id}, {silent: true});
		}else{
			if(id > this.maxId){
				this.maxId = id + 1;
			}
		}

		// if same id exists, process as change event
		if(this.viewCollection[id]){
			this.viewCollection[id].destory();

		}
		var objectName = "wgp." + mapElement.get("objectName");
    	var view = eval("new " + objectName + "({model:mapElement, paper:this.paper})");
    	this.viewCollection[id] = view;

    },
	onChange:function(mapElement){
		this.viewCollection[mapElement.id].update(mapElement);
	},
	onRemove:function(mapElement){
		var objectId = mapElement.get("objectId");
		this.viewCollection[objectId].remove(mapElement);
		delete this.viewCollection[objectId];
	}
});

_.bindAll(wgp.MapView);
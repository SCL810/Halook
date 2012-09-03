var BubbleChartView = wgp.AbstractView.extend({
	initialize : function() {
		//jQuery('#target').append(jQuery('<option value="1">test1</option>'));
		this.viewType = wgp.constants.VIEW_TYPE.VIEW;
		this.collection = new BubbleModelCollection();
		// this.attributes = {};
		this.registerCollectionEvent();

		this.maxId = 0;

		var realTag = $("#" + this.$el.attr("id"));
		if (this.width == null) {
			this.width = realTag.width();
		}
		if (this.height == null) {
			this.height = realTag.height();
		}
		/*
		 * this.paper = new
		 * Raphael(document.getElementById(this.$el.attr("id")), this.width,
		 * this.height);
		 */
		//<select id ="selector"><option>job</option><option>1</option></select>
		$("#" + this.$el.attr("id")).append('<div id="leftTop"><h3>Job ID:1</h3></div><div id="rightTop"></div><div id="graphSpace"></div>');
		$("#leftTop").css({float:"left", width:200, height:50/*, "background-color":"red"*/});
		$("#rightTop").css({float:"right", width:450, height:50/*, "background-color":"green"*/});
		$("#graphSpace").css({clear:"both", width:900, height:10});
		
		
		$("#rightTop").append('<input type="checkbox" value="MapSuccess" checked>MapSuccess');
		$("#rightTop").append('<input type="checkbox" value="MapFailed" checked>MapFailed');
		$("#rightTop").append('<input type="checkbox" value="ReduceSuccess" checked>ReduceSuccess');
		$("#rightTop").append('<input type="checkbox" value="ReduceFailed" checked>ReduceFailed');
		$("#" + this.$el.attr("id")).append('<div id="Bubble"></div>');
		$("#Bubble").css({marginTop:20, marginLeft:70});
		$("#rightTop").css({marginTop:10, marginLeft:10});
		$("#selector").css({marginTop:10, marginLeft:10});

	    new MyView();
		
		this.graph = new BubbleElementView({
			id : "Bubble",
				width : 700,
				height : 480,
			attributes : {
				xlabel : "StartTime",
				ylabel : "ProcessTime",
				labels : ["StartTime","MapSuccess", "MapFailed","ReduceSuccess","ReduceFailed","Null"],
				strokeWidth : 0,
				drawPoints : true,
				pointSize : 3,
				highlightCircleSize: 7,
				//colors : ["#00FF00","#FF0000","#00FF00","#FF0000"]
				colors : ["#00FF7F","#FF0000","#008000","#4B0082","#FFFFFF"]
				//drawPointCallback : new Dygraph(Dygraph.Circles.HEXAGON)
			}
			//colors : ["#FF0000","#00FF00","#123456","#383838"]
		});
		
		console.log('called bubbleChartView');
	},
	render : function() {
		console.log('call render');
	},
	onAdd : function(element) {
		// ここにgetする処理を書く
		this.graph.onAdd(element);
		console.log('call onAdd');
	},
	onChange : function(element) {
		console.log('called changeModel');
	},
	onRemove : function(element) {
		console.log('called removeModel');
	}
});
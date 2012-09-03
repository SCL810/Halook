
wgp.BubbleChartAttribute = [
        "colors",
        "labels",
        "valueRange",
        "xlabel",
        "ylabel",
        "strokeWidth",
        "legend",
        "labelsDiv",
        "width",
        "height",
        "drawPoints",
		"pointSize",
		"highlightCircleSize",
];

var flag = [true,true,true,true];
//MapSuccess,MapFailed,ReduceSuccess,ReduceFailedの順で表示用のフラグ
var Sort_array = ["Map","Reduce"];//タスクの種類
var Status_array = ["Success","Failed"];//ステータスの種類
var taskNumber = 655;//タスクの数

BubbleElementView = wgp.DygraphElementView.extend({
	
	initialize:function(argument){
		this.viewType = wgp.constants.VIEW_TYPE.VIEW;
		this.collection = new BubbleModelCollection();
		this.width = argument["width"];
		this.height = argument["height"];
		
		//注意　Start順に渡すこと
		var dataArray = [];
		var SrandTime = 0;
		for(i = 0 ; i < taskNumber ; i++){
			SrandTime += parseInt(Math.random()*100);
			var data = {
				TaskAttemptID : i,
				StartTime : SrandTime,
				FinishTime : SrandTime + parseInt(Math.random()*1000),
				Status : Status_array[parseInt(Math.random()*2)],
				Sort : Sort_array[parseInt(Math.random()*2)],
				HostName : null
			};
			if(i == 0){
				var nullData =　{
					TaskAttemptID : null,
					StartTime : SrandTime-300,
					FinishTime : null,
					Status : null,
					Sort : null,
					HostName : null,
				}
				dataArray.push(nullData);
			}
			dataArray.push(data);
			if(i == taskNumber-1){
				var nullData =　{
					TaskAttemptID : null,
					StartTime : SrandTime+300,
					FinishTime : null,
					Status : null,
					Sort : null,
					HostName : null,
				}
				dataArray.push(nullData);
			}
		}
		
		this.graphId = 0;

		var realTag = $("#" + this.$el.attr("id"));
        if (this.width == null) {
            this.width = realTag.width();
        }else{
        	realTag.width(this.width);
        }
        if (this.height == null) {
            this.height = realTag.height();
        }else{
        	realTag.height(this.height);
        }

        this.entity = null;
        if(dataArray && dataArray.length > 0){
        	this.addCollection(dataArray);
            this.render();
        }
        this.registerCollectionEvent();
	},
	render:function(){
		//データの取得
		var data = this.getData();
		//グラフの生成
		this.entity = new Dygraph(
			document.getElementById(this.$el.attr("id")),
			data,this.getAttributes(wgp.BubbleChartAttribute)
		);
		//アップデートオプション（形表示用、要修正)
		this.entity.updateOptions({
			ReduceSuccess:{
				//pointSize : 7,
	            drawPointCallback : mouthlessFace(),
	            drawHighlightPointCallback : mouthlessFace()
			},
			ReduceFailed:{
				//pointSize : 5
	            drawPointCallback : mouthlessFace(),
	            drawHighlightPointCallback : mouthlessFace()
			},
			Null:{//端の点のダミー定義
				pointSize : 0,
				highlightCircleSize : 0
			}
		});
		this.entity.resize(this.width, this.height);
	},
	onAdd:function(graphModel){
		var dataArray = [];
		
		_.each(this.collection.models, function(model,index){
			// 必要なデータだけとってきて表示する
			var modelData = model.get("data");
			var array = [];
			var ProcessTime = modelData.FinishTime-modelData.StartTime;	
			if(modelData.TaskAttemptID == null){
				ProcessTime = null;
			}
			//array.push(modelData.StartTime);
			if(modelData.Status == "Success"){
				if(modelData.Sort == "Map" && flag[0]){
					array.push(modelData.StartTime,ProcessTime,null,null,null,null);
				}else if(modelData.Sort == "Reduce" && flag[1]){
					array.push(modelData.StartTime,null,ProcessTime,null,null,null);
				}
			}else if(modelData.Status == "Failed"){				
				if(modelData.Sort == "Map" && flag[2]){
					array.push(modelData.StartTime,null,null,ProcessTime,null,null);
				}else if(modelData.Sort == "Reduce" && flag[3]){
					array.push(modelData.StartTime,null,null,null,ProcessTime,null);
				}
			}else{
				array.push(modelData.StartTime,null,null,null,null,ProcessTime);
			}
			if(array.length != 0)dataArray.push(array);
		});
		if(this.entity == null){
			this.render();
		}else{
			this.entity.updateOptions({file: dataArray,
			ReduceSuccess:{
				//pointSize : 7,
	            drawPointCallback : mouthlessFace(),
	            drawHighlightPointCallback : mouthlessFace()
			},
			ReduceFailed:{
				//pointSize : 5
	            drawPointCallback : mouthlessFace(),
	            drawHighlightPointCallback : mouthlessFace()
			},
			Null:{//端の点のダミー定義
				pointSize : 0,
				highlightCircleSize : 0
			}});
		}
	},
	addCollection:function(dataArray){
		if(dataArray != null){
			var instance = this;
			_.each(dataArray, function(data, index){
				var model = new instance.collection.model({dataId: instance.maxId, data:data});
				instance.collection.add(model, wgp.constants.BACKBONE_EVENT.SILENT);
				instance.maxId++;
			});
		}
	},
	getData:function(){
		var data = [];
		_.each(this.collection.models, function(model, index){
			var modelData = model.get("data");
			var array = [];
			var ProcessTime = modelData.FinishTime-modelData.StartTime;
			if(modelData.TaskAttemptID == null){
				ProcessTime = null;
			}
			//array.push(modelData.StartTime);
			if(modelData.Status == "Success"){
				if(modelData.Sort == "Map" && flag[0]){
					array.push(modelData.StartTime,ProcessTime,null,null,null,null);
				}else if(modelData.Sort == "Reduce" && flag[1]){
					array.push(modelData.StartTime,null,ProcessTime,null,null,null);
				}
			}else if(modelData.Status == "Failed"){				
				if(modelData.Sort == "Map" && flag[2]){
					array.push(modelData.StartTime,null,null,ProcessTime,null,null);
				}else if(modelData.Sort == "Reduce" && flag[3]){
					array.push(modelData.StartTime,null,null,null,ProcessTime,null);
				}
			}else{
				array.push(modelData.StartTime,null,null,null,null,ProcessTime);
			}
			if(array.length != 0)data.push(array);
		});
		return data;
	},
	getRegisterId : function(){
		return this.graphId;
	}
});

var mouthlessFace = function(g, seriesName, canvasContext, cx, cy, color, pointSize) {
	//canvas = document.getElementById(this.$el.attr("id"));
	//ctx = canvas_.getContext("2d");
	var canvasList = $("canvas");
	var canvas = canvasList[0];
	canvasContext = canvas;
	//color = ["#000000"];
	//pointSize = 7;
	//cx = 200;
	//cy = 400;
	if ( ! canvas || ! canvas.getContext ) { return false; }
	ctx = canvas.getContext("2d");
	/* 三角形を描く */
	ctx.fillStyle = "#000000";
	ctx.beginPath();
	ctx.moveTo(250, 10);
	ctx.lineTo(300, 90);
	ctx.lineTo(210, 90);
	ctx.closePath();
	/* 三角形を塗りつぶす */
	ctx.fill();
}


var MyView = Backbone.View.extend({
    el: "#rightTop",
    events: {
    	"change input[value='MapSuccess']": "_checkMapSuccess",
    	"change input[value='MapFailed']": "_checkMapFailed",
    	"change input[value='ReduceSuccess']": "_checkReduceSuccess",
    	"change input[value='ReduceFailed']": "_checkReduceFailed"
    },
    _checkMapSuccess: function(e) {
    	if(flag[0]){
    		flag[0] = false;
    	}else{
    		flag[0] = true;
    	}
    },
    _checkMapFailed: function(e) {
    	if(flag[1]){
    		flag[1] = false;
    	}else{
    		flag[1] = true;
    	}
    },
    _checkReduceSuccess: function(e) {
    	if(flag[2]){
    		flag[2] = false;
    	}else{
    		flag[2] = true;
    	}
    },
    _checkReduceFailed: function(e) {
    	if(flag[3]){
    		flag[3] = false;
    	}else{
    		flag[3] = true;
    	}
    },
});
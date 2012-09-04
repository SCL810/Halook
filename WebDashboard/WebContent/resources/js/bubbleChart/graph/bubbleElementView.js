
//グラフ表示用プロパティ
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
		"highlightCircleSize"
        /*"drawPointCallback",
        "drawHighlightPointCallback"*/
];

//MapSuccess,MapFailed,ReduceSuccess,ReduceFailedの順で表示用のフラグ
var MAP_SUCCESS = 0;
var MAP_FAILED = 1;
var REDUCE_SUCCESS = 2;
var REDUCE_FAILED = 3;
var sortFlag = [true,true,true,true];
var Sort_array = ["Map","Reduce"];//タスクの種類
var Status_array = ["Success","Failed"];//ステータスの種類
var taskNumber = 655;//タスクの数
var divTime = 6000;//1:millies,1000:second,6000:minutes,360000:hours

BubbleElementView = wgp.DygraphElementView.extend({
	
	initialize:function(argument){
		
		this.viewType = wgp.constants.VIEW_TYPE.VIEW;//ビュータイプ
		this.collection = new BubbleModelCollection();//コレクションリスト
        this.registerCollectionEvent();//コレクションの登録
		this.width = argument["width"];//ウィンドウ幅
		this.height = argument["height"];//ウィンドウの高さ
		this.graphId = 0;//グラフID
		new graphListenerView();//グラフのチェックボックスのリスナ用ビュー
		//new buttonView();
		
		//データの登録
		//注意　Start順に渡すこと
		var dataArray = [];
		dataArray = randomData();//ランダムデータ関数
		
		//何の処理か不明
		var realTag = $("#" + this.$el.attr("id"));
        if (this.width == null) {
            this.width = realTag.width();
        }
        if (this.height == null) {
            this.height = realTag.height();
        }
        //コレクションにデータを格納してrenderを呼ぶ
        this.entity = null;
        if(dataArray && dataArray.length > 0){
        	this.addCollection(dataArray);
            this.render();
        }
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
		//this.updateGraphOptions();
		
		//描画のリサイズ
		this.entity.resize(this.width, this.height);
	},
	onAdd:function(graphModel){
		//配列データを格納する変数
		var dataArray = [];
		var instance = this;
		//グラフ表示に必要なデータの取得
		_.each(this.collection.models, function(model,index){
			var modelData = model.get("data");
			var array = instance._sortingData(modelData);
			if(array.length != 0)dataArray.push(array);
		});

		if(this.entity == null){//要素があれば描画する
			this.render();
		}else{//無ければ配列をアップデート
			this.entity.updateOptions({file: dataArray});
		}

		//アップデートオプション（形表示用、要修正)
		this.updateGraphOptions();
	},
	
	//コレクションの追加処理
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
	
	//データを取得する処理
	getData:function(){
		var data = [];
		var instance = this;
		_.each(this.collection.models, function(model, index){
			var modelData = model.get("data");
			var array = instance._sortingData(modelData);		
			if(array.length != 0)data.push(array);
		});
		return data;
	},
	//IDを登録する処理
	getRegisterId : function(){
		return this.graphId;
	},
	//系列の表示を変更する処理
	updateGraphOptions : function(){
		var instance = this;
		this.entity.updateOptions({
			ReduceSuccess:{
				//pointSize : 7,
	            drawPointCallback : instance._mouthlessFace(),
	            drawHighlightPointCallback : instance._mouthlessFace()
			},
			ReduceFailed:{
				//pointSize : 5
	            drawPointCallback : instance._mouthlessFace(),
	            drawHighlightPointCallback : instance._mouthlessFace()
			},
			Null:{//端の点のダミー定義
				pointSize : 0,
				highlightCircleSize : 0
			}
		});
	},
	//データの種類、成功別に分類し、グラフ表示用の配列に加工する関数
	_sortingData : function(modelData){
		var array = [];
		var ProcessTime = (modelData.FinishTime-modelData.StartTime)/divTime;//秒単位
		if(modelData.TaskAttemptID == null){
			ProcessTime = null;
		}
		if(modelData.Status == "Success"){
			if(modelData.Sort == "Map" && sortFlag[MAP_SUCCESS]){
				array.push(modelData.StartTime,ProcessTime,null,null,null,null);
			}else if(modelData.Sort == "Reduce" && sortFlag[MAP_FAILED]){
				array.push(modelData.StartTime,null,ProcessTime,null,null,null);
			}
		}else if(modelData.Status == "Failed"){				
			if(modelData.Sort == "Map" && sortFlag[REDUCE_SUCCESS]){
				array.push(modelData.StartTime,null,null,ProcessTime,null,null);
			}else if(modelData.Sort == "Reduce" && sortFlag[REDUCE_FAILED]){
				array.push(modelData.StartTime,null,null,null,ProcessTime,null);
			}
		}else{
			array.push(modelData.StartTime,null,null,null,null,ProcessTime);
		}
		return array;
	},
	//三角を描く関数
	_mouthlessFace : function(g, seriesName, canvasContext, cx, cy, color, pointSize) {
		//canvas = document.getElementById(this.$el.attr("id"));
		//ctx = canvas_.getContext("2d");
		var canvasList = $("canvas");
		var canvas = canvasList[0];
		//canvasContext = canvas;
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
});

//ランダムデータ生成用関数
function randomData(){
	var dataArray = [];
	var SrandTime = 1346160591456;
	for(i = 0 ; i < taskNumber ; i++){
		SrandTime += parseInt(Math.random()*10000);
		var data = {
			TaskAttemptID : i,
			StartTime : SrandTime,//new Date(SrandTime),
			FinishTime : SrandTime + parseInt(Math.random()*10000000),
			Status : Status_array[parseInt(Math.random()*2)],
			Sort : Sort_array[parseInt(Math.random()*2)],
			HostName : null
		};
		if(i == 0){
			var nullData =　{
				TaskAttemptID : null,
				StartTime : SrandTime-300,//new Date(SrandTime-30000),
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
				StartTime : SrandTime+300,//new Date(SrandTime+30000),
				FinishTime : null,
				Status : null,
				Sort : null,
				HostName : null,
			}
			dataArray.push(nullData);
		}
	}
	return dataArray;
}

var graphListenerView = Backbone.View.extend({
    el: "#rightTop",//右上のチェックボックス群
    events: {
    	"change input": "_check"
    },
    _check : function(e){
    	var id = $(e.target).attr("id");
    	flagChange(id);
    }
});

//データ振り分け用のフラグチェック(0:MapSuccess,1:MapFailed,2:ReduceSuccess,3:ReduceFailed)
function flagChange(index){
  	if(sortFlag[index]){
  		sortFlag[index] = false;
  	}else{
  		sortFlag[index] = true;
  	}
}

//フラグが何かを見る
function flagCheck(index){
	if(sortFlag[index]){
		return "checked";
	}else{
		return "";
	}
}

/*var buttonView = Backbone.View.extend({
	el : "#leftTop",
	events:{
		"click": "_back"
	},
	_back : function(){
		//alert("");
	}
});
*/
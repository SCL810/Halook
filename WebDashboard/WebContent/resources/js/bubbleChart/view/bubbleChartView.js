var sampleDatasJob = {
	StartTime : 1346160591456,
	FinishTime : 1346160991946,
	SubmitTime : 1346160591446,
	JobID : "job_201208281744_0012",
	JobName : "PiEstimator",
	Status : "ERROR",
};

var BubbleChartView = wgp.AbstractView
		.extend({
			initialize : function() {

				this.viewType = wgp.constants.VIEW_TYPE.VIEW;// ビュータイプ
				this.collection = new BubbleModelCollection();// コレクションリスト
				this.registerCollectionEvent();// コレクションの登録
				this.maxId = 0;// ???

				// 何の処理か不明
				var realTag = $("#" + this.$el.attr("id"));
				if (this.width == null) {
					this.width = realTag.width();
				}
				if (this.height == null) {
					this.height = realTag.height();
				}

				this._callHtmlConstructor();

				// グラフビューの表示
				this.graph = new BubbleElementView({
					id : "Bubble",
					width : 700,
					height : 480,
					attributes : {
						xlabel : "StartTime [Date]",
						ylabel : "ProcessTime [Minutes]",
						labels : [ "StartTime", "MapSuccess", "MapFailed",
								"ReduceSuccess", "ReduceFailed", "Null" ],
						strokeWidth : 0,
						drawPoints : true,
						pointSize : 3,
						highlightCircleSize : 7,
						colors : [ "#00FF7F", "#FF0000", "#008000", "#4B0082",
								"#FFFFFF" ]
					}
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

			},
			// htmlタグの定義
			_callHtmlConstructor : function() {
				$("#" + this.$el.attr("id"))
						.css(
								{
									//background: "#000000"
									//background: "-moz-linear-gradient(45deg, rgba(248,255,232,1) 0%, rgba(227,245,171,1) 33%)"
									//background : "-moz-linear-gradient(top left, #EBEBEB 0%, #E3FFE4 100%)"
									//background : "-moz-linear-gradient(top, rgba(249,252,247,1) 0%, rgba(245,249,240,1) 100%)"
									//background: "-moz-linear-gradient(top, #eeeeee 0%, #eeeeee 100%)"
									//background : "-moz-radial-gradient(left top, ellipse farthest-corner, #DEEB8B 0%, #FFF0F3 100%)"
									//background : "-moz-radial-gradient(left top, ellipse farthest-corner, #BCEBD5 0%, #565959 100%)"
									//background : "#f5f5f5"
									//background : "-moz-radial-gradient(left top, ellipse farthest-corner, #636363 0%, #000000 100%)"
									//background : "-moz-linear-gradient(-45deg, #f0f9ff 0%, #cbebff 47%, #a1dbff 100%)"
								});

				$("#" + this.$el.attr("id"))
						.append(
								'<div id="jobInfoSpace" style="border:outset;border-color:#DDDDDD;border-width:4px;"></div>'
										+ '<div class="clearSpace"></div>');
				$("#jobInfoSpace")
						.css(
								{
									width : 900,
									height : 100,
									marginTop : 10,
									marginLeft : 10,
									float : "left",
									/* For Mozilla/Gecko (Firefox etc) */
									//background : " -moz-linear-gradient(top, #1e5799 0%, #2989d8 50%, #207cca 51%, #7db9e8 100%)",
									//background : "-moz-linear-gradient(45deg, rgba(181,189,200,1) 0%, rgba(130,140,149,1) 36%, rgba(40,52,59,1) 100%)",
									background: "-moz-linear-gradient(45deg, rgba(238,238,238,1) 0%, rgba(238,238,238,1) 100%)",
									/* For Internet Explorer 5.5 - 7 */
									filter : " progid:DXImageTransform.Microsoft.gradient(startColorstr=#FF0000FF, endColorstr=#FFFFFFFF)",
								// /* For Internet Explorer 8 */
								// -ms-filter:
								// "progid:DXImageTransform.Microsoft.gradient(startColorstr=#FF0000FF,
								// endColorstr=#FFFFFFFF)",
								});
				var sd = new Date();
				var fd = new Date();
				var subd = new Date();
				sd.setTime(sampleDatasJob.StartTime);
				fd.setTime(sampleDatasJob.FinishTime);
				subd.setTime(sampleDatasJob.SubmitTime);

				var jobColor;
				if (sampleDatasJob.Status == "SUCCESS") {
					jobColor = "#00FF00"
				} else if (sampleDatasJob.Status == "ERROR") {
					jobColor = "#FF0000"
				} else if (sampleDatasJob.Status == "RUNNING") {
					jobColor = "#0000FF"
				}

				$("#jobInfoSpace").html(
						"<p><font size='6'><b>"+ sampleDatasJob.JobID
								+ " : </b></font>" + "<font size='6' color='"
								+ jobColor + "'><b>" + sampleDatasJob.Status
								+ "</b></font></br> " + "<font size='5'>("
								+ sampleDatasJob.JobName + ")</font></br>"
								+ "  " + sd.toLocaleString() + "  -  "
								+ fd.toLocaleString() + "( SUBMIT_TIME:"
								+ subd.toLocaleString() + " )</br></p>");
				$(".clearSpace").css({
					height : 15,
					clear : "both"
				});
				$("#jobInfoSpace p").css({marginLeft:10});

				$("#" + this.$el.attr("id"))
						.append(
								'<div id="leftTop"></div><div id="rightTop"></div><div id="graphSpace"></div>');
				$("#leftTop").css({
					float : "left",
					width : 200,
					height : 50
				/* , "background-color":"red" */});
				$("#leftTop")
				.append(
						'<input type="button" value="Back" onClick="self.history.back()">');
				$("#rightTop").css({
					float : "right",
					width : 450,
					height : 50
				/* , "background-color":"green" */});
				$("#graphSpace").css({clear:"both", width:900, height:5});
				$("#rightTop")
						.append(
								'<input type="checkbox" value="MapSuccess" id="0" '+flagCheck(MAP_SUCCESS)+'>MapSuccess');
				$("#rightTop")
						.append(
								'<input type="checkbox" value="MapFailed" id="1" '+flagCheck(MAP_FAILED)+'>MapFailed');
				$("#rightTop")
						.append(
								'<input type="checkbox" value="ReduceSuccess" id="2" '+flagCheck(REDUCE_SUCCESS)+'>ReduceSuccess');
				$("#rightTop")
						.append(
								'<input type="checkbox" value="ReduceFailed" id="3" '+flagCheck(REDUCE_FAILED)+'>ReduceFailed');
				$("#" + this.$el.attr("id")).append('<div id="Bubble"></div>');
				$("#Bubble").css({
					marginTop : 20,
					marginLeft : 70
				});
				$("#leftTop").css({
					marginTop : 10,
					marginLeft : 100
				});
				$("#rightTop").css({
					marginTop : 10,
					marginLeft : 10
				});
				$("#selector").css({
					marginTop : 10,
					marginLeft : 10
				});

			}
		});
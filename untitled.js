
	//篮球鞋装备
	function equipment(){
		var that = this;
		that.options={
			//运动装备的影响因素
			'factor_items' : [],
			//用户选项以及选项值
			'select_items':{
				'weight' : [],
			}
		}
		that.tag={
			'matchTag' :'',//匹配的标签，只有一个
			'similarTag': [],//相似的标签，可能有多个
			'tag_arr' :[],//匹配标签的数组形式，用于相似标签
		}
	}	
	equipment.prototype={
		//内部函数，根据选项以及选项值，计算影响因素的得分
		'_calculFactorScore': function(select_items){
			var that = this,
				_factorScore ={};//记录影响因素的得分
			for(var i= 0;i<that.options.factor_items.length;i++){
				var _factor = that.options.factor_items[i];
				_factorScore[_factor] =0;//默认分数
			}
			for(var item in select_items){
				if(select_items.hasOwnProperty(item)){
					var value = select_items[item];
					switch(item){
						//得分规则
					}
				}
			}

			return _factorScore;
		},
		//内部函数，根据影响因素的得分，计算完全匹配的标签
		'_calculMatchTagArr' : function(select_items){
			var that = this;
			var factor_item_score = that._calculFactorScore(select_items);
			var tag_arr=[];

			that.tag.tag_arr = tag_arr;
			return that;
		},
		'_calculMatchTag' : function(){
			var that = this;
			that.tag.matchTag = that.tag.tag_arr.join('');
			return that;
		},
		//根据匹配的标签，计算出相似标签
		'_calculSimilarTag' : function(){
			var that = this;
			var similarTag =[];
			that.tag.similarTag = similarTag;
			return that;
		},
		//计算标签
		'calculTag' : function(select_items){
			var that = this;
			that._calculMatchTagArr(select_items);
			that._calculMatchTag();
			that._calculSimilarTag();
			return that;
		},
		//获取标签
		'getTag' : function(){
			var that = this;
			return that.tag;
		}
	}

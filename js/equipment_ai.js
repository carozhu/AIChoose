/**匹配逻辑标签**/
define('level',function(){
	return {
		'SQUID_HIGH':'J',
		'SQUID_MIDDLE_HIGH':'I',
		'SQUID_MIDDLE':'H',
		'SQUID_MIDDLE_LOW':'G',
		'HIGH':'E',
		'MIDDLE_HIGH' :'D',
		'MIDDLE':'C',
		'MIDDLE_LOW':'B',
		'LOW':'A',
		'NONE':'Z',
		'A_Z':'ABCDEFGHIJKLMNOPQRSTUVWXYZ'//用于算相似标签
	}
});
/**篮球鞋选装逻辑**/
define('basketball_shose',['level'],function(require,exports,module){
	var LEVEL = require('level');
	//篮球鞋装备
	function basketball_shose() {
		var that = this;
		that.options = {
			//运动装备的影响因素
			'factor_items': ['UPPER', 'HELL', 'FOREFOOT', 'DOOR', 'POSITION'],
			//用户选项以及选项值
			'select_items': {
				'weight': ['WEIGHT_LOW', 'WEIGHT_MIDDLE', 'WEIGHT_HIGH'],
				'position': ['POSITION_S', 'POSITION_SF', 'POSITION_PF', 'POSITION_C'],
				'tec': ['SPEED', 'ACR', 'POWER'],
				'skill': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
				'door': ['INDOOR', 'OUTDOOR']
			},
			//用户选项对应的个人描述
			'desc_items':{
				'weight':['轻量级','中量级','重量级'],
				'position':['后卫','小前锋','大前锋','中锋'],
				'tec':['速度型','技巧型','力量型'],
				'skill':['你是球场上拿球机会最多的球员，是进攻组织者，让球在适合的时候出现在适合的地方是你的长项。',
				'你运球技巧灵活，脚步快速，灵动潇洒，超越防守者切入篮下攻击篮筐是你的常态。',
				'进攻时，你在快速移动中突然制动跳起投篮，杀得防守球员措手不及，尽显你那完美的协调性与爆发力。',
				'你在受到贴身防守时强行旱地拔葱，利用身高和弹跳进行跳投得分，轻蔑一声“in your face”。',
				'你身体壮硕 ，技术全面，在低位持球以各种华丽的技术进攻篮筐，赢得喝彩。',
				'你是篮球场上的猎豹，敏捷而爆发力十足，抢夺在对手控制下的篮球，发动快速反击。',
				'你在高大对手的防守下，避其锋芒，以四两拨千斤的勾手攻击篮筐，让防守者抓狂。',
				'你在运球行进间突然改变移动方向，快速甩掉防守者或终结他的脚踝，你那华丽的技术让人赏心悦目。',
				'你能敏锐的判断篮球落点，抢占有利位置，起跳抢球，控制球权，篮板抢得好，进攻机会多到手软。',
				'你时刻都在合理抢占有利位置阻断进攻，没错你就是球场上的牛皮糖，粘在进攻者身上挣不脱甩不掉。',
				'你那爆炸弹跳力，零距离接触篮筐的画面，给观众们带来的不止是震撼，没错你就是篮球场上的战斗机。',
				'你有精准的投篮弧度，火热的投篮手感，神射手—种摧毁防守心理的存在，就是这么骄傲。',
				'你能在防守紧迫时，利用快速出手，向上抛球，越过防守攻击篮筐，机敏而灵巧。'
				],
				'door':['','']
			},
			//用户得出鞋子标签对应的鞋子描述
			'desc_shose':{
				'UPPER':{
					'LOW':'低帮，十足的脚踝自由',
					'MIDDLE':'中帮，兼具一定的保护性与灵活性',
					'HIGH':'高帮，严实的脚踝保护'
				},//鞋帮
				'HELL':{
					'LOW':'对膝盖的保护弱，适合体重小，弹跳少者使用',
					'MIDDLE_LOW':'保护性一般，能吸收少量对膝盖的冲击力',
					'MIDDLE':'缓冲性能较好，对膝盖有一定的保护性',
					'MIDDLE_HIGH':'吸收大部分冲击力，较好的保护膝盖',
					'HIGH':'跳起落地时几乎感觉不到对膝盖的冲击',
				},//缓震
				'FOREFOOT':{
					'LOW':'反应速度缓慢，无回弹，适合跑动少者使用',
					'MIDDLE_LOW':'反应速度一般，提供少量的回弹',
					'MIDDLE':'反应速度较好，有一定的回弹能力',
					'MIDDLE_HIGH':'反应快，回弹好，为启动与弹跳提供良好的助力',
					'HIGH':'助你启速助你飞，反应灵敏，回弹十足'
				},
				'DOOR':{
					'LOW':'内场',
					'HIGH':'外场'
				},
				'COMPLEX':{
					'0':'稳定与轻便',
					'1':'稳定与快速',
					'2':'稳定与弹性',
					'3':'弹性十足',
					'4':'保护与稳定',
					'5':'反应迅捷',
					'6':'强劲保护',
					'7':'轻便与灵活',
					'8':'强劲保护',
					'9':'稳定与保护',
					'10':'弹性与保护',
					'11':'稳定',
					'12':'保护与灵敏'
				}
			}
		}
		that.tag = {
			'matchTag': '', //匹配的标签，只有一个
			'similarTag': [], //相似的标签，可能有多个
			'tag_arr': [], //匹配标签的数组形式，用于相似标签
		}
		//描述
		that.slogan ={
			'desc':[],
			'sent':'',
			'shoseDesc':[]
		}
	}
	basketball_shose.prototype = {
		//内部函数，根据选项以及选项值，计算影响因素的得分
		'_calculFactorScore': function(select_items) {
			var that = this,
				_factorScore = {}; //记录影响因素的得分
			for (var i = 0; i < that.options.factor_items.length; i++) {
				var _factor = that.options.factor_items[i];
				_factorScore[_factor] = 0; //默认分数
			}
			for (var item in select_items) {
				if (select_items.hasOwnProperty(item)) {
					var value = select_items[item];
					switch (item) {
						case 'weight':
							//体重,影响后跟HELL
							switch (value) {
								case 'WEIGHT_LOW':
									_factorScore.HELL += 10;
									break;
								case 'WEIGHT_MIDDLE':
									_factorScore.HELL += 20;
									break;
								case 'WEIGHT_HIGH':
									_factorScore.HELL += 30;
									break;
							}
							break;
						case 'position':
							//位置，影响鞋帮UPPER
							switch (value) {
								case 'POSITION_S':
									//后卫
									_factorScore.UPPER += 10;
									_factorScore.POSITION += 20;
									break;
								case 'POSITION_SF':
									//小前锋
									_factorScore.UPPER += 15;
									_factorScore.POSITION += 50;
									break;
								case 'POSITION_PF':
									//大前锋
									_factorScore.UPPER += 25;
									_factorScore.POSITION += 70;
									break;
								case 'POSITION_C':
									//中锋
									_factorScore.UPPER += 35;
									_factorScore.POSITION += 70;
									break;
							}
							break;
						case 'tec':
							//技术类型影响前掌FOREFOOT
							switch (value) {
								case 'SPEED':
									//速度型
									_factorScore.FOREFOOT += 30;
									break;
								case 'ACR':
									//技巧型
									_factorScore.FOREFOOT += 20;
									break;
								case 'POWER':
									//力量型
									_factorScore.FOREFOOT += 10;
									break;
							}
							break;
						case 'skill':
							//技能影响UPPER/HELL/FOREFOOT
							switch (parseInt(value, 10)) {
								case 0:
									//控球传球
									_factorScore.UPPER += 20;
									_factorScore.HELL += 5;
									_factorScore.FOREFOOT += 5;
									break;
								case 1:
									//持球突破
									_factorScore.UPPER += 10;
									_factorScore.HELL += 35;
									_factorScore.FOREFOOT += 45;
									break;
								case 2:
									//急停跳投
									_factorScore.UPPER += 30;
									_factorScore.HELL += 25;
									_factorScore.FOREFOOT += 35;
									break;
								case 3:
									//干拔
									_factorScore.UPPER += 30;
									_factorScore.HELL += 30;
									_factorScore.FOREFOOT += 40;
									break;
								case 4:
									//背、面框单打
									_factorScore.UPPER += 40;
									_factorScore.HELL += 40;
									_factorScore.FOREFOOT += 25;
									break;
								case 5:
									//抢断
									_factorScore.UPPER += 15;
									_factorScore.HELL += 15;
									_factorScore.FOREFOOT += 35;
									break;
								case 6:
									//勾手
									_factorScore.UPPER += 35;
									_factorScore.HELL += 30;
									_factorScore.FOREFOOT += 10;
									break;
								case 7:
									//变向
									_factorScore.UPPER += 5;
									_factorScore.HELL += 10;
									_factorScore.FOREFOOT += 30;
									break;
								case 8:
									//抢篮板
									_factorScore.UPPER += 40;
									_factorScore.HELL += 45;
									_factorScore.FOREFOOT += 25;
									break;
								case 9:
									//贴身防守
									_factorScore.UPPER += 15;
									_factorScore.HELL += 10;
									_factorScore.FOREFOOT += 20;
									break;
								case 10:
									//扣篮
									_factorScore.UPPER += 40;
									_factorScore.HELL += 45;
									_factorScore.FOREFOOT += 25;
									break;
								case 11:
									//远投
									_factorScore.UPPER += 25;
									_factorScore.HELL += 20;
									_factorScore.FOREFOOT += 15;
									break;
								case 12:
									//抛投
									_factorScore.UPPER += 10;
									_factorScore.HELL += 35;
									_factorScore.FOREFOOT += 40;
							}
							break;
						case 'door':
							//室内室外影响DOOR
							switch (value) {
								case 'INDOOR':
									_factorScore.DOOR += 0;
									break;
								case 'OUTDOOR':
									_factorScore.DOOR += 1;
									break;
							}
							break;
					}
				} //end if
			} //end for

			return _factorScore;
		},
		//内部函数，根据影响因素的得分，计算完全匹配的标签
		'_calculMatchTagArr': function(select_items) {
			var that = this;
			var factor_item_score = that._calculFactorScore(select_items);

			var tag_arr = [], //用于存储选装结果标签
				upper_score = factor_item_score.UPPER, //鞋帮得分
				hell_score = factor_item_score.HELL, //后跟缓震得分
				forefoot_score = factor_item_score.FOREFOOT, //前掌回弹得分
				door_score = factor_item_score.DOOR,//室内室外得分
				position_score = factor_item_score.POSITION;//位置得分

			//鞋帮标签计算方式
			if (10 < upper_score && upper_score <= 40) {
				tag_arr.push(LEVEL.LOW);
			} else if (40 < upper_score && upper_score <= 59) {
				tag_arr.push(LEVEL.MIDDLE);
			} else if (59 < upper_score && upper_score <= 80) {
				tag_arr.push(LEVEL.HIGH);
			}

			//后跟标签计算方式
			if (10 < hell_score && hell_score <= 25) {
				tag_arr.push(LEVEL.LOW);
			} else if (25 < hell_score && hell_score <= 40) {
				tag_arr.push(LEVEL.MIDDLE_LOW);
			} else if (40 < hell_score && hell_score <= 55) {
				tag_arr.push(LEVEL.MIDDLE);
			} else if (55 < hell_score && hell_score <= 70) {
				tag_arr.push(LEVEL.MIDDLE_HIGH);
			} else if (70 < hell_score && hell_score <= 80) {
				tag_arr.push(LEVEL.HIGH);
			}
			//前掌标签计算方式
			if (10 < forefoot_score && forefoot_score <= 25) {
				tag_arr.push(LEVEL.LOW);
			} else if (25 < forefoot_score && forefoot_score <= 40) {
				tag_arr.push(LEVEL.MIDDLE_LOW);
			} else if (40 < forefoot_score && forefoot_score <= 55) {
				tag_arr.push(LEVEL.MIDDLE);
			} else if (55 < forefoot_score && forefoot_score <= 70) {
				tag_arr.push(LEVEL.MIDDLE_HIGH);
			} else if (70 < forefoot_score && forefoot_score <= 80) {
				tag_arr.push(LEVEL.HIGH);
			}
			//室内室外标签计算方式
			if (door_score == 0) {
				tag_arr.push(LEVEL.LOW);
			} else if (door_score == 1) {
				tag_arr.push(LEVEL.HIGH);
			}
			// 位置

			if(position_score == 20){
				tag_arr.push(LEVEL.LOW);
			}else if(position_score == 50){
				tag_arr.push(LEVEL.MIDDLE);
			}else if(position_score == 70){
				tag_arr.push(LEVEL.HIGH);
			}
			that.tag.tag_arr = tag_arr;

			console.log('鞋帮得分：', upper_score,
				'，后跟得分：', hell_score,
				'，前掌得分：', forefoot_score,
				'，室内室外：', door_score,
				', 位置得分：', position_score,tag_arr);
			return that;
		},
		'_calculMatchTag': function() {
			var that = this;
			that.tag.matchTag = that.tag.tag_arr.join('');
			return that;
		},
		//根据匹配的标签，计算出相似标签
		'_calculSimilarTag': function() {
			var that = this;

			var similarTag = [],
				item_tag = that.tag.tag_arr;
			//获取性能与该标签相似的标签，规则是根据后跟与前掌的标签补弱
			var _1_index = LEVEL.A_Z.indexOf(item_tag[1]),
				_2_index = LEVEL.A_Z.indexOf(item_tag[2]);
			if (_1_index < 5 || _2_index < 5) {
				//当两者相等时，则有有两个标签（2，3或3，2）
				if (_1_index == _2_index) {
					similarTag.push(item_tag[0] + '' + LEVEL.A_Z[_1_index + 1] + '' + item_tag[2] + '' + item_tag[3] + '' + item_tag[4]);
					similarTag.push(item_tag[0] + '' + item_tag[1] + '' + LEVEL.A_Z[_2_index + 1] + '' + item_tag[3] + '' + item_tag[4]);
				} else if (_1_index < _2_index) {
					similarTag.push(item_tag[0] + '' + LEVEL.A_Z[_1_index + 1] + '' + item_tag[2] + '' + item_tag[3] + '' + item_tag[4]);
				} else {
					similarTag.push(item_tag[0] + '' + item_tag[1] + '' + LEVEL.A_Z[_2_index + 1] + '' + item_tag[3] + '' + item_tag[4]);
				}
			}
			that.tag.similarTag = similarTag;
			return that;
		},
		//计算标签
		'calculTag': function(select_items) {
			var that = this;
			that._calculMatchTagArr(select_items);
			that._calculMatchTag();
			that._calculSimilarTag();
			console.log('匹配标签是：', that.tag.matchTag, '相似标签是：', that.tag.similarTag);
			return that;
		},
		//获取标签
		'getTag': function() {
			var that = this;
			return that.tag;
		},
		//匹配个人描述话术
		'_matchPersonSlogan':function(select_items){
			var that = this;
			console.log(select_items)
			for(var key in select_items){
				if(select_items.hasOwnProperty(key)){
					var val = select_items[key];//weight,position等
					if(key !=='skill'){
						//判断这个值在数组中的位置
						var index = that.options.select_items[key].indexOf(val);
						that.slogan.desc.push( that.options.desc_items[key][index]);
					}else{
						var index = that.options.select_items[key].indexOf(parseInt(val,10));
						that.slogan.sent = that.options.desc_items[key][index];
					}
				}
			}
			return that;
		},
		//匹配鞋子描述话术
		'_matchEquipmentSlogan':function(skill_index){
			var that = this;
			//转换LEVEL
			var _LEVEL ={};
			for(var key in LEVEL){
				if(LEVEL.hasOwnProperty(key)){
					_LEVEL[LEVEL[key]] = key;
				}
			}
			var tagArr = that.tag.tag_arr;
			for(var i =0;i<tagArr.length;i++){
				var level = _LEVEL[tagArr[i]]; 
					var factor_item = that.options.factor_items[i];
					if(that.options.desc_shose[factor_item] !== undefined)
					that.slogan.shoseDesc.push(that.options.desc_shose[factor_item][level]);
			}
			that.slogan.shoseDesc.push(that.options.desc_shose.COMPLEX[skill_index]);
			return that;
		},
		//获取个人描述和鞋子描述话术
		'getMatchSlogan':function(select_items){
			var that = this;
			that._matchPersonSlogan(select_items);
			that._matchEquipmentSlogan(select_items.skill);
			return that.slogan;
		}
	}
	module.exports= basketball_shose;
});
/**网球拍选装逻辑**/
define('tennis_racket',['level'],function(require,exports,module){
	var LEVEL = require('level');
	function tennis_racket() {
		var that = this;
		that.options = {
			//运动装备的影响因素（重量WIDGH、拍面大小RACKET、平衡点BALANCE、硬度HARDNESS）
			'factor_items': ['WIDGH', 'RACKET', 'BALANCE', 'HARDNESS'],
			//用户选项以及选项值
			'select_items': {
				'sex': ['MALE', 'FEMALE'], //性别：男女
				'weight': ['LIGHT', 'GENERAL', 'HEAVY'], //体重：低中高
				'level': ['LOW', 'MIDDLE', 'HIGH'], //水平：低中高
				'area': ['BASELINE', 'AREA_ALL', 'NET'], //控制区域：底线型、综合性、上网型
				'strength': ['BORROW', 'ALL', 'INITA'], //发力：接力型、综合型、主动发力型
				'style': ['CONTROL', 'PROWER', 'COMPLEX'] //风格偏好：控制性、力量型、综合型
			}
		}
		that.tag = {
			'matchTag': '', //匹配的标签，只有一个
			'similarTag': [], //相似的标签，可能有多个
			'tag_arr': [], //匹配标签的数组形式，用于相似标签
		}
		//描述
		that.slogan ={
			'desc':[],
			'sent':'',
			'shoseDesc':[]
		}
	}
	tennis_racket.prototype = {
		//内部函数，根据选项以及选项值，计算影响因素的得分
		'_calculFactorScore': function(select_items) {
			var that = this,
				_factorScore = {}; //记录影响因素的得分
			for (var i = 0; i < that.options.factor_items.length; i++) {
				var _factor = that.options.factor_items[i];
				_factorScore[_factor] = 0; //默认分数
			}
			for (var item in select_items) {
				if (select_items.hasOwnProperty(item)) {
					var value = select_items[item];
					switch (item) {
						//得分规则
						case 'sex':
							//性别
							switch (value) {
								case 'MALE':
									//男性
									_factorScore.WIDGH += 0;
									break;
								case 'FEMALE':
									//女性
									_factorScore.WIDGH -= 10;
									break;
							}
							break;
						case 'weight':
							//体重
							switch (value) {
								case 'LIGHT':
									//轻
									_factorScore.WIDGH += 15;
									break;
								case 'GENERAL':
									_factorScore.WIDGH += 25;
									break;
								case 'HEAVY':
									_factorScore.WIDGH += 35;
									break;
							}
							break;
						case 'level':
							//水平
							switch (value) {
								case 'LOW':
									//初学
									_factorScore.WIDGH += 10;
									_factorScore.RACKET += 10;
									break;
								case 'MIDDLE':
									//进阶
									_factorScore.WIDGH += 20;
									_factorScore.RACKET += 20;
									break;
								case 'HIGH':
									//高级
									_factorScore.WIDGH += 30;
									_factorScore.RACKET += 30;
									break;
							}
							break;
						case 'area':
							//控制区域分类
							switch (value) {
								case 'BASELINE':
									//底线型
									_factorScore.BALANCE += 10;
									break;
								case 'AREA_ALL':
									//综合型
									_factorScore.BALANCE += 0;
									break;
								case 'NET':
									//上网型
									_factorScore.BALANCE -= 10;
									break;
							}
							break;
						case 'strength':
							//发力类型
							switch (value) {
								case 'BORROW':
									//借力型
									_factorScore.BALANCE += 15;
									break;
								case 'ALL':
									//综合型
									_factorScore.BALANCE += 0;
									break;
								case 'INITA':
									//主动发力型
									_factorScore.BALANCE -= 15;
									break;
							}
							break;
						case 'style':
							//风格偏好
							switch (value) {
								case 'CONTROL':
									//控制型
									_factorScore.HARDNESS += 0;
									break;
								case 'PROWER':
									//力量型
									_factorScore.HARDNESS += 20;
									break;
								case 'COMPLEX':
									//综合型
									_factorScore.HARDNESS += 10;
									break;
							}
							break;
					}
				}
			}
			return _factorScore;
		},
		//内部函数，根据影响因素的得分，计算完全匹配的标签
		'_calculMatchTagArr': function(select_items) {
			var that = this;
			var factor_item_score = that._calculFactorScore(select_items);
			var tag_arr = [], //用于存储选装结果标签
				widgh_score = factor_item_score.WIDGH, //重量得分
				racket_score = factor_item_score.RACKET, //牌面大小得分
				balance_score = factor_item_score.BALANCE, //平衡点得分
				hardness_score = factor_item_score.HARDNESS; //硬度得分
			//计算重量
			if (15 <= widgh_score && widgh_score < 25) {
				tag_arr.push(LEVEL.LOW);
			} else if (25 <= widgh_score && widgh_score <= 35) {
				tag_arr.push(LEVEL.MIDDLE_LOW);
			} else if (35 < widgh_score && widgh_score < 45) {
				tag_arr.push(LEVEL.MIDDLE)
			} else if (45 <= widgh_score && widgh_score <= 55) {
				tag_arr.push(LEVEL.MIDDLE_HIGH);
			} else if (55 < widgh_score && widgh_score <= 65) {
				tag_arr.push(LEVEL.HIGH);
			} else {
				tag_arr.push(LEVEL.NONE);
			}

			//计算拍面大小
			if (racket_score == 10) {
				tag_arr.push(LEVEL.LOW);
			} else if (racket_score == 20) {
				tag_arr.push(LEVEL.MIDDLE);
			} else if (racket_score == 30) {
				tag_arr.push(LEVEL.HIGH);
			} else {
				tag_arr.push(LEVEL.NONE);
			}

			//计算平衡性
			if (-10 <= balance_score && balance_score < -5) {
				tag_arr.push(LEVEL.LOW);
			} else if (-5 <= balance_score && balance_score <= 5) {
				tag_arr.push(LEVEL.MIDDLE);
			} else if (5 < balance_score && balance_score <= 10) {
				tag_arr.push(LEVEL.HIGH);
			} else {
				tag_arr.push(LEVEL.NONE);
			}

			//计算硬度
			if (hardness_score == 0) {
				tag_arr.push(LEVEL.LOW);
			} else if (hardness_score == 10) {
				tag_arr.push(LEVEL.MIDDLE);
			} else if (hardness_score == 20) {
				tag_arr.push(LEVEL.HIGH);
			} else {
				tag_arr.push(LEVEL.NONE);
			}
			console.log('重量得分：', widgh_score,
				'，牌面大小得分：', racket_score,
				'，平衡点得分：', balance_score,
				'，硬度得分：', hardness_score);

			that.tag.tag_arr = tag_arr;
			return that;
		},
		'_calculMatchTag': function() {
			var that = this;
			that.tag.matchTag = that.tag.tag_arr.join('');
			return that;
		},
		//根据匹配的标签，计算出相似标签
		'_calculSimilarTag': function() {
			var that = this;
			var similarTag = [];
			that.tag.similarTag = similarTag;
			return that;
		},
		//计算标签
		'calculTag': function(select_items) {
			var that = this;
			that._calculMatchTagArr(select_items);
			that._calculMatchTag();
			that._calculSimilarTag();
			console.log('匹配标签是：', that.tag.matchTag, '相似标签是：', that.tag.similarTag);
			return that;
		},
		//获取标签
		'getTag': function() {
			var that = this;
			return that.tag;
		},
		//获取描述话术
		'getMatchSlogan':function(select_items){
			var that = this;
			return that.slogan;
		}
	}
	module.exports = tennis_racket;
});
/**跑步鞋装备选装逻辑**/
define('run_shose',['level'],function(require,exports,module){
	var LEVEL = require('level');
	function run_shose() {
		var that = this;
		that.options = {
			//运动装备的影响因素
			'factor_items': ['RUN_TYPE', 'FACTOR', 'XFACTOR'], //
			//用户选项以及选项值
			'select_items': {
				'run_type': ['MARATHON', 'RECOVER', 'CROSS_COUNTRY', 'FASHION', 'DIALY'], //跑步鞋是用来：参加半/全马拉松、伤后恢复训练、越野、时尚、日常健康慢跑
				'sex': ['MALE', 'FAMALE'], //性别：男、女
				'amount': ['LOW', 'MIDDLE', 'HIGH'], //跑量：5km、5-10km、10km
				'country_type': ['COMPETION', 'WATERPROOF', 'GENERAL'], //越野类型：竞赛、防水、普通
				'weight': ['WEIGHT_LOW', 'WEIGHT_MIDDLE', 'WEIGHT_HIGH'], //体重：高中低
				//鞋重：常规、轻量
				'arch': ['LOW', 'MIDDLE', 'HIGH'],
				//足弓：平、正常、高
				'spin': ['LOW', 'MIDDLE', 'HIGH'], //足旋：过、正常、不足

			}
		}
		that.tag = {
			'matchTag': '', //匹配的标签，只有一个
			'similarTag': [], //相似的标签，可能有多个
			'tag_arr': [], //匹配标签的数组形式，用于相似标签
		}
		//描述
		that.slogan ={
			'desc':[],
			'sent':'',
			'shoseDesc':[]
		}
	}
	run_shose.prototype = {
		//内部函数，根据选项以及选项值，计算影响因素的得分
		'_calculFactorScore': function(select_items) {
			var that = this,
				_factorScore = {}; //记录影响因素的得分
			for (var i = 0; i < that.options.factor_items.length; i++) {
				var _factor = that.options.factor_items[i];
				_factorScore[_factor] = 0; //默认分数
			}
			//根据跑步类型不同，有不同的计算方式
			switch (select_items.run_type) {
				case 'MARATHON':
					//马拉松
					_factorScore.RUN_TYPE = 5;
					break;
				case 'RECOVER':
					//恢复型
					_factorScore.RUN_TYPE = 4;
					//体重计算
					switch (select_items.widght) {
						case 'WEIGHT_LOW':
							//轻
							_factorScore.FACTOR += 0.5;
							break;
						case 'WEIGHT_MIDDLE':
							//一般
							_factorScore.FACTOR += 1;
							break;
						case 'WEIGHT_HIGH':
							//重
							_factorScore.FACTOR += 2;
							break;
					}
					//跑量计算
					switch (select_items.amount) {
						case 'LOW':
							//5KM以下
							_factorScore.FACTOR += 0.5;
							break;
						case 'MIDDLE':
							//5-10km
							_factorScore.FACTOR += 1;
							break;
						case 'HIGH':
							_factorScore.FACTOR += 2;
							break;
					}
					break;
				case 'CROSS_COUNTRY':
					//越野型
					_factorScore.RUN_TYPE = 3;
					switch (select_items.country_type) {
						case 'COMPETION':
							//竞赛
							_factorScore.FACTOR += 5;
							break;
						case 'WATERPROOF':
							//防水
							_factorScore.FACTOR += 3;
							break;
						case 'GENERAL':
							//普通
							_factorScore.FACTOR += 1;
							break;
					}
					break;
				case 'FASHION':
					//时尚
					_factorScore.RUN_TYPE = 2;
					break;
				case 'DIALY':
					//日常
					_factorScore.RUN_TYPE = 1;
					//相关因素计算		
					var _w = 0, //体重得分
						_a = 0, //跑量
						_arch = 0, //足弓得分
						_spin = 0; //足旋得分
					//体重计算
					switch (select_items.weight) {
						case 'WEIGHT_LOW':
							//轻
							_w = 0.5;
							break;
						case 'WEIGHT_MIDDLE':
							//一般
							_w = 1;
							break;
						case 'WEIGHT_HIGH':
							//重
							_w = 2;
							break;
					}
					//计算跑量
					switch (select_items.amount) {
						case 'LOW':
							//5KM以下
							_a = 0.5;
							break;
						case 'MIDDLE':
							//5-10km
							_a = 1;
							break;
						case 'HIGH':
							_a = 2;
							break;
					}
					//计算足弓
					switch (select_items.arch) {
						case 'LOW':
							//平
							_arch = -1;
							break;
						case 'MIDDLE':
							//正常
							_arch = 0;
							break;
						case 'HIGH':
							//高
							_arch = 2;
							break;
					}
					//计算足旋
					switch (select_items.spin) {
						case 'LOW':
							//平
							_spin = -1;
							break;
						case 'MIDDLE':
							//正常
							_spin = -0.5;
							break;
						case 'HIGH':
							//高
							_spin = 1;
							break;
					}
					//当 足弓高的时候 ，即 _arch=2时
					if (2 == _arch) {
						_factorScore.FACTOR = _w * _a * _arch * _spin;
					} else {
						_factorScore.FACTOR = _w * _a * (_arch + _spin);
					}
					break;
			}
			return _factorScore;
		},
		//内部函数，根据影响因素的得分，计算完全匹配的标签
		'_calculMatchTagArr': function(select_items) {
			var that = this;
			var factor_item_score = that._calculFactorScore(select_items);
			var tag_arr = [],
				run_type_score = factor_item_score.RUN_TYPE, //跑步类型
				factor_score = factor_item_score.FACTOR, //综合评分
				xfactor_score = factor_item_score.XFACTOR; //X因素
			//判断跑步类型
			switch (run_type_score) {
				case 5:
					//马拉松
					tag_arr.push(LEVEL.HIGH);
					tag_arr.push(LEVEL.NONE); //相关因素
					tag_arr.push(LEVEL.NONE); //x因素
					break;
				case 4:
					//恢复型
					tag_arr.push(LEVEL.MIDDLE_HIGH);
					//相关因素
					if (1 <= factor_score && factor_score < 2) {
						//低
						tag_arr.push(LEVEL.LOW);
					} else if (2 <= factor_score && factor_score < 3) {
						//中
						tag_arr.push(LEVEL.MIDDLE);
					} else if (3 <= factor_score && factor_score <= 4) {
						tag_arr.push(LEVEL.HIGH);
					} else {
						tag_arr.push(LEVEL.NONE);
					}
					//x因素
					tag_arr.push(LEVEL.NONE);
					break;
				case 3:
					//越野型
					tag_arr.push(LEVEL.MIDDLE);
					//相关因素
					if (1 == factor_score) {
						//普通
						tag_arr.push(LEVEL.LOW);
					} else if (3 == factor_score) {
						//防水
						tag_arr.push(LEVEL.MIDDLE)
					} else if (5 == factor_score) {
						//竞赛
						tag_arr.push(LEVEL.HIGH);
					} else {
						tag_arr.push(LEVEL.NONE);
					}
					tag_arr.push(LEVEL.NONE); //x因素
					break;
				case 2:
					//时尚型
					tag_arr.push(LEVEL.MIDDLE_LOW);
					tag_arr.push(LEVEL.NONE); //相关因素
					tag_arr.push(LEVEL.NONE); //x因素
					break;
				case 1:
					//日常型
					tag_arr.push(LEVEL.LOW);
					//相关因素
					if (-8 <= factor_score && factor_score <= -6) {
						//高支撑
						tag_arr.push(LEVEL.LOW);
					} else if (-6 < factor_score && factor_score <= -3) {
						//中高支撑
						tag_arr.push(LEVEL.MIDDLE_LOW);
					} else if (-3 < factor_score && factor_score <= -1.5) {
						//中等支撑
						tag_arr.push(LEVEL.MIDDLE);
					} else if (-1.5 < factor_score && factor_score <= -0.5) {
						//中底支撑
						tag_arr.push(LEVEL.MIDDLE_HIGH);
					} else if (-0.5 < factor_score && factor_score <= 0) {
						//低等支撑
						tag_arr.push(LEVEL.HIGH);
					} else if (0 < factor_score && factor_score <= 0.5) {
						//低缓震
						tag_arr.push(LEVEL.SQUID_LOW);
					} else if (0.5 < factor_score && factor_score <= 1) {
						//中底缓震
						tag_arr.push(LEVEL.SQUID_MIDDLE_LOW);
					} else if (1 < factor_score && factor_score <= 2) {
						//中缓震
						tag_arr.push(LEVEL.SQUID_MIDDLE);
					} else if (2 < factor_score && factor_score <= 4) {
						//中高缓震
						tag_arr.push(LEVEL.SQUID_MIDDLE_HIGH);
					} else if (4 < factor_score && factor_score <= 8) {
						//高缓震
						tag_arr.push(LEVEL.SQUID_HIGH);
					} else {
						tag_arr.push(LEVEL.NONE);
					}
					//其他因素
					if (1 == xfactor_score) {
						//鞋重常规
						tag_arr.push(LEVEL.LOW);
					} else if (5 == xfactor_score) {
						//鞋重轻量
						tag_arr.push(LEVEL.HIGH);
					}else{
						tag_arr.push(LEVEL.LOW);
					}
					break;
			}
			console.log('跑步类型', run_type_score,
				'，相关因素：', factor_score,
				'，其他因素：', xfactor_score);

			that.tag.tag_arr = tag_arr;
			return that;
		},
		'_calculMatchTag': function() {
			var that = this;
			that.tag.matchTag = that.tag.tag_arr.join('');
			return that;
		},
		//根据匹配的标签，计算出相似标签
		'_calculSimilarTag': function() {
			var that = this;
			var similarTag = [];
			that.tag.similarTag = similarTag;
			return that;
		},
		//计算标签
		'calculTag': function(select_items) {
			var that = this;
			that._calculMatchTagArr(select_items);
			that._calculMatchTag();
			that._calculSimilarTag();
			console.log('匹配标签是：', that.tag.matchTag, '相似标签是：', that.tag.similarTag);

			return that;
		},
		//获取标签
		'getTag': function() {
			var that = this;
			return that.tag;
		},
		//获取描述话术
		'getMatchSlogan':function(select_items){
			var that = this;
			return that.slogan;
		}
	}
	module.exports = run_shose;
});
/**选装逻辑**/
define(function(require, exports, module) {
	var basketball_shose = require('basketball_shose');//篮球鞋
	var tennis_racket = require('tennis_racket');//网球拍装备
	var run_shose = require('run_shose');//篮球鞋装备
	module.exports = {
		'BASKETBALL': {
			'SHOSE': basketball_shose
		},
		'RUN': {
			'SHOSE': run_shose
		},
		'TENNIS': {
			'RACKET': tennis_racket
		}
	};
});
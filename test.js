define(function(require, exports, module) {
//	var weight = ['WEIGHT_LOW', 'WEIGHT_MIDDLE', 'WEIGHT_HIGH'],
//		position= ['POSITION_S', 'POSITION_SF', 'POSITION_PF', 'POSITION_C'],
//		tec=['SPEED', 'ACR', 'POWER'],
//		skill= [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
//		door=['INDOOR', 'OUTDOOR'];
			var	sex = ['MALE', 'FEMALE'], //性别：男女
				weight= ['LIGHT', 'GENERAL', 'HEAVY'], //体重：低中高
				level=['LOW', 'MIDDLE', 'HIGH', 'UNKNOW'], //水平：低中高
				battle_type=['FLAT', 'ROTATE', 'ACCURATE', 'UNKNOW'], //击球类型：暴力平击、强烈旋转、精确落点、不清楚
				style=['ATTACK', 'DEFEND', 'ALL','UNKNOW'], //风格偏好：崇尚进攻、坚固防守、攻守兼备、不清楚
				strength= ['BORROW', 'INITA', 'UNKNOW'], //发力类型：借力型、主动发力型、不清楚
				backhand=['SINGLE','DOUBLE'],//反手类型：单手反拍、双手反拍
				skill=[0,1,2,3,4,5,6],//撒手锏：借力打力、网前截杀、重炮发球、放小球、超级上旋、月亮球、不清楚
				price=['LOW','MIDDLE','HIGH'];//价格：高中低



	function showTest(result,slogan,items){
		var m_length = result.match_result.length,s_length = result.similar_result.length;
		if(m_length>=3){result.match_result.length = 3};
		if(s_length >=6){result.similar_result.length = 6}
				var slogan_desc = '<div>个人描述：'+slogan.desc[0] + slogan.desc[2] + '的' + slogan.desc[1] + '</div>',
			slogan_sent = '<div>详细描述'+slogan.sent+'</div>',
			shoesDest = '<div>鞋子描述'+slogan.shoseDesc.join(',')+'</div>',
			total = '<section><span class="title">精准匹配到<span class="total-num">'+result.match_result.length+'</span>个装备</span><div>';//精准数量
		var _htmlArr=[];
			for(var i=0;i < result.match_result.length;i++){
				var ele = result.match_result[i];
				_htmlArr.push('<div class="result-container">');
                _htmlArr.push('<img src="' + ele.image + '">' +
                            '<div style="color:red;padding-bttom:10px;">'+ ele.brand +'</div><span>' + ele.name + '</span>');
                _htmlArr.push('</div>');
			}
		var shose_detail = total+_htmlArr.join('')+'</div></section>';
		var _s_total = '<section><span class="title">模糊匹配到<span class="total-num">'+result.similar_result.length+'</span>个装备</span><div>';//模糊数量
		var _htmlArr=[];
			for(var i=0;i < result.similar_result.length;i++){
								var ele = result.similar_result[i];
				_htmlArr.push('<div class="result-container">');
                _htmlArr.push('<img src="' + ele.image + '">' +
                            '<div style="color:red;padding-bttom:10px;">'+ ele.brand +'</div><span>' + ele.name + '</span>');
                _htmlArr.push('</div>');
			}
		var similar_detail = _s_total+_htmlArr.join('')+'</div></section>';

		_innerHTML = '<div><h1>'+result.match_tag+'</h1>'+slogan_desc+slogan_sent+shoesDest+shose_detail+similar_detail+'</div>';
		var dom = document.createElement('div');
		dom.innerHTML = _innerHTML;
		document.body.appendChild(dom);

	}



	require.async(['js/AIChoose.js', 'js/equipment.js'], function(AICE, EQUIPMENT) {
		document.body.innerHTML='';
//		var equipment_info = EQUIPMENT['BASKETBALL']['SHOSE']; //装备信息
		var equipment_info = EQUIPMENT['TENNIS']['RACKET']; //装备信息
		var options = {
			'sport_type': 'TENNIS',
			'equipment_type': 'RACKET'
		}
		var chongfu={};
		for(var i = 0;i<sex.length;i++){
			var _sex = sex[i];
			for(var j =0; j<weight.length;j++){
				var _weight = weight[j];
				for(var z=0;z<level.length;z++){
					var _level =level[z];
					for(var a =0;a<battle_type.length;a++){
						var _battle_type = battle_type[a];
						for(var b = 0;b<style.length;b++){
							var _style = style[b];
							for(var c= 0;c<strength.length;c++){
								var _strength = strength[c];
								for(var f =0;f<backhand.length;f++){
									var _backhand = backhand[f];
								for(var d = 0;d<skill.length;d++){
									var _skill = skill[d];
									if(_level == 'UNKNOW'){
										for(var e =0;e<price.length;e++){
											var _price = price[e];
											var select_items ={
												'sex':_sex,
               									'weight': _weight,
								                'level': _level,
								                'battle_type': _battle_type,
								                'strength': _strength,
								                'style': _style,
								                'backhand':_backhand,
								                'skill':_skill,
								                'price':_price
											}
											console.log(select_items);
							
							var chooseEquipment = new AICE(options);
							var result = chooseEquipment.init().AIChoose(equipment_info,select_items),
							slogan = chooseEquipment.getMatchSlogan(select_items);
							if(chongfu[result.match_tag]){

							}else{
								chongfu[result.match_tag] = true;
								showTest(result,slogan,select_items)

							}
										}
									}else{
										var select_items ={
												'sex':_sex,
               									'weight': _weight,
								                'level': _level,
								                'battle_type': _battle_type,
								                'strength': _strength,
								                'style': _style,
								                'backhand':_backhand,
								                'skill':_skill,
								                'price':'NONE'
											}
											console.log(select_items);
							
							var chooseEquipment = new AICE(options);
							var result = chooseEquipment.init().AIChoose(equipment_info,select_items),
							slogan = chooseEquipment.getMatchSlogan(select_items);
							if(chongfu[result.match_tag]){

							}else{
								chongfu[result.match_tag] = true;
								showTest(result,slogan,select_items)

							}
									}
								}
							}							
						}}
					}
				}
			}
		}
	});
})
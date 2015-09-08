define(function(require, exports, module) {
	var weight = ['WEIGHT_LOW', 'WEIGHT_MIDDLE', 'WEIGHT_HIGH'],
		position= ['POSITION_S', 'POSITION_SF', 'POSITION_PF', 'POSITION_C'],
		tec=['SPEED', 'ACR', 'POWER'],
		skill= [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
		door=['INDOOR', 'OUTDOOR'];




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
		var equipment_info = EQUIPMENT['BASKETBALL']['SHOSE']; //装备信息
		var options = {
			'sport_type': 'BASKETBALL',
			'equipment_type': 'SHOSE'
		}
		for(var i = 0;i<weight.length;i++){
			var _weight = weight[i];
			for(var j =0; j<position.length;j++){
				var _position = position[j];
				for(var z=0;z<tec.length;z++){
					var _tec =tec[z];
					for(var a =0;a<skill.length;a++){
						var _skill = skill[a];
						for(var b = 0;b<door.length;b++){
							var _door = door[b];
							var select_items={
								'weight':_weight,
								'position':_position,
								'tec':_tec,
								'skill':_skill,
								'door':_door
							}
							console.log(select_items);
							
							var chooseEquipment = new AICE(options);
							var result = chooseEquipment.init().AIChoose(equipment_info,select_items),
							slogan = chooseEquipment.getMatchSlogan(select_items);
							showTest(result,slogan,select_items)
						}
					}
				}
			}
		}
	});
})
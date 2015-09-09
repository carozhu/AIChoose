/****************************
 *智能选装算法模块
 *author:guanMac
 *
 *这里采用了策略模式
 *定义一系列的算法，把他们一个个封装起来，将不变的部分和变化的部分分开，就是将算法和实现分离。
 *优点主要有以下几点：
 *1.利用组合、委托的思想，有效避免大量if语句
 *2.代码容易理解和扩展
 *3.代码可复用。
 *
 *
 ****************************/
define(function(require, exports, module) {
    var EQUIPMENT_AI = require('js/equipment_ai.js');
    //智能选装
    function AICE(options) {
        var that = this;
        that.options = {
            'sport_type': options.sport_type || 'BASKETBALL', //选择的运动类型
            'equipment_type': options.equipment_type || 'SHOSE' //选择的装备类型       
        }

    }
    AICE.prototype = {
        //初始化
        'init': function() {
            var that = this;
            var sport_type = that.options.sport_type,
                equipment_type = that.options.equipment_type;
            //智能选装的装备
            that.equipment = new EQUIPMENT_AI[sport_type][equipment_type]();
            return that;
        },
        //选装逻辑
        'AIChoose': function(shose, select_items) {
            var that = this;
            //根据选项计算标签
            var tag = that.equipment.calculTag(select_items).getTag();
            var match_result = [], //保存完全符合标签的鞋子
            similar_result = []; //保存比该标签高一级的鞋子
            //匹配篮球鞋
            var priceTag=['E','C','A'];
            //篮球鞋特殊的匹配方式
            if(that.options.sport_type == 'BASKETBALL'){
                for(var i = 0;i<priceTag.length;i++){
                    var _p = priceTag[i];
                    for(var j =0;j<shose.length;j++){
                        var _shose = shose[j];
                        console.log(tag.matchTag + _p)
                        if(_shose.tag.trim() == (tag.matchTag+_p)){
                            match_result.push(_shose);
                        }
                         //循环高一级的标签，把符合的鞋子放入。
                    for (var k = 0; k < tag.similarTag.length; k++) {
                        if (_shose.tag.trim() == (tag.similarTag[k]+_p)) {
                            similar_result.push(_shose);
                        }
                    } //end for
                    }
                }
            }else{
               //匹配鞋子
            for (var i = 0; i < shose.length; i++) {
                var _shose = shose[i];
                //完全匹配标签的鞋子
                if (_shose.tag.trim() == tag.matchTag) {
                    match_result.push(_shose);
                } else {
                    //循环高一级的标签，把符合的鞋子放入。
                    for (var j = 0; j < tag.similarTag.length; j++) {
                        if (_shose.tag.trim() == tag.similarTag[j]) {
                            similar_result.push(_shose);
                        }
                    } //end for
                } //end if else
            } //end for 
            }
            
            return {
                'match_result': match_result,
                'similar_result': similar_result,
                'match_tag':tag.matchTag
            };
        },
        //获取描述
        'getMatchSlogan': function(select_items) {
            var that = this;
            return that.equipment.getMatchSlogan(select_items);
        }
    }
    module.exports = AICE;
});
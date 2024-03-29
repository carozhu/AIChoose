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
    var AICE = function(options) {
        var that = this;
        that.options = {
            'sport_type': options.sport_type || 'BASKETBALL', //选择的运动类型
            'equipment_type': options.equipment_type || 'SHOSE' //选择的装备类型       
        }
    }
    AICE.prototype = {
        /**
         * 初始化
         * @return {[type]} [description]
         */
        'init': function() {
            var that = this;
            var sport_type = that.options.sport_type,
                equipment_type = that.options.equipment_type;
            //智能选装的装备
            that.equipment = new EQUIPMENT_AI[sport_type][equipment_type]();
            return that;
        },
        /**
         * 选装逻辑
         * @param  {[type]} shose        [装备信息]
         * @param  {[type]} select_items [获取选项]
         * @return {[type]}              [description]
         */
        'AIChoose': function(shose, select_items) {
            var that = this;
            //根据选项计算标签
            var tag = that.equipment.calculTag(select_items).getTag();
            var match_result = [], //保存完全符合标签的鞋子
                similar_result = []; //保存比该标签高一级的鞋子
            //匹配鞋子
            for (var i = 0; i < shose.length; i++) {
                var _shose = shose[i];
                _shose_tag = _shose.tag.trim(); //鞋子标签

                //完全匹配标签的鞋子
                var _reg_match_tag = new RegExp('^' + tag.matchTag); //鞋子标签正则
                if (_reg_match_tag.test(_shose_tag)) {
                    match_result.push(_shose);
                } else {
                    //循环高一级的标签，把符合的鞋子放入。
                    for (var j = 0; j < tag.similarTag.length; j++) {
                        var _reg_simi_tag = new RegExp('^' + tag.similarTag[j]);
                        if (_reg_simi_tag.test(_shose_tag)) {
                            similar_result.push(_shose);
                        }
                    } //end for
                } //end if else
            } //end for 
            //篮球鞋的特殊匹配
            if (that.options.sport_type == 'BASKETBALL') {
                //使用原生的sort
                match_result.sort(that.basketball_shoes_sort);
                similar_result.sort(that.basketball_shoes_sort);
            } else {
                //其他匹配
                match_result = that.randEquipments(match_result);
                similar_result = that.randEquipments(similar_result);

            }

            return {
                'match_result': match_result,
                'similar_result': similar_result,
                'match_tag': tag.matchTag
            };
        },
        /**
         * 根据选项获取描述
         * @param  {[type]} select_items [description]
         * @return {[type]}              [description]
         */
        'getMatchSlogan': function(select_items) {
            var that = this;
            return that.equipment.getMatchSlogan(select_items);
        },
        /**
         *把结果打乱
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         */
        "randEquipments": function(data) {
            var dataLength = data.length;
            //存放下标数
            var _indexArr = [],
                _randIndexArr = [],
                randArr = [];
            for (var i = 0; i < dataLength; i++) {
                _indexArr.push(i);
            }
            //生成随机下标数
            for (var i = 0; i < dataLength; i++) {
                var index = Math.floor((Math.random() * _indexArr.length));
                _randIndexArr.push(_indexArr.splice(index, 1))
            }
            for (var i = 0; i < dataLength; i++) {
                randArr.push(data[_randIndexArr[i]]);
            }
            return randArr;
        },
        /**
         * 篮球鞋的标签排序方式
         * @param  {[type]} a [description]
         * @param  {[type]} b [description]
         * @return {[type]}   [description]
         */
        'basketball_shoes_sort': function(a, b) {
            var a_price = a.tag.charAt(a.tag.length - 1),
                b_price = b.tag.charAt(b.tag.length - 1);
            return a_price < b_price;
        }
    }
    module.exports = AICE;
});
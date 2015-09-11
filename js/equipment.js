/**
 * 装备数据中转站
 * 当last_hash == lazy_hash时直接读取localstorage
 * 当last_hash != layz_hash时，说明数据改变了
 * @param  {[type]} require [description]
 * @param  {[type]} exports [description]
 * @param  {[type]} module) {               var LocalS [description]
 * @return {[type]}         [description]
 */
define(function(require, exports, module) {
    var LocalS = require('LocalS');
    var EQUIPMENT = {
        'BASKETBALL': {
            'SHOSE': {
                'data': [],
                'last_hash': 'bs_091016',
                'lazy_hash': 'bs_091016'
            }
        },
        'RUN': {
            'SHOSE': {
                'data': [],
                'last_hash': 'bs_091016',
                'lazy_hash': 'rs_091016'
            }
        },
        'TENNIS': {
            'RACKET': {
                'data': [],
                'last_hash': 'tr_091016',

                'lazy_hash': 'tr_091020'
            }
        },
        'get': function(sport, equip, callback) {
            var that = this,
                equip_info = that[sport][equip];
            //如果没有该装备,返回空数据
            if (that[sport] == undefined || equip_info == undefined) {
                console.log('该装备为空');
                callback([]);
                return;
            }
            //先查看是否已经有，有则直接返回
            if (equip_info['data'].length > 0) {
                callback(equip_info['data']);
                return;
            }
            //查找本地缓存，有且时间戳没变，则直接使用
            var _data = LocalS.getVal(equip_info['lazy_hash']);
            if ((equip_info['lazy_hash'] == equip_info['last_hash']) && _data) {
                equip_info['data'] = _data;
                callback(_data);
            } else {
                //如果本地没有缓存，则远程请求
                var url = 'js/equipment_info/' + sport.toLowerCase() + '_' + equip.toLowerCase() + '_info.js';
                require.async(url, function(info) {
                    //把数据写到装备和本地
                    equip_info['data'] = info;
                    LocalS.deleteVal(equip_info['last_hash']);//删除以往的
                    LocalS.setVal(equip_info['lazy_hash'], info);//添加现在的
                    callback(info);
                });
            }
        }
    }

    module.exports = EQUIPMENT;
});
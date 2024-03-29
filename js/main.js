define(function(require) {
    var $ = require('jquery');
    //全局变量，用于记录选择的答案
    var SPORT = {
        'BASKETBALL': {
            'SHOSE': {
                'weight': 'WEIGHT_MIDDLE',
                'position': 'POSITION_SF',
                'tec': 'SPEED',
                'skill': '0',
                'door': 'INDOOR'
            }
        },
        'TENNIS': {
            'RACKET': {
                'sex': 'MALE',
                'weight': 'GENERAL',
                'level': 'MIDDLE',
                'battle_type': 'FLAT',
                'strength': 'BORROW',
                'style': 'ATTACK',
                'backhand': 'SINGLE',
                'skill': 0,
                'price': 'NONE'
            }
        },
        'RUN': {
            'SHOSE': {
                'run_type': "MARATHON",
                'sex': 'MALE',
                'amount': 'LOW',
                'country_type': 'COMPETION',
                'weight': 'WEIGHT_LOW',
                'arch': 'LOW',
                'spin': 'LOW'
            }
        }
    }

    //根据选项获取对应的参数
    function getSelectInfo(opt, equipment_info) {
       var select_items = SPORT[opt.sport_type][opt.equipment_type]; //选项内容
        return {
            'options': opt,
            'select_items': select_items,
            'equipment_info': equipment_info
        }
    }

    function getSelectOptions() {
        var sport_type = $('input[name=sport_type]:checked').val(); //运动类型
        var equipment_type = ''; //装备类型
        if (sport_type == 'BASKETBALL') {
            equipment_type = $('input[name=equipment_type]:checked').val();
        } else if (sport_type == 'TENNIS') {
            equipment_type = $('input[name=tr_equipment_type]:checked').val();
        } else if (sport_type == 'RUN') {
            equipment_type = $('input[name=rs_equipment_type]:checked').val();
        }
        var options = {
            'sport_type': sport_type,
            'equipment_type': equipment_type
        };
        return options;
    }
    //加载模板内容,callback通常用于执行一次的方法，如事件监听
    function loadTemplate(fromId, toId, callback) {
        var fromContainer = document.getElementById(fromId);
        var toContainer = document.getElementById(toId);
        if (fromContainer && toContainer && toContainer.childElementCount == 0) {
            //判断是否已经加载过模板
            toContainer.innerHTML = fromContainer.innerHTML;
            if (typeof callback === 'function') {
                callback();
            }
        }
    }
    //跑步类型中根据不同用法展示不同的选项
    function runTypeSelectEvent() {
        $('input[name=rs_run_type]').on('click', function() {
            switch (this.value) {
                case 'MARATHON':
                    //马拉松
                    $('#rs_sex_weight_container').show();
                    $('#tr_country_type_container').show();
                    $('#dialy_container').hide();
                    break;
                case 'RECOVER':
                    //恢复性
                    $('#rs_sex_weight_container').show();
                    $('#tr_country_type_container').hide();
                    $('#dialy_container').hide();
                    break;
                case 'CROSS_COUNTRY':
                    //越野
                    $('#rs_sex_weight_container').hide();
                    $('#tr_country_type_container').show();
                    $('#dialy_container').hide();
                    break;
                case 'FASHION':
                    //时尚
                    $('#rs_sex_weight_container').hide();
                    $('#tr_country_type_container').hide();
                    $('#dialy_container').hide();
                    break;
                case 'DIALY':
                    //日常
                    $('#rs_sex_weight_container').show();
                    $('#tr_country_type_container').hide();
                    $('#dialy_container').show();
                    break;
            }
        });
    }

    function basketballTypeSelecteEvent() {
        $('input[name=position]').on('click', function() {
            switch (this.value) {
                case 'POSITION_S':
                case 'POSITION_SF':
                    $('#s_sf_container').show();
                    $('#pf_c_container').hide();
                    break;
                case 'POSITION_PF':
                case 'POSITION_C':
                    $('#s_sf_container').hide();
                    $('#pf_c_container').show();
                    break;
            }
        });
    }

    function tennisTypeSelectEvent() {
        $('input[name=tr_level]').on('click', function() {
            var value = this.value;
            if (value == 'UNKNOW') {
                $('#tennis_racket_price').show();
                $('input[name=tr_price]')[0].click();
            } else {
                $('#tennis_racket_price').hide();
                SPORT['TENNIS']['RACKET']['price'] = 'NONE'; //价格恢复
            }
        })
    }

    function _selectEvent(sport_type, prefix) {
        //循环装备类型
        $.each(SPORT[sport_type], function(e_type, e_opts) {
            //循环装备类型的选项
            $.each(e_opts, function(e_opt, v) {
                var _e_opt = prefix + e_opt;
                $('input[name=' + _e_opt + ']').on('click', function() {
                    SPORT[sport_type][e_type][e_opt] = this.value;
                });
            });
        });
    }
    var SELECT_EVENT = {
        'RUN': function() {
            _selectEvent('RUN', 'rs_');
            runTypeSelectEvent();
        },
        'TENNIS': function() {
            _selectEvent('TENNIS', 'tr_');
            tennisTypeSelectEvent();
        },
        'BASKETBALL': function() {
            _selectEvent('BASKETBALL', '');
            basketballTypeSelecteEvent();
        }
    }

    //打开结果对话框
    function resultDialogOpen(result, slogan) {
        require.async('dialog', function(Dialogx) {
            
            var dialog = new Dialogx({
                'id': 'result_container',
                'template_id': 'result_dialog_container',
                'onContainerInit': function() {
                    var that = this;
                    document.getElementById('btn_close_dialog')
                        .addEventListener('click', function() {
                            that.hide();
                        });
                    document.getElementById('close_btn')
                        .addEventListener('click', function() {
                            that.hide();
                        })
                },
                'onBeforeDialogOpen': function() {
                    hideCharector();
                    $('#slogan_desc').html(slogan.desc[0] + slogan.desc[2] + '的' + slogan.desc[1]);
                    $('#slogan_sent').html(slogan.sent);
                    $('#slogan_shoesDesc').html(slogan.shoseDesc.join(','));
                    if (result.match_result.length > 3) {
                        result.match_result.length = 3;
                    }
                    if (result.similar_result > 6) {
                        result.similar_result = 6;
                    }
                    // 精确匹配结果
                    $('#total').html(result.match_result.length);
                    var _htmlArr = [];
                    $.each(result.match_result, function(index, ele) {
                        _htmlArr.push('<div class="result-container">');
                        _htmlArr.push('<img src="' + ele.image + '">' +
                            '<div style="color:red;padding-bttom:10px;">' + ele.brand + '</div><span>' + ele.name + '</span>');
                        _htmlArr.push('</div>');

                    });
                    $('#result_shose').html(_htmlArr.join(''));
                    // 模糊匹配结果
                    if (result.similar_result.length > 0) {
                        $('#similar_total').html(result.similar_result.length);
                        var _htmlArr = [];
                        $.each(result.similar_result, function(index, ele) {
                            _htmlArr.push('<div class="result-container">');
                            _htmlArr.push('<img src="' + ele.image + '">' +
                                '<div style="color:red;padding-bttom:10px;">' + ele.brand + '</div><span>' + ele.name + '</span>');
                            _htmlArr.push('</div>');
                        });
                        $('#similar_result_shose').html(_htmlArr.join(''));
                        $('#similar_contianer').show();
                    } else {
                        $('#similar_contianer').hide();
                    }
                }
            });
            dialog.show();
        });
    }
    function showCharector(){
        $("#js_wrap").addClass("running");
    }
    function hideCharector(){
        $("#js_wrap").removeClass("running");
    }
    $(document).ready(function() {
        $('input[name=sport_type]').click(function() {
            var sport_type = this.value;
            var _st = sport_type.toLowerCase();
            loadTemplate(_st + '_opts_template', _st + '_opts_container', SELECT_EVENT[sport_type]);
            if (sport_type == 'BASKETBALL') {
                $('#basketball_opts_container').show();
                $('#tennis_opts_container').hide();
                $('#run_opts_container').hide();
            } else if (sport_type == 'TENNIS') {
                $('#basketball_opts_container').hide();
                $('#tennis_opts_container').show();
                $('#run_opts_container').hide();
            } else if (sport_type == 'RUN') {
                $('#run_opts_container').show();
                $('#basketball_opts_container').hide();
                $('#tennis_opts_container').hide();
            }
        });
        //默认选中篮球，把篮球的选项展示出来
        $('#basketball').click();
        //确定选装
        $('#submit').click(function() {
            showCharector();
            require.async(['js/AIChoose.js', 'js/equipment.js'], function(AICE, EQUIPMENT) {
                var opt = getSelectOptions();
                
                EQUIPMENT.get(opt.sport_type, opt.equipment_type, function(_info) {
                    var info = getSelectInfo(opt, _info);
                    var chooseEquipment = new AICE(info.options); //初始化选装逻辑            
                    var result = chooseEquipment.init()
                        .AIChoose(info.equipment_info, info.select_items), //传入装备信息和选项
                        slogan = chooseEquipment.getMatchSlogan(info.select_items); //传入选项
                    console.log(slogan);
                    resultDialogOpen(result, slogan);
                });

            })
        });
    });
});
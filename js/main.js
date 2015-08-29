define(function(require) {
    var EQUIPMENT = require('js/equipment.js');
    var AICE = require('js/AIChoose.js');
    var $ = require('jquery');
    var Dialogx = require('dialog');
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
                'area': 'AREA_ALL',
                'strength': 'ALL',
                'style': 'CONTROL'
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
    $(document).ready(function() {
        //默认选中篮球，把篮球的选项展示出来
        $('input[name=sport_type]').change(function() {
            var sport_type = this.value;
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
            //把结果展示暂时隐藏
            $('#result_container').hide();
        });
        //选项点击事件
        $.each(SPORT, function(sport_type, value) {
            //循环装备类型
            $.each(value, function(e_type, e_opts) {
                //循环装备类型的选项
                $.each(e_opts, function(e_opt, v) {
                    var _e_opt = e_opt;
                    if (sport_type == 'TENNIS') {
                        _e_opt = 'tr_' + e_opt;
                    } else if (sport_type == 'RUN') {
                        _e_opt = 'rs_' + e_opt;
                    }
                    $('input[name=' + _e_opt + ']').on('click', function() {
                        SPORT[sport_type][e_type][e_opt] = this.value;
                    });
                });
            })
        });
        //跑步类型中根据不同用法展示不同的选项
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
        //确定选装
        $('#submit').click(function() {
            $('#result_container').show();
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
            }
            var chooseEquipment = new AICE(options);
            var result = chooseEquipment.init().AIChoose(EQUIPMENT[sport_type][equipment_type], SPORT[sport_type][equipment_type]);
            var slogan = chooseEquipment.getMatchSlogan(SPORT[sport_type][equipment_type]);
            console.log(slogan);
            var dialog = new Dialogx({
                'id': 'result_container',
                'template_id':'result_dialog_container',
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
                    $('#slogan_desc').html(slogan.desc[0] + slogan.desc[2] + '的' + slogan.desc[1]);
                    $('#slogan_sent').html(slogan.sent);
                    $('#slogan_shoesDesc').html(slogan.shoseDesc.join(','));

                    // 精确匹配结果
                    $('#total').html(result.match_result.length);
                    var _htmlArr = [];
                    $.each(result.match_result, function(index, ele) {
                        _htmlArr.push('<div class="result-container">');
                        _htmlArr.push('<img src="' + ele.image + '">' +
                            '<span>' + ele.name + '</span>');
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
                                '<span>' + ele.name + '</span>');
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
    });

});
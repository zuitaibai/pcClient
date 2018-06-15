$('.wraper_d').on('click.detail', '#showTel', function() {
    $('#telArea').show();
    $(this).hide();
}).on('click.detail', '#s', function() {
    app.ui.popOpen('./pop_goodsReject.html', {
        noClose: true
    });
})

var felist = [
    '<p class="ind0 ffzh"><label>车主电话</label><span>13342202787</span></p>',
    '<p class="ind1 ffzh"><label>已支付信息费</label><span class="b yellow">0元</span></p>',
    '<p class="ind2 ffzh"><label>支付时间</label><span>2018-05-30  10:24</span></p>',
    '<p class="ind3 ffzh"><label>同意装货时间</label><span>2018-05-30  10:24</span></p>',
    '<p class="ind4 ffzh"><label>支付方式</label><span>微信支付</span></p>',
    '<p class="ind5 ffzh"><label>原因</label><span>发货方拒绝装货</span></p>'
];

var btns = [
    '<a class="ind0 btn_1  btn_green" href="javascript:;">支付信息费</a>',
    '<a class="ind1 btn_1  btn_blue" href="javascript:;">直接发布</a>',
    '<a class="ind2 btn_1  btn_blue" href="javascript:;">设置成交</a>',
    '<a class="ind3 btn_1  btn_blue" href="javascript:;">异常上报</a>',
    '<a class="ind4 btn_1  btn_blue" href="javascript:;">同意成交</a>',
    '<a class="ind5 btn_1border" href="javascript:;">拒绝成交</a>',
    '<a class="ind6 btn_1border" href="javascript:;">搜狗地图</a>',
    '<a class="ind7 btn_1border" href="javascript:;">百度地图</a>',
    '<a class="ind8 btn_1border" href="javascript:;">编辑再发布</a>',
    '<a class="ind9 btn_1border" href="javascript:;">撤销货源</a>'
];

var pcTool = {
    userTopTitle: function(data, userStr) {
        var favorites = '<span class="fl favorites"><a class="fl" href="javascript:;">收藏</a></span>'
        var report = '<span class="fl report"><a class="fl" href="javascript:;">举报</a></span>'
        if (!userStr) {
            Totle = favorites + report;
        } else if (userStr == 'favorites') {
            Totle = favorites;
        } else if (userStr == 'report') {
            Totle = report;
        } else if (userStr == 'off') {
            Totle = '';
        }
        var user = '<div class="clr top" id="userTopTitle">\
            <div class="fl photo"><!--<img src="" alt="">--></div>\
            <div class="fl userinfo">\
                <p>用 户 名：<span class="b span1">金桥货运</span></p>\
                <p>信&emsp;誉：<span class="span2">100</span></p>\
                <p>首次发布：<span class="red b span3">09：48：28</span></p>\
            </div>\
            <div class="fl identificate-ico identificate-ico-yet"></div><!--identificate-ico-mid identificate-ico-no-->\
            <div class="fr sm-ico">' + Totle + '</div>\
        </div>';
        return user;
    },
    startToEnd: function(data, placeStr) {
        if (!placeStr) {
            var placeStart = '',
                placeEnd = '';
        } else if (placeStr == 'on') {
            var placeStart = '<p>河北保定市徐水县连七八糟区58号院</p>';
            var placeEnd = '<p>山东菏泽曹县连七八糟区58号院</p>';
        }
        var place = '<div class="b neck" id="startToEnd">\
            <div class="start">\
                <strong>山西太原市杏花岭区</strong>' + placeStart + '\
            </div>\
            <div class="end">\
                <strong>山东菏泽市曹县</strong>' + placeEnd + '\
            </div>\
            <div class="goods">\
                <strong>200挖机</strong>\
            </div>\
        </div>';
        return place;
    },
    goodsInfo: function(data, infoStr) {
        if (!infoStr) {
            var infoPhone = '';
        } else if (infoStr == 'on') {
            var infoPhone = '<li class="blue last"><em id="telArea"><label>电话：</label><span>13568890668</span></em><a id="showTel" href="javascript:;">查看电话 >></a></li>'
        }
        var information = '<ul class="ful sinfo" id="goodsInfo">\
            <li><label>重量：</label><span>50吨</span></li>\
            <li><label>尺寸：</label><span></span></li>\
            <li><label>运价：</label><span></span></li>\
            <li><label>备注：</label><span></span></li>' + infoPhone + '\
        </ul>';
        return information;
    },
    goodsDetail: function(data, infoList, detailBtnStr, waybill) {
        if (!detailBtnStr) {
            var btn_green = '';
        } else if (detailBtnStr == 'on') {
            var btn_green = '<a class="btn_1 btn_green" href="javascript:;" id="s">装货完成</a>'
        }
        if (!waybill) {
            var bill = '<span class="fr">运单号：<span>201825302344395924</span></span>'
        } else if (waybill == 'off') {
            var bill = ''
        }
        var infoDetail = '<div class="feeDetail" id="goodsDetail">\
            <div class="clr fftit">\
                <strong class="fl">信息费详情</strong>' + bill + '\
            </div>\
            <div id="theDetail">' + infoList + '</div>' + btn_green + '\
        </div>';
        return infoDetail;
    },
    reportInfo: function(data, reportStr) {
        var infoReport = '<div class="catch_report" id="reportInfo">\
            <div class="clr fftit">\
                <strong class="fl">异常上报</strong>\
            </div>\
            <p class="ffzh"><label>异常上报状态</label><span class="blue">待处理</span></p>\
            <p class="ffzh"><label>异常上报时间</label><span>2018-05-30  10:24</span></p>\
        </div>';
        return infoReport;
    },
    customerTel: function(data, custStr) {
        var customer = '<div class="b ffoot" id="customerTel">\
            <p class="blue">客服电话&emsp;400-6688-998</p>\
        </div>';
        return customer;
    },
    footbtns: function(data, btnStr) {
        var btnBox = '<div class="footbtns" id="footbtns">' + btnStr + '</div>';
        return btnBox;
    },
    refuseAll: function(data, allStr) {
        var refuse = '<div class="footbtns2" id="refuseAll">\
            <a class="btn_1 btn_blue_big" href="javascript:;">拒绝所有车主</a>\
        </div>';
        return refuse;
    }
}

/*
load DOM Name:

*/
// var loadStateStr = {
//     zfxxf:
// }
function loadState(str) {
    var strTo = ''
    switch (str) {
        case 'XinXiFeiZhiFu':
            strTo = pcTool.userTopTitle() + pcTool.startToEnd() + pcTool.goodsInfo('', 'on') + pcTool.footbtns('', btns[0] + btns[6] + btns[7])
            break;
        case 'DaiTongYi1':
            strTo = pcTool.userTopTitle('', 'favorites') + pcTool.startToEnd() + pcTool.goodsInfo('', 'on')
            break;
        case 'DaiTongYi2':
            strTo = pcTool.startToEnd('', 'on') + pcTool.goodsInfo() + pcTool.goodsDetail('', felist[0] + felist[1] + felist[0] + felist[4], '') + pcTool.footbtns('', btns[4] + btns[5]) + pcTool.refuseAll()
            break;
        case 'ZhuangHuoZhong':
            strTo = pcTool.startToEnd() + pcTool.goodsInfo() + pcTool.goodsDetail('', felist[0] + felist[1] + felist[0] + felist[4], '') + pcTool.footbtns('', btns[3]);
            break;
        case 'ZhuangHuoWanCheng':
            strTo = pcTool.startToEnd() + pcTool.goodsInfo() + pcTool.goodsDetail('', felist[0] + felist[1] + felist[0] + felist[4], '');
            break;
        case 'FaBuZhong':
            strTo = pcTool.startToEnd('', 'on') + pcTool.goodsInfo() + pcTool.footbtns('', btns[2] + btns[9])
            break;
        case 'YiCheXiaoGuoQi':
            strTo = pcTool.startToEnd('', 'on') + pcTool.goodsInfo() + pcTool.footbtns('', btns[1] + btns[8])
            break;
        case 'DaiZhiFu':
            strTo = pcTool.userTopTitle('', 'favorites') + pcTool.startToEnd() + pcTool.goodsInfo('', 'on') + pcTool.footbtns('', btns[0])
            break;
        case 'DaiZhuangHuo':
            strTo = pcTool.userTopTitle('', 'off') + pcTool.startToEnd() + pcTool.goodsInfo('', 'on') + pcTool.goodsDetail('', felist[1] + felist[2] + felist[3], 'on');
            break;
        case 'YiChengJiao':
            strTo = pcTool.userTopTitle('', 'off') + pcTool.startToEnd() + pcTool.goodsInfo('', 'on') + pcTool.goodsDetail('', felist[1] + felist[2] + felist[3]);
            break;
        case 'JuJueTuiFei':
            strTo = pcTool.userTopTitle('', 'report') + pcTool.startToEnd() + pcTool.goodsInfo('', 'on') + pcTool.goodsDetail('', felist[1] + felist[5], '', 'off') + pcTool.customerTel();
            break;
        case 'WeiYueYiChang':
            strTo = pcTool.userTopTitle('', 'report') + pcTool.startToEnd() + pcTool.goodsInfo('', 'on') + pcTool.goodsDetail('', felist[1] + felist[5]) + pcTool.reportInfo() + pcTool.customerTel();
            break;
        case 'WeiYue':
            strTo = pcTool.startToEnd('', 'on') + pcTool.goodsInfo('', 'on') + pcTool.goodsDetail('', felist[1] + felist[5]) + pcTool.reportInfo() + pcTool.customerTel();
            break;
    }
    $('#detailMain').append(strTo)
}
loadState('WeiYue')


// var feeDetail = [
//     '<p class="ffzh"><label>车主电话</label><span>13342202787</span></p>',
//     '<p class="ffzh"><label>已支付信息费</label><span class="b yellow">0元</span></p>',
//     '<p class="ffzh"><label>支付时间</label><span>2018-05-30  10:24</span></p>',
//     '<p class="ffzh"><label>同意装货时间</label><span>2018-05-30  10:24</span></p>',
//     '<p class="ffzh"><label>支付方式</label><span>微信支付</span></p>',
//     '<p class="ffzh"><label>原因</label><span>发货方拒绝装货</span></p>'
// ];
// $('#theDetail').html(feeDetail.join('\n'));
// var btns = [
//     '<a class="btn_1  btn_green" href="javascript:;">支付信息费</a>',
//     '<a class="btn_1  btn_blue" href="javascript:;">直接发布</a>',
//     '<a class="btn_1  btn_blue" href="javascript:;">设置成交</a>',
//     '<a class="btn_1  btn_blue" href="javascript:;">异常上报</a>',
//     '<a class="btn_1  btn_blue" href="javascript:;">同意成交</a>',
//     '<a class="btn_1border" href="javascript:;">拒绝成交</a>',
//     '<a class="btn_1border" href="javascript:;">搜狗地图</a>',
//     '<a class="btn_1border" href="javascript:;">百度地图</a>',
//     '<a class="btn_1border" href="javascript:;">编辑再发布</a>',
//     '<a class="btn_1border" href="javascript:;">撤销货源</a>'
// ];
// $('#footbtns').html(btns.join('\n'));

$('#detailMain').on('loads', function(event, params) {
    params = params || {};
    if (!params.id) return;
    init(params.id);
});
var id = app.util.getQueryString('id');
if (id) init(+id);

function init(id) {
    console.log(id);
}
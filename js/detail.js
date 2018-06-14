$('.pop_event').on('click.pop', '#showTel', function() {
    $('#telArea').show();
    $(this).hide();
});
// var feeDetail = {
//     fee0: '<p class="ffzh"><label>车主电话</label><span>13342202787</span></p>',
//     fee1: '<p class="ffzh"><label>已支付信息费</label><span class="b yellow">0元</span></p>',
//     fee2: '<p class="ffzh"><label>支付时间</label><span>2018-05-30  10:24</span></p>',
//     fee3: '<p class="ffzh"><label>同意装货时间</label><span>2018-05-30  10:24</span></p>',
//     fee4: '<p class="ffzh"><label>支付方式</label><span>微信支付</span></p>',
//     fee5: '<p class="ffzh"><label>原因</label><span>发货方拒绝装货</span></p>'
// };
// var btns = {
//     btn0: '<a class="btn_1  btn_green" href="javascript:;">支付信息费</a>',
//     btn1: '<a class="btn_1  btn_blue" href="javascript:;">直接发布</a>',
//     btn2: '<a class="btn_1  btn_blue" href="javascript:;">设置成交</a>',
//     btn3: '<a class="btn_1  btn_blue" href="javascript:;">异常上报</a>',
//     btn4: '<a class="btn_1  btn_blue" href="javascript:;">同意成交</a>',
//     btn5: '<a class="btn_1border" href="javascript:;">拒绝成交</a>',
//     btn6: '<a class="btn_1border" href="javascript:;">搜狗地图</a>',
//     btn7: '<a class="btn_1border" href="javascript:;">百度地图</a>',
//     btn8: '<a class="btn_1border" href="javascript:;">编辑再发布</a>',
//     btn9: '<a class="btn_1border" href="javascript:;">撤销货源</a>'
// };


var feeDetail = [
    '<p class="ffzh"><label>车主电话</label><span>13342202787</span></p>',
    '<p class="ffzh"><label>已支付信息费</label><span class="b yellow">0元</span></p>',
    '<p class="ffzh"><label>支付时间</label><span>2018-05-30  10:24</span></p>',
    '<p class="ffzh"><label>同意装货时间</label><span>2018-05-30  10:24</span></p>',
    '<p class="ffzh"><label>支付方式</label><span>微信支付</span></p>',
    '<p class="ffzh"><label>原因</label><span>发货方拒绝装货</span></p>'
];
$('#theDetail').html(feeDetail.join('\n'));
var btns = [
    '<a class="btn_1  btn_green" href="javascript:;">支付信息费</a>',
    '<a class="btn_1  btn_blue" href="javascript:;">直接发布</a>',
    '<a class="btn_1  btn_blue" href="javascript:;">设置成交</a>',
    '<a class="btn_1  btn_blue" href="javascript:;">异常上报</a>',
    '<a class="btn_1  btn_blue" href="javascript:;">同意成交</a>',
    '<a class="btn_1border" href="javascript:;">拒绝成交</a>',
    '<a class="btn_1border" href="javascript:;">搜狗地图</a>',
    '<a class="btn_1border" href="javascript:;">百度地图</a>',
    '<a class="btn_1border" href="javascript:;">编辑再发布</a>',
    '<a class="btn_1border" href="javascript:;">撤销货源</a>'
];
$('#footbtns').html(btns.join('\n'));

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
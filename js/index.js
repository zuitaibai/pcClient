/*//app.util.openWin('./detail.html','', {width:700, height:600,params:{id:$(this).attr('data-id')}} );
    app.util.openWin('./confirm.html','',
        {
            width:700,height:200,
            params:{
                ok:'确 定',content:'不是我的是你的',
                okcbk:function(){
                    alert('弹窗回调！');
                    return !confirm('是否关闭弹窗？');
                }
            }
        }
    );*/
var tabLocalMap = {
    'all': '全部订单',
    'yetFinish': '已完成',
    'waitAgree': '待同意',
    'waitPay': '待支付',
    'waitShipment': '待装货',
    'reject': '拒绝/退费',
    'catch': '违约/异常'
},
tabLocal2ServerMap = {
    'waitPay': 1, //待支付
    'waitAgree': 2, //待同意
    'waitShipment': 3, //待装货
    'yetFinish': 4, //已完成
    'reject': 5 //拒绝/退费
},
tabLocal2ServerMap_allBook = {
    '0': 'waitPay', //待支付
    '1': 'waitAgree', //待同意
    '4': 'waitShipment', //待装货
    '5': 'yetFinish', //已完成
    '6': 'yetFinish',
    '2': 'reject', //拒绝/退费
    '3': 'reject',
    '7': 'catch'
},
dataReceiptMap = {//接单状态
    '0': '待接单',
    '1': '接单成功',
    '2': '货主拒绝',
    '3': '系统拒绝',
    '4': '同意装货',
    '5': '车主装货完成',
    '6': '系统装货完成',
    '7': '异常上报', //--
    '8': '货主撤销货源退款',
    '9': '系统撤销货源退款',
    '10': '车主取销装货',
    '11': '接单失败' //（用户同意别人装货，对没有支付成功的支付信息的操作状态）
},
catchType = {
    '2':{ '1':'车主爽约', '2':'其他' },
    '1':{
        '1': '发货方爽约',
        '2': '货被他人拉走',
        '3': '实际货物信息与描述不符',
        '4': '装货时间延长，信息费延迟结算。',
        '5': '虚假信息',
        '6': '运价纠纷',
        '7': '不想拉了',
        '8': '其他'
    }
};

//图片预加载
$.each(app.conf.btnImgPreload||[], function(i,v){
    var img = new Image();
    img.src = v;
});

//height
var heightTimer;
$(window).on('resize',function(){
    clearTimeout(heightTimer);
    heightTimer = setTimeout(function(){
        forPageWhiteBg_height();
        if($('#detail_w').is(':visible')) app.ui.detailHeightZomm();
    },30);
}).trigger('resize');

//postDataTemp;
var postDataBase = {
    url: app.conf.api.listAll,
    //queryID	必填	Integer	下拉是0，上滑是最小sortId；（首次queryID=0）
    //queryActionType	必填	Integer	 1下拉，2上滑；（首次queryActionType=1）
    data: $.extend({}, app.work.getCommonParamsObj(), {queryActionType:1, queryID:0}),
    key: 'all'
},
postDataTemp = {};

//tab
$('#tabs>li').on('click',function(){
    changeTab($(this).index());
}).eq(0).trigger('click');

$('#list-tbody').on('click','.btn_index_detail',function(){
    var id = $(this).closest('tr').attr('data-id') || '';
    app.ui.detailOpen('./detail.html',{
        overlay:true,
        cbk: function(){  $('#detailMain').trigger('loads',{id:id}); }
    });
});

$('#linkBtn_loadMore').on('click',request);

function changeTab(eq) {
    postDataTemp = $.extend(true,{},postDataBase);
    $('#list-tbody').html('');
    var li = $('#tabs>li:eq('+eq+')'), key = postDataTemp.key = li.attr('data-t');
    li.children('a').attr('class','btn_2 btn_blue2').end().siblings().find('a').attr('class','btn_2border');
    $('#list-thead>tr.thead_'+key).show().siblings().hide();
    if(key==='all'){
        postDataTemp.url = app.conf.api.listAll;
    }else if(key==='catch'){
        postDataTemp.url = app.conf.api.listCatch;
        $.extend(postDataTemp.data, {queryMenuType: 1}); //1车主上报，2货主上报
    }else{
        postDataTemp.url = app.conf.api.listReceiptYet;
        $.extend(postDataTemp.data, {queryMenuType: tabLocal2ServerMap[key]}); //1待支付 2待同意 3待装货 4已完成 5决绝退费
    }
    request();
}
function request(){
    var key = postDataTemp.key, ifMore = false;
    if(postDataTemp.data.queryID!=0) postDataTemp.data.queryActionType = 2, ifMore = true;
    app.ajax.post(postDataTemp.url, {
        data: postDataTemp.data,
        success:function(data){
            //处理气泡
            $('#tabs .tabpop').hide();
            if(data.data.bubbleNumbers && data.data.bubbleNumbers.length){
                $.each(data.data.bubbleNumbers,function(i,v){
                    if(v.number>0) $('#tabs>li[data-type2='+v.type2+']').children('.tabpop').show().children('span').text(v.number);
                });
            }
            //有数据
            if(data.data.data){
                var len = data.data.data.length || 0;
                if(len){
                    postDataTemp.data.queryID = data.data.data[len-1]['sortId']||0;
                    var html = baidu.template('tr_tmp_'+key, {list:data.data.data});
                    $('#list-tbody')[ifMore?'append':'html'](html);
                }
                var showMore = $('#listLoadMore').show();
                //todo:
                //if(len<app.util.getQueryString('条数')) showMore.children('span').show().siblings().hide();
                if(len<5) showMore.children('span').show().siblings().hide();
                else showMore.children('a').show().siblings().hide();
            }
            //无数据
            else{
                if(ifMore){
                    $('#listLoadMore').show().children('span').show().siblings().hide();
                }else{//首次加载
                    var colspan = $('#list-thead>tr.thead_'+key+'>th').length || 1;
                    $('#list-tbody').html('<td colspan="'+colspan+'"><p style="line-height:50px;text-align:center;color:#ccc;">暂无数据</p></td>');
                    $('#listLoadMore').hide();
                }
            }
        }
    });
}
function forPageWhiteBg_height(){
    var ht = $('.wraper').height() - $('.header').height() - 2 - 1;
    $('.main').css('height',ht);
}

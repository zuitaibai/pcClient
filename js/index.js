/*//app.util.openWin('./detail.html','', {width:700, height:600,params:{goodsId:$(this).attr('data-id')}} );
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
var
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
    '7': 'catchs'
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

$('#list-tbody').on('click','.ATdetail',function(){ //详情
    var goodsId = $(this).closest('tr').attr('data-id') || '';
    app.ui.detailOpen('./detail.html',{
        overlay:true,
        cbk: function(){  $('#detailMain').trigger('loads',{goodsId:goodsId, detailType:3}); }
    });
}).on('click','.ATpay',function(){ //继续支付
    var goodsId = $(this).closest('tr').attr('data-id') || '';
    var tsOrderNo = $(this).closest('tr').attr('data-tsOrderNo') || '';
    app.ui.popOpen('./pop_mediFeePay.html',{
        noClose:true,
        cbk: function(){  $('#mediFeePay_warp').trigger('loads',{tsOrderNo: tsOrderNo}); }
    });
}).on('click','.ATport',function(){ //异常上报
    var goodsId = $(this).closest('tr').attr('data-id') || '';
    var tsOrderNo = $(this).closest('tr').attr('data-tsOrderNo') || '';
    app.ui.popOpen('./pop_catchPortForm.html',{
        noClose:true,
        cbk: function(){  $('#catchPortForm_warp').trigger('loads',{exParty: 1, tsOrderNo:tsOrderNo}); } //exParty: 1车主上报，2货主上报
    });
}).on('click','.ATshipmented',function(){ //装货完成
    var goodsId = $(this).closest('tr').attr('data-id') || '';
    var tsOrderNo = $(this).closest('tr').attr('data-tsOrderNo') || '';
    app.ui.popOpen('./pop_goodsFinish.html',{
        noClose:true,
        cbk: function(){  $('#goodsFinish_warp').trigger('loads',{tsOrderNo:tsOrderNo}); }
    });
});

$('#linkBtn_loadMore').on('click',request);

function changeTab(eq) {
    postDataTemp = $.extend(true,{},postDataBase);
    $('#list-tbody').html('');
    $('#listLoadMore').hide();
    var li = $('#tabs>li:eq('+eq+')'), key = postDataTemp.key = li.attr('data-t');
    li.children('a').attr('class','btn_2 btn_blue2').end().siblings().find('a').attr('class','btn_2border');
    $('#list-thead>tr.thead_'+key).show().siblings().hide();
    if(key==='all'){
        postDataTemp.url = app.conf.api.listAll;
    }else if(key==='catchs'){
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
                    console.log(key);
                    postDataTemp.data.queryID = data.data.data[len-1]['sortId']||0;
                    var html = baidu.template('tr_tmp_'+key, {list:data.data.data});
                    $('#list-tbody')[ifMore?'append':'html'](html);
                }
                var showMore = $('#listLoadMore').show();
                if(len<app.conf.listRequestCounts) showMore.children('span').show().siblings().hide();
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

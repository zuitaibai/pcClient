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
$(window).on('resize',forPageWhiteBg_height).trigger('resize');

//tab
$('#tabs>li').on('click',function(){
    changeTab($(this).index());
}).eq(0).trigger('click');

$('#list-tbody').on('click','.btn_index_detail',function(){
    var id = $(this).closest('tr').attr('data-id') || '';
    app.ui.detailOpen('./detail.html',{
        cbk: function(){ $('#detailMain').trigger('loads',{id:id}); }
    });
});
$('#b').on('change',function(){
    var v = $(this).val();
    if(!v) return;
    app.ui.popClose();
    app.ui.popOpen('./'+v,{noClose:true});
});
$('#c').on('change',function(){
    var v = $(this).val();
    if(!v) return;
    app.ui.popClose();
    app.ui.popOpen('./'+v);
});
$('#list-tbody')
    .on('click','.link_btn_catch',function(){

    })
    .on('click','.link_btn_pop',function(){

    });

function changeTab(eq) {
    $('#list-tbody').html('');
    var li = $('#tabs>li:eq('+eq+')'), key = li.attr('data-t');
    li.children('a').attr('class','btn_2 btn_blue2').end().siblings().find('a').attr('class','btn_2border');
    $('#list-thead>tr.thead_'+key).show().siblings().hide();
    var url, postData = app.work.getCommonParamsObj();
    if(key==='all'){
        url = app.conf.api.listAll;
    }else if(key==='catch'){
        url = app.conf.api.listCatch;
        $.extend(postData, {queryMenuType: 1}); //1车主上报，2货主上报
    }else{
        url = app.conf.api.listReceiptYet;
        $.extend(postData, {queryMenuType: tabLocal2ServerMap[key]}); //1待支付 2待同意 3待装货 4已完成 5决绝退费
    }
    app.ajax.post(url, {
        //queryID	必填	Integer	下拉是0，上滑是最小sortId；（首次queryID=0）
        //queryActionType	必填	Integer	 1下拉，2上滑；（首次queryActionType=1）
        data: $.extend(postData, {queryActionType:1, queryID:0}),
        success:function(data){
            //处理气泡
            $('#tabs .tabpop').hide();
            if(data.data.bubbleNumbers && data.data.bubbleNumbers.length){
                $.each(data.data.bubbleNumbers,function(i,v){
                    if(v.number>0) $('#tabs>li[data-type2='+v.type2+']').children('.tabpop').show().children('span').text(v.number);
                });
            }
            //有数据
            if(data.data.data && data.data.data.length){
                $('#list-tbody').html(baidu.template('tr_tmp_'+key, {list:data.data.data}));
            }
            //无数据
            else{
                var colspan = 1;
                if(key==='all'||key==='waitPay') colspan = 6;
                else if(key==='waitAgree'||key==='waitShipment'||key==='yetFinish'||key==='reject') colspan = 7;
                else if(key==='catch') colspan = 9;
                $('#list-tbody').html('<td colspan="'+colspan+'"><p style="line-height:50px;text-align:center;color:#ccc;">暂无数据</p></td>');
            }
        }
    });
}
function forPageWhiteBg_height(){
    var ht = $('.wraper').height() - $('.header').height() - 2 - 1;
    $('.main').css('height',ht);
}

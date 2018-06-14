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
    'yetFinish': '已成交',
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
    'yetFinish': 4, //已成交
    'reject': 5 //拒绝/退费
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
};

//图片欲加载
$.each(app.conf.btnImgPreload||[], function(i,v){
    var img = new Image();
    img.src = v;
});

//height
$(window).on('resize',forPageWhiteBg_height).trigger('resize');

//tab
$('#tabs>li').on('click',function(){
    changeTab($(this).index());
});

$('#a').on('click',function(){
    app.ui.detailClose();
    app.ui.detailOpen('./detail.html',{
        cbk: function(){ $('#detailMain').trigger('loads',{id:889}); }
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
        $.extend(postData, {queryMenuType: tabLocal2ServerMap[key]}); //1待支付 2待同意 3待装货 4已成交 5决绝退费
    }
    app.ajax.post(url, {
        //queryID	必填	Integer	下拉是0，上滑是最小sortId；（首次queryID=0）
        //queryActionType	必填	Integer	 1下拉，2上滑；（首次queryActionType=1）
        data: $.extend(postData, {queryActionType:1, queryID:0}),
        success:function(d){
            d = {
                code:200,
                data:{
                    data: {

                    },
                    bubbleNumbers:{

                    }
                },
                msg: ''
            };
            $('#list-tbody').html(baidu.template('tr_tmp_'+key, d.data));
        }
    });
    $('#list-tbody').html(baidu.template('tr_tmp_'+key, {}));

}
function forPageWhiteBg_height(){
    var ht = $('.wraper').height() - $('.header').height() - 2 - 1;
    $('.main').css('height',ht);
}

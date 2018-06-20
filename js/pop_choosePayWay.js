var transportOrderNum, orderId, wechatTimer, wechatXHR;
$('.pop_event').on('click.pop','#pop_btn_ok_choosePay',function(){
    var checked = $('input[name=payway]:checked','#payway_list').val();
    var postData = app.work.getCommonParamsObj();
    postData.transportOrderNum = transportOrderNum;
    postData.payChannelId = checked;
    app.ajax.post(app.conf.api.sbtPay,{
        data: postData,
        success:function(data){
            if(data.code==200){
                if(!data.data) return;
                if(checked==7){//alipay
                    $('<div/>').css({display:'none'}).html(data.data).appendTo('body');
                    $('#getResult_alipay').show();
                }else if(checked==8){//wechat
                    $('#showCodeImg_wechat').show().find('img').attr('src',app.conf.api.createCodeImg+'?payUrl='+data.data);
                    setTimeout(function(){
                        wechatTimer = setInterval(function(){
                            if(wechatXHR && wechatXHR.abort) wechatXHR.abort();
                            var postData = app.work.getCommonParamsObj();
                            postData.orderId = orderId;
                            postData.payChannel = 'WeChat'; //支付渠道编码Ali  WeChat
                            wechatXHR = app.ajax.post(app.conf.api.getPayResult,{
                                data: postData,
                                success:function(data){
                                    if(data.code==200){//0：待支付；1：支付失败；2：支付成功；
                                        if(data.data==0) ;
                                        else{
                                            //todo: 用户操作动作什么契机关掉轮询
                                            clearTimeout(wechatXHR);
                                            if(data.data==1) app.ui.popOpen('./pop_payFail.html');
                                            else if(data.data==2) app.ui.popOpen('./pop_paySuccess.html');
                                        }
                                    }
                                }
                            });
                        },5000);
                    },10000);
                }
            }
        }
    });
}).on('click.pop','#btn_cannelResult_alipay',function(){
    $('#getResult_alipay').hide();
}).on('click.pop','#btn_close_showCodeImg_wechat',function(){
    $('#showCodeImg_wechat').hide();
}).on('click.pop','#pop_btn_cannel_choosePay',function(){
    clearTimeout(wechatTimer);
}).on('click.pop','#btn_getResult_alipay',function(){
    var postData = app.work.getCommonParamsObj();
    postData.orderId = orderId;
    postData.payChannel = 'Ali'; //支付渠道编码Ali  WeChat
    app.ajax.post(app.conf.api.getPayResult,{
        data: postData,
        success:function(data){
            if(data.code==200){//0：待支付；1：支付失败；2：支付成功；
                if(data.data==0) app.ui.toastOpen('还未支付完成，请稍后再试');
                else if(data.data==1) app.ui.popOpen('./pop_payFail.html');
                else if(data.data==2) app.ui.popOpen('./pop_paySuccess.html');
            }
        }
    });
});
$('#choosePayWay_warp').on('loads', function(event, params) {
    params = params || {};
    if (!params.list || !params.transportOrderNum || !params.orderId) return;
    init(params.list,params.transportOrderNum,params.orderId);
});
var loadWeb = app.util.getQueryString('loadWeb');
if(loadWeb=='yes'){
    var list = app.util.getQueryString('list');
    var transportOrderNum = app.util.getQueryString('transportOrderNum');
    var orderId = app.util.getQueryString('orderId');
    if (list) init(list,transportOrderNum,orderId);
}

function init(list,transportOrderNum_,orderId_) {
    transportOrderNum = transportOrderNum_;
    orderId = orderId_;
    var html = '';
    $.each(list,function(i,v){
        html += '\
            <label class="clr">\
                <img class="fl" height="40" src="http://www.teyuntong.cn/tytpc/'+v.icoImageUrl+'" alt="">\
                <span class="fl">'+(v.displayName||'')+'</span>\
                <input type="radio" class="fr" name="payway" channelNo="'+v.channelNo+'" value="'+v.id+'"  '+(v.isDefault==1?' checked':'')+'>\
            </label>';
    });
    $('#payway_list').html(html);
}
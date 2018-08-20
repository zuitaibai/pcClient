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
                    $('<div/>').attr('id','aaaaa').css({display:'none'}).appendTo('body').html(data.data);
                    $('#getResult_alipay').show();
                }else if(checked==8){//wechat
                    var userId = app.util.getQueryString('userId');
                    var ticket = app.util.getQueryString('ticket');
                    var clientVersion = app.util.getQueryString('clientVersion');
                    var imgUrl = app.conf.api.createCodeImg+'?payUrl='+data.data+'&userId='+userId+'&ticket='+ticket+'&clientVersion='+clientVersion;
                    $('#showCodeImg_wechat').show().find('img').attr('src',imgUrl);
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
                                            clearInterval(wechatTimer);
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
    if(confirm('关闭二维码将不再监听支付结果，确定要关闭？')){
        clearInterval(wechatTimer);
        $('#showCodeImg_wechat').hide();
    }
}).on('click.pop','#pop_btn_cannel_choosePay',function(){
    clearInterval(wechatTimer);
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
    if (params.list && params.transportOrderNum && params.orderId) init(params.list,params.transportOrderNum,params.orderId);
});
var loadWeb = app.util.getQueryString('loadWeb');
if(loadWeb=='yes'){
    var list = app.util.getQueryString('list');
    var transportOrderNum = app.util.getQueryString('transportOrderNum');
    var orderId = app.util.getQueryString('orderId');
    if (list && transportOrderNum && orderId) init(list,transportOrderNum,orderId);
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
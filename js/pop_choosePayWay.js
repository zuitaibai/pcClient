$('.pop_event').on('click.pop','#pop_btn_ok_choosePay',function(){
    var checked = $('input[name=payway]:checked','#payway_list').val();
    if(checked==8){ //wechat
        $('#showCodeImg_wechat').show();
    }else if(checked==7){ //alipay
        $('#getResult_alipay').show();
    }
}).on('click.pop','#btn_cannelResult_alipay',function(){
    $('#getResult_alipay').hide();
}).on('click.pop','#btn_close_showCodeImg_wechat',function(){
    $('#showCodeImg_wechat').hide();
});
$('#choosePayWay_warp').on('loads', function(event, params) {
    params = params || {};
    if (!params.list || !params.transportOrderNum) return;
    init(params.list,params.transportOrderNum);
});
var loadWeb = app.util.getQueryString('loadWeb');
if(loadWeb=='yes'){
    var list = app.util.getQueryString('list');
    var transportOrderNum = app.util.getQueryString('transportOrderNum');
    if (list) init(list,transportOrderNum);
}


function init(list,transportOrderNum) {
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
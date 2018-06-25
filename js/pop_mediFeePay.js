var tsOrderNo, srcMsgId;
$(document).on('click.pop',function(e){
    if($(e.target).hasClass('phonelist_item')){
        e.stopPropagation();
        $(e.target).addClass('b phonelist_item_checked').parent().siblings().find('a.phonelist_item').removeClass('phonelist_item_checked');
        $('#ph_choosed').text($(e.target).text());
        $('#btn_choose').removeClass('btn_choose_tit2');
        $('#pop_choosePhone_list').hide();
    }else if($(e.target).hasClass('phonelist_add')){//添加电话
        e.stopPropagation();
        //$('#addphone_w').show().find('.contr').val('');
        //链接到个人中心 限于目前客户端无法实现，暂隐藏此按钮(css隐藏)
    }else if($(e.target).attr('id')==='btn_choose'){
        e.stopPropagation();
        $('#pop_choosePhone_list').toggle();
        $(e.target).toggleClass('btn_choose_tit2');
    }else{
        $('#pop_choosePhone_list').hide();
        $('#btn_choose').removeClass('btn_choose_tit2');
    }
});
$('.pop_event').on('click.pop',function(e){
    e.stopPropagation();
}).on('click.pop','#addphone_cannel',function(){
    $('#addphone_w').hide();
}).on('click.pop','#addphone_sbt',function(){
    var c1 = $('#contr1'), c2 = $('#contr2');
    if(!c1.val() || !c2.val()){
        app.ui.toastOpen('请填写电话或验证码');
        return false;
    }
    app.ui.toastOpen('添加电话成功！');
    var d = c1.val();
    $('#addphone_w').hide();
    $('#phonelist_add').before('<dd><a class="phonelist_item" href="javascript:;">'+d+'</a></dd>');
});

$('#btnGoPayStart').on('click.pop',goPayStart);

$('#mediFeePay_warp').on('loads', function(event, params) {
    params = params || {};
    if (params.tsOrderNo) init(params.tsOrderNo,params.srcMsgId||'');
});
var loadWeb = app.util.getQueryString('loadWeb');
if(loadWeb=='yes'){
    var tsOrderNo = app.util.getQueryString('tsOrderNo');
    var srcMsgId = app.util.getQueryString('srcMsgId')||'';
    if (tsOrderNo) init(+tsOrderNo,srcMsgId);
}

function init(tsOrderNo_,srcMsgId_) {
    tsOrderNo = tsOrderNo_;
    srcMsgId = srcMsgId_;
    $('#mediFeePay_warp').hide();

    var postData = app.work.getCommonParamsObj();
    postData.transportOrderNum = tsOrderNo_;
    app.ajax.post(app.conf.api.statusGoods,{
        data: postData,
        success:function(data){
            if(data && data.code==200){
                if(!data.data){
                    app.ui.toastOpen('暂无数据');
                    return;
                }
                if(data.data.goodStatus==1){
                    if(('orderId' in data.data) && data.data['orderId']){
                        getPayWay(data.data.orderId,tsOrderNo_);
                    }else{
                        $('#mediFeePay_warp').show();
                        app.ajax.post(app.conf.api.getTels,{ //获取电话列表
                            data: app.work.getCommonParamsObj(),
                            success: function(dd){
                                if(dd.code==200 && dd.data && dd.data.length){
                                    dd.data.reverse();
                                    var html = [];
                                    $.each(dd.data,function(i,v){
                                        html.push('<dd><a class="phonelist_item '+(i===0?' phonelist_item_checked':'')+'" href="javascript:;">'+v.tel+'</a></dd>');
                                    });
                                    html.push('<dt><a class="b phonelist_add" id="phonelist_add"  href="javascript:;">+添加电话</a></dt>');
                                    $('#ph_choosed').text(dd.data[0]['tel']);
                                    $('#pop_choosePhone_list').html(html.join('\n'));
                                }
                            }
                        });
                    }
                }else{
                    app.ui.toastOpen('该订单已支付!请刷新页面');
                    app.ui.popClose();
                }
            }
        }
    });
}
function goPayStart(){
    var money = $.trim($('#pop_textfield_money').val());
    if(!money){
        app.ui.toastOpen('请填入信息费数字！');
        return;
    }
    var postData = app.work.getCommonParamsObj();
    postData.goodsId = srcMsgId; //src_msg_id
    postData.telephone = $.trim($('#ph_choosed').text());
    postData.agencyMoney = money;
    postData.carOwnerPayType = 1;
    app.ajax.post(app.conf.api.saveOrder,{
        data: postData,
        success:function(data){
            if(data && data.code==200){
                if(data.data && data.data.redirectParams && data.data.redirectParams.orderId) getPayWay(data.data.redirectParams.orderId,tsOrderNo);
            }
        }
    });
}
function getPayWay(orderId,transportOrderNum){
    var postData = app.work.getCommonParamsObj();
    postData.orderId = orderId;
    //postData.backType = ; //预留字段，没用则不传
    app.ajax.post(app.conf.api.getPayWay,{
        data: postData,
        success:function(data){
            if(data && data.code==200){
                if(data.data && data.data.channelList && data.data.channelList.length) openPop_choose(data.data.channelList,transportOrderNum,orderId);
                else{
                    app.ui.toastOpen('没有获取到支付方式！');
                    app.ui.popClose();
                }
            }
        }
    });
}
function openPop_choose(list,transportOrderNum,orderId){
    app.ui.popOpen('./pop_choosePayWay.html',{
        noClose:true,
        cbk: function(){ $('#choosePayWay_warp').trigger('loads',{list:list,transportOrderNum:transportOrderNum,orderId:orderId}); }
    });
}
$('.wraper_d').on('click.detail', '#showTel', function() {
    $('#telArea').show();
    $(this).hide();
}).on('click.detail','.btn_mapBaidu',function(){//百度地图
    var s = $(this).attr('data-s');
    if(s) window.open(s);
}).on('click.detail','.btn_mapSougou',function(){//搜狗地图
    var s = $(this).attr('data-s');
    //if(s) window.open(s);
}).on('click.pop','.ATpay',function(){//支付信息费按钮
    var tsOrderNo = $(this).attr('data-tsOrderNo') || '';
    app.ui.popOpen('./pop_mediFeePay.html',{
        noClose:true,
        cbk: function(){  $('#mediFeePay_warp').trigger('loads',{tsOrderNo: tsOrderNo}); }
    });
}).on('click.pop','.ATshipmented',function(){//装货完成
    var tsOrderNo = $(this).attr('data-tsOrderNo') || '';
    app.ui.popOpen('./pop_goodsFinish.html',{
        noClose:true,
        cbk: function(){  $('#goodsFinish_warp').trigger('loads',{tsOrderNo:tsOrderNo}); }
    });
}).on('click.pop','.ATport',function(){//异常上报
    var tsOrderNo = $(this).attr('data-tsOrderNo') || '';
    var ifCatchByGoods = $(this).attr('data-ifCatchByGoods') || '';
    var postO = {exParty: 1, tsOrderNo:tsOrderNo};//exParty: 1车主上报，2货主上报
    if(ifCatchByGoods=='yes') postO.exParty = 2;
    app.ui.popOpen('./pop_catchPortForm.html',{
        noClose:true,
        cbk: function(){  $('#catchPortForm_warp').trigger('loads',postO); }
    });
}).on('click.pop','.ATreject,.ATagree',function(){//拒绝装货、同意装货
    var tsOrderNo = $(this).attr('data-tsOrderNo') || '';
    var carOwnerUserId = $(this).attr('data-carOwnerUserId') || '';
    var postData = {tsOrderNo: tsOrderNo, carOwnerUserId: carOwnerUserId};
    postData.operateType = $(this).hasClass('ATreject')?1:2;//operateType	1 拒绝装货 2 同意装货
    app.ajax.post(app.conf.api.shipmentForDo,{
        data: postData,
        success:function(data){
            if(data.code==200){
                app.ui.toastOpen('操作成功！');
                $(this).closest('.feeDetail').find('.ATreject,.ATagree').remove();
            }
        }
    });

}).on('click.pop','.ATrejectall',function(){//拒绝所有车主装货
    var carOwnerUserIds = $(this).attr('data-carOwnerUserId') || '';
    var tsOrderNo = $(this).attr('data-tsOrderNo') || '';
    if(!carOwnerUserIds || !tsOrderNo){
        app.ui.toastOpen('参数不正确！');
        return;
    }
    var postData = {tsOrderNo: tsOrderNo, carOwnerUserId: carOwnerUserIds};
    postData.operateType = 1;
    app.ajax.post(app.conf.api.shipmentForDo,{
        data: postData,
        success:function(data){
            if(data.code==200){
                app.ui.toastOpen('操作成功！');
                $('#refuseAll').hide();
            }
        }
    });
});

$('#detailMain').on('loads', function(event, params) {
    params = params || {};
    if(params.goodsId&&params.detailType) init(params.goodsId,params.detailType);
});
var loadWeb = app.util.getQueryString('loadWeb');
if(loadWeb=='yes'){
    var goodsId = app.util.getQueryString('goodsId');
    var detailType = app.util.getQueryString('detailType');
    if (goodsId&&detailType) init(goodsId,detailType);
    $('#btn_closeDetail').hide();
}

function init(goodsId,detailType) {
    var postData = app.work.getCommonParamsObj();
    postData.goodsId = goodsId;
    postData.detailType = detailType; //入口处：1找货列表/收藏列表的详情 2我的货源列表的详情 3已接单列表的详情 4 精准货源5猜你喜欢
    app.ajax.post(app.conf.api.detailGoods,{
        data: postData,
        success:function(data){
            if(data.code==200){
                initRequestOk(data,detailType);
            }
        }
    });
}


/*var b = {
    code: 200,
    msg: "成功",
    data: {
        callStatus: "1_0",//当前用户是否对该货物拨打过电话标示
        isPaySuccess: 0,//0否 1是
        hasMakeOrder: '1',	//是否下过订单：0否、1是
        collectBean: {//收藏bean
            isCollect: 0 ,
            collectId:33//	Long	收藏信息ID
         },
        detailBean: { //货物详情信息
            id: 30847011,
            isCar: "1",//0否 1是
            status: 1,//状态 1有效（发布中），0无效，2待定（QQ专用），3阻止（QQ专用），4成交，5取消状态
            srcMsgId: 30846989,
            userId: 147325,//发布人ID
            nickName: "小先生",
            publishTime: 1511172900000, //发布时间(毫秒)
            firstPublishTime: 1511171845000, //首次发布时间(毫秒)
            uploadCellPhone: "15101078705", //用户发布电话
            regTime: 1493097057000, //发货人注册时间　时间戳　毫秒
            infoStatus: "0", //信息费运单状态：0待接单  1有人支付成功 （货主的待同意）2装货中（车主是待装货 ）3车主装货完成  4系统装货完成 5异常上报
            isInfoFee: "1", //是否需要信息费 0不需要、1需要
            length: "66",//长
            high: "66",//高
            wide: "66",//宽
            weight: "666",//重量
            price: "666",
            brand:'',	//字符串	品牌
            remark: "666",//其他说明
            source: 0,
            taskContent: "666", //货物内容
            telephoneOne: "4006688998",//联系人1
            telephoneTwo:'',//	String	联系人2
            telephoneThree:'',//	String	联系人3
            isSuperelevation:'',//	String	是否三超(是，否/不/””/null)
            tsOrderNo: "17112000000012",
            userPart: 100, //用户诚信分数
            userType: 1,//用户类型 1VIP 0使用 2未激活
            verifyFlag: 1,//验证标识 0未验证 1验证 信息认证标识共用
            verifyPhotoSign: 1, //照片认证标志0未认证1通过
            type:'',//	字符串	型号
            goodNumber:'',//	字符串	台数
            distance:'',//	字符串	出发地目的地之间距离 	单位公里
            destArea: "大理市",//目的地区
            destCity: "大理州",//目的地市
            destCoordX: "-1185.15",//目的地坐标x
            destCoordY: "2833.15",//目的地坐标y
            destLatitude: "25.60",//目的地纬度
            destLongitude: "100.23",//目的地经度
            destPoint: "云南大理州大理市",//目的地
            destProvinc: "云南",//目的地省
            desttCoordY: "2833.15",
            startArea: "瑶海区",//出发地区
            startCity: "合肥市",//出发地市
            startCoordX: "528.39",//出发地坐标x
            startCoordY: "3527.54",//出发地坐标y
            startLatitude: "31.87",//出发地纬度
            startLongitude: "117.30",//出发地经度
            startDetailAdd:'',//	String	出发地详细地址
            destDetailAdd:'',//	String	目的地详细地址
            startPoint: "安徽合肥市瑶海区", //出发地
            startProvinc: "安徽", //出发地省
            isNeedDecrypt:'',//	String	是否需要解密昵称，1 需要 2 不需要
            matchItemId: -1,//标准化数据匹配项的id值
            isStandard: 0,//是否为标准化数据，0是，1不是
            iosDistance:'',//	字符串	出发地目的地之间距离 	单位10米
            androidDistance:''//	字符串	出发地目的地之间距离 	单位10米
        },
        transportUserBean: {//货主信息
            deliverTypeOneCode: "6",//销售审核一级身份code
            deliverTypeOneName: "个人车主",//销售审核一级身份name
            identityTypeCode: 6,//一级身份CODE
            identityTypeName: "个人车主",//一级身份中文名称
            userClassCode: 2,//一级身份类别CODE
            userClassName: "车辆方",//一级身份类别中文名称
            userId: 147540 //货主ID(APP暂时未使用)
        },
        agencyMoneyList:[ //该笔货物下的所有信息费
            {
                carOwnerLoadfinishedTime: 1529582625000,//车主装货完成时间（毫秒）
                carOwnerRegisterPhone: "18287197828",
                carOwnerTelephone: "18287197828",//车主联系电话
                carOwnerUserId: 147255,//车主用户ID
                goodsOrderNo: "18062100000009",//运单号
                goodsOwnerAgreeTime: 1529551614000,//货主同意装货时间（毫秒）
                id: 1329,//订单表ID
                payAgencyMoney: 5700,//已付信息费金额（分）
                payChannel: "1",//1支付宝 2易宝/银行卡 3微信
                payEndTime: 1529551480000,//车主支付成功的时间(毫秒)
                payStatus: "2", //支付状态  0待支付   1支付失败   2支付成功
                robStatus: "5",//接单状态 0待接单 1接单成功  2货主拒绝 3系统拒绝  4同意装货 5车主装货完成  6系统装货完成 7异常上报 8货主撤销货源退款 9系统撤销货源退款 10车主取销装货 11接单失败（用户同意别人装货，对没有支付成功的支付信息的操作状态）
                refuseTime: 44 //拒绝装货时间
            }
        ],
        exceptionBean: {//异常信息
            time:444,//	long	异常上报时间（毫秒）
            finishedTime:444,//	long	异常上报处理完成时间
            lastResult:'',//	String	最终意见
            carOwnerMoney:44,//	Integer	车主金额（分）
            goodsOwnerMoney:44,//	Integer	货主金额（分）
            exStatus:''//	String	异常上报处理状态0初始化1处理中2处理完成
        },
        originalStandardMsg:{
            brand: " ",//具体品牌
            displayContent: "220压桩机",
            height: "3.2",//高度
            length: "6.8",//长度
            lengthWidthHeightDisplay: 0,
            machineType: "压桩机",//机种类型，如挖掘机，起重机等
            type: "220",//机器型号
            weight: "49",//重量
            weightDisplay: 0,
            width: "3.4",//宽度
            brandType:''//	String	品牌型号
        }
    }
};*/
function initRequestOk(data,detailType){
    var dData = data.data, detailD = dData.detailBean;
    app.ui.norFilter(dData,'#detailMain');
    app.ui.classFilter(dData,'#detailMain');
    /* 收藏 举报 用户头像
    if(detailD.isCollect==1) $('#favorites_dt').show().attr('collectId',detailD.collectId);
    if('') $('#report_dt').show();
    if('') $('#userPic_warp').html('<img src="" alt="">');
    */
    //百度地图
    var lat_s = detailD.startLatitude, lng_s = detailD.startLongitude, name_s = detailD.startCity||'',
        lat_e = detailD.destLatitude, lng_e = detailD.destLongitude, name_e = detailD.destCity||'';
    $('#footbtns a.btn_mapBaidu').attr('data-s',
        'http://api.map.baidu.com/direction?origin=latlng:'+lat_s+','+lng_s+'|name:'+name_s+'&'+
        'destination=latlng:'+lat_e+','+lng_e+'|name:'+name_e+'&mode=driving&output=html&src=tyt&region=地点'
    );
    //长宽高
    var sizeStr = '';
    if(detailD.length) sizeStr += '长: '+detailD.length+'米；';
    if(detailD.wide) sizeStr += '宽: '+detailD.wide+'米；';
    if(detailD.high) sizeStr += '高: '+detailD.high+'米';
    $('#goodsSize_label').html(sizeStr);

    /*detailType:入口处：1找货列表/收藏列表的详情 2我的货源列表的详情 3已接单列表的详情 4精准货源5猜你喜欢*/
    //车方
    if(detailType==3){//已接单列表的详情
        //信息费列表数据填充
        if(dData.agencyMoneyList && dData.agencyMoneyList.length){
            var fill = fillCarsideFeeListHtml(dData.agencyMoneyList,detailD);
            if(fill) $('#reportInfo,#customerTel').show();
        }
    }
    //货方
    else if(detailType==2){//我的货源列表的详情
        $('#startToEnd p').show();
        $('#goodsInfo>li.last').hide();
        //detailD.infoStatus 信息费运单状态：0待接单  1有人支付成功 （货主的待同意   ）2装货中（车主是待装货 ）3车主装货完成  4系统装货完成 5异常上报
        //status: 1,//状态 1有效（发布中），0无效，2待定（QQ专用），3阻止（QQ专用），4成交，5取消状态
        //已撤消或已过期
        if(detailD.status==5 || (detailD.status==1 && (new Date(detailD.publishTime).getDate()<new Date().getDate()))){
            $('#footbtns').find('a.btn_doEdit,a.btn_doPublish').css('display','inline-block');
        }else if(detailD.status==1){
            //信息费列表数据填充
            if(dData.agencyMoneyList && dData.agencyMoneyList.length){
                var result = fillGoodssideFeeListHtml(dData.agencyMoneyList,detailD);
                if(result==='custmCall') $('#customerTel').show();
                else if((typeof result==='object') && result.length){
                    var tsOrderNo = result.tsOrderNo;
                    $('#refuseAll').show().find('a').attr('data-carOwnerUserId',result.join(',')).attr('data-tsOrderNo',tsOrderNo);
                }
            }else{
                $('#footbtns').find('a.btn_docannel,a.btn_doSetok').css('display','inline-block');
            }
        }
    }
    //找货列表
    else if(detailType==1){//找货列表/收藏列表的详情   else if(detailType==4||detailType==5) //4精准货源5猜你喜欢
        $('#customerTel').show();
        if(detailD.isInfoFee==1) {
            var html = '<div class="feeDetail" style="height:62px;"><a class="btn_1 btn_green btn_1_nth1 ATpay" href="javascript:;" data-tsOrderNo="'+detailD.tsOrderNo+'">支付信息费</a></div>'
            $('#goodsDetail_list').html(html).show();
        }
    }
    setTimeout(app.ui.detailHeightZomm,100);
}

function fillCarsideFeeListHtml(list,detailD){
    var re = [], ifCatch;
    for(var i=0,l=list.length;i<l;i++) {
        var payWay = '';
        if (list[i].payChannel == 1) payWay = '支付宝';
        else if (list[i].payChannel == 2) payWay = '易宝/银行卡';
        else if (list[i].payChannel == 3) payWay = '微信';
        var reseaon = '';
        if (list[i].robStatus in app.conf.dataReceiptMap) reseaon = app.conf.dataReceiptMap[list[i].robStatus];
        //robStatus:接单状态   0待接单 1接单成功  2货主拒绝 3系统拒绝  4同意装货 5车主装货完成  6系统装货完成 7异常上报 8货主撤销货源退款 9系统撤销货源退款 10车主取销装货 11接单失败（用户同意别人装货，对没有支付成功的支付信息的操作状态）
        var htm_carPhone = '<p class="ffzh fd_list_phone"><label>车主电话</label><span>'+(list[i].carOwnerTelephone||'')+'</span></p>',
            htm_payMoney = '<p class="ffzh fd_list_fee"><label>已支付信息费</label><span class="b yellow">'+(list[i].payAgencyMoney?parseInt(list[i].payAgencyMoney/100,10):0)+'元</span></p>',
            htm_payTime = '<p class="ffzh fd_list_paytime"><label>支付时间</label><span>'+(list[i].payEndTime?app.util.dateFormat(list[i].payEndTime,'yyyy-MM-dd hh:mm'):'')+'</span></p>',
            htm_agreeTime = '<p class="ffzh fd_list_agreetime"><label>同意装货时间</label><span>'+(list[i].goodsOwnerAgreeTime?app.util.dateFormat(list[i].goodsOwnerAgreeTime,'yyyy-MM-dd hh:mm'):'')+'</span></p>',
            htm_payWay = '<p class="ffzh fd_list_payway"><label>支付方式</label><span>'+payWay+'</span></p>',
            htm_resoean = '<p class="ffzh fd_list_payway"><label>原因</label><span>'+reseaon+'</span></p>',
            htm_shipmentedTime = '<p class="ffzh fd_list_payway"><label>完成装货时间</label><span>'+(list[i].carOwnerLoadfinishedTime?app.util.dateFormat(list[i].carOwnerLoadfinishedTime,'yyyy-MM-dd hh:mm'):'')+'</span></p>';
        var item='';
        if(list[i].robStatus==0){//待接单
            item =  '<div class="feeDetail" style="height:62px;"><a class="btn_1 btn_green btn_1_nth1 ATpay" href="javascript:;" data-tsOrderNo="'+detailD.tsOrderNo+'">支付信息费</a></div>';
        }else if(list[i].robStatus==1){//接单成功
            item = '';
        }else{
            var btns = '', htm_arr = [];
            if(list[i].robStatus==2 || list[i].robStatus==3 || list[i].robStatus==8 || list[i].robStatus==9){
                //货主拒绝、系统拒绝、货主撤消/退款、系统撤消/退款
                htm_arr = [htm_payMoney,htm_resoean];
                btns = '';
            }else if(list[i].robStatus==4){//同意装货
                htm_arr = [htm_payMoney,htm_payTime,htm_agreeTime];
                btns = '<a class="btn_1 btn_green btn_1_nth1 ATshipmented" href="javascript:;" data-tsOrderNo="'+detailD.tsOrderNo+'">装货完成</a> <a data-tsOrderNo="'+detailD.tsOrderNo+'" class="btn_1 btn_green btn_1_nth2 ATport" href="javascript:;">异常上报</a>';
            }else if(list[i].robStatus==5 || list[i].robStatus==6){//装货完成、系统装货完成
                htm_arr = [htm_payMoney,htm_payTime,htm_agreeTime,htm_shipmentedTime];
                btns = '';
            }else if(list[i].robStatus==7){//异常上报
                htm_arr = [htm_payMoney,htm_payTime,htm_agreeTime,htm_shipmentedTime];
                btns = '';
                ifCatch = true;
            }
            //list[i].robStatus==11 接单失败
            //list[i].robStatus==10 车主取消装货
            item = '<div class="feeDetail">\
                <div class="clr fftit">\
                    <strong class="fl">信息费详情</strong>\
                    <span class="fr fftit_r">运单号：<span>'+(list[i].goodsOrderNo||'')+'</span></span>\
                </div>\
                <div class="feeDetail_list">'+htm_arr.join('\n')+'</div>\
                '+btns+'\
            </div>';
        }
        re.push(item);
    }
    re.length && $('#goodsDetail_list').html(re.join('\n')).show();
    return ifCatch;
}
function fillGoodssideFeeListHtml(list,detailD){
    var arr = [], rejectAll;
    for(var i=0,l=list.length;i<l;i++) {
        var payWay = '';
        if (list[i].payChannel == 1) payWay = '支付宝';
        else if (list[i].payChannel == 2) payWay = '易宝/银行卡';
        else if (list[i].payChannel == 3) payWay = '微信';
        var reseaon = '';
        if (list[i].robStatus in app.conf.dataReceiptMap) reseaon = app.conf.dataReceiptMap[list[i].robStatus];
        var htm_carPhone = '<p class="ffzh fd_list_phone"><label>车主电话</label><span>'+(list[i].carOwnerTelephone||'')+'</span></p>',
            htm_payMoney = '<p class="ffzh fd_list_fee"><label>已支付信息费</label><span class="b yellow">'+(list[i].payAgencyMoney?parseInt(list[i].payAgencyMoney/100,10):0)+'元</span></p>',
            htm_payTime = '<p class="ffzh fd_list_paytime"><label>支付时间</label><span>'+(list[i].payEndTime?app.util.dateFormat(list[i].payEndTime,'yyyy-MM-dd hh:mm'):'')+'</span></p>',
            htm_agreeTime = '<p class="ffzh fd_list_agreetime"><label>同意装货时间</label><span>'+(list[i].goodsOwnerAgreeTime?app.util.dateFormat(list[i].goodsOwnerAgreeTime,'yyyy-MM-dd hh:mm'):'')+'</span></p>',
            htm_payWay = '<p class="ffzh fd_list_payway"><label>支付方式</label><span>'+payWay+'</span></p>',
            htm_resoean = '<p class="ffzh fd_list_payway"><label>原因</label><span>'+reseaon+'</span></p>',
            htm_shipmentedTime = '<p class="ffzh fd_list_payway"><label>完成装货时间</label><span>'+(list[i].carOwnerLoadfinishedTime?app.util.dateFormat(list[i].carOwnerLoadfinishedTime,'yyyy-MM-dd hh:mm'):'')+'</span></p>';

        var itemHtml = [], itemBtns = [];
        if(detailD.infoStatus==0){ //信息费运单状态：0待接单

        }else if(detailD.infoStatus==1){ //信息费运单状态：1有人支付成功 （货主的待同意）
            itemHtml = [htm_carPhone, htm_payMoney, htm_payTime, htm_payWay];
            itemBtns = [
                '<a class="btn_1 btn_green btn_1_nth1 ATreject" href="javascript:;" data-carOwnerUserId="'+list[i].carOwnerUserId+'" data-tsOrderNo="'+detailD.tsOrderNo+'">拒绝装货</a>',
                '<a class="btn_1 btn_green btn_1_nth2 ATagree" data-carOwnerUserId="'+list[i].carOwnerUserId+'" data-tsOrderNo="'+detailD.tsOrderNo+'" href="javascript:;">同意装货</a>'
            ];
            if(typeof rejectAll!=='object') rejectAll = [];
            rejectAll.push([list[i].carOwnerUserId]);
            rejectAll.tsOrderNo = detailD.tsOrderNo;
        }else if(detailD.infoStatus==2){ //信息费运单状态：2装货中（车主是待装货 ）
            itemHtml = [htm_carPhone, htm_payMoney, htm_payTime, htm_payWay, htm_agreeTime];
            itemBtns = [
                '<a class="btn_1 btn_green btn_1_nth1 ATport" href="javascript:;" data-ifCatchByGoods="yes" data-tsOrderNo="'+detailD.tsOrderNo+'">异常上报</a>'
            ];
        }else if(detailD.infoStatus==3 || detailD.infoStatus==4){ //信息费运单状态：3车主装货完成 4系统装货完成
            itemHtml = [htm_carPhone, htm_payMoney, htm_payTime, htm_payWay, htm_agreeTime, htm_shipmentedTime];
        }else if(detailD.infoStatus==5){ //信息费运单状态：5异常上报
            $('#reportInfo').show();
            rejectAll = 'custmCall';
        }
        var item = '<div class="feeDetail">\
                <div class="clr fftit">\
                    <strong class="fl">信息费详情</strong>\
                    <span class="fr fftit_r">运单号：<span>'+(list[i].goodsOrderNo||'')+'</span></span>\
                </div>\
                <div class="feeDetail_list">'+itemHtml.join('\n')+'</div>\
                '+itemBtns.join('')+'\
            </div>';
        arr.push(item);
    }
    re.length && $('#goodsDetail_list').html(arr.join('\n')).show();
    return rejectAll;
}
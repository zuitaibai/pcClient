window.console = window['console']||{log:function(){},warn:function(){}};
!(function(){
    var app ={};
    app.util = {
        openWin : function(url, winName, o) {
            var o = o ? o : {}, winWidth, winHeight, winTop, winLeft, waH = window.screen.availHeight, wsW = window.screen.availWidth;
            (!o.width) ? winWidth = 800 : winWidth = o.width;
            (!o.height) ? wiknHeight = 600 : winHeight = o.height;
            if(o.top){
                if (o.top < 1) winTop = waH * o.top;
                else winTop = o.top;
            }else winTop = (waH - 30 - winHeight) / 2;
            if(o.left){
                if (o.left < 1) winLeft = wsW * o.left;
                else winLeft = o.left;
            }else winLeft = (wsW - 10 - winWidth) / 2;
            if(o.params){
                var add = '?';
                if(url.indexOf('?')>-1) add = '&';
                //url += add + $.param(o.params);
                var m = [];
                for(var i in o.params){
                    m.push(i+'='+o.params[i].toString().replace(/[\r\n]/g, '').replace(/\s+/g,' '));
                }
                url += add + m.join('&');
                url = encodeURI(url);
            }
            window.open(url, winName, 'height=' + winHeight + ',innerHeight=' + winHeight + ',width=' + winWidth + ',innerWidth=' + winWidth + ',top=' + winTop + ',left=' + winLeft + ',status=no,toolbar=no,menubar=no,location=no,resizable=no,scrollbars=no,titlebar=no');
        },
        apiUrlBase: function(url){
            var _url, href = location.href;
            if(href.indexOf('www.teyuntong')>-1||href.indexOf('boss.teyuntong')>-1) _url = 'http://www.teyuntong.cn';
            //todo:
            //else if(href.indexOf('release.teyuntong')>-1||href.indexOf('47.93.81.31')>-1) _url = 'http://47.93.81.31';
            else if(href.indexOf('release.teyuntong')>-1||href.indexOf('47.93.81.31')>-1) _url = 'http://59.110.104.99'; //for Boss Hou debug
            else if(href.indexOf('59.110.104.99')>-1) _url = 'http://59.110.104.99';
            else _url = location.origin || (location.protocol  ? location.protocol + '//' + location.host : '//' + location.host);
            return _url + (url||'');
        },
        getQueryStringObject: function(url){
            url = url || window.location.href;
            url = url.substring(url.lastIndexOf('?') + 1);
            var o = {}, arr = url.split("&");
            for (var i = 0; i < arr.length; i++){
                var sarr = arr[i].split("=");
                o[sarr[0]] = sarr.length>1? decodeURIComponent(sarr[1]) : '';
            }
            return o;
        },
        getQueryString: function(name,url){
            url = url || window.location.href;
            url = url.substring(url.lastIndexOf('?') + 1);
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i'), r = url.match(reg);
            return r ? unescape(r[2]) : '';
        },
        dateFormat: function(date,fmt){
            var date = new Date(date), fmt = fmt || 'yyyy-MM-dd hh:mm:ss';
            var o = {
                "M+": date.getMonth() + 1,
                "d+": date.getDate(),
                "h+": date.getHours() % 12 == 0 ? 12 : date.getHours() % 12,
                "H+": date.getHours(),
                "m+": date.getMinutes(),
                "s+": date.getSeconds(),
                "q+": Math.floor((date.getMonth() + 3) / 3),
                "S": date.getMilliseconds()
            };
            var week = {"0": "\u65e5", "1": "\u4e00", "2": "\u4e8c", "3": "\u4e09", "4": "\u56db", "5": "\u4e94", "6": "\u516d"};
            if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substring(4 - RegExp.$1.length));
            if(/(E+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1,
                    ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + week[date.getDay()]
                );
            }
            for(var k in o) {
                if(new RegExp("(" + k + ")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
            return fmt;
        },
        validateStringType: function(str){
            return {
                'email': /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(str),
                'phone': /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test(str),
                'tel': /^(0\d{2,3}-\d{7,8})(-\d{1,4})?$/.test(str),
                'number': /^[0-9]$/.test(str),
                'letter': /^[a-zA-Z]+$/.test(str),
                'text': /^\w+$/.test(str),
                'cn': /^[\u4E00-\u9FA5]+$/.test(str),
                'lower': /^[a-z]+$/.test(str),
                'upper': /^[A-Z]+$/.test(str)
            }
        },
        stringCut: function(str, len, placeholder){
            placeholder = placeholder || '';
            var temp, icount = 0, patrn = /[^\x00-\xff]/, restr = '';
            if(arguments.length===1){
                for (var i = 0; i < str.length; i++) {
                    temp = str.substring(i, 1);
                    if(!patrn.exec(temp)) icount += 1;
                    else icount += 2;
                }
                return icount;
            }
            icount = 0;
            for(var i = 0; i < str.length; i++) {
                if (icount < len - 1) {
                    temp = str.substring(i, 1);
                    if(!patrn.exec(temp)) icount += 1;
                    else icount += 2;
                    restr += temp;
                } else { break }
            }
            return restr + placeholder;
        }
    };
    app.ui = {
        popOpen: function(url,paramsObj,dataObj){
            paramsObj = paramsObj || {};
            $('.pop_event').off('click.pop input.pop');
            $(document).off('click.pop');
            var $dialog = $('#dialogs').show(), $dialog_m = $('#dialog_m');
            $.ajax({
                type: 'get',
                url: url,
                data: dataObj || '',
                dataType: 'html',
                cache: false,
                global: false,
                success: function(data, textStatus, jqXHR){
                    $dialog_m.html(data);
                    paramsObj.overlay && $('#overlay').show();
                    paramsObj.cbk && paramsObj.cbk();
                    setTimeout(function(){(typeof DD_belatedPNG!=='undefined') && DD_belatedPNG.fix('.ie6png,.ie6png_bg');},100);
                }
            });
            var method = paramsObj.noClose ? 'addClass' : 'removeClass';
            return $dialog[method]('dialogs_noClose');
        },
        popClose: function(){
            $('#dialog_m').html('<p class="pd_load">Loading..</p>');
            if($('#overlay').is(':visible')) $('#overlay').hide();
            return $('#dialogs').hide();
        },
        detailOpen: function(url,paramsObj,dataObj){
            paramsObj = paramsObj || {};
            $('.wraper_d').off('click.detail');
            $(document).off('click.detail');
            var $detail = $('#detail_w').show();
            $.ajax({
                type: 'get',
                url: url,
                data: dataObj || '',
                dataType: 'html',
                cache: false,
                global: false,
                success: function(data, textStatus, jqXHR){
                    $detail.html(data).show();
                    setTimeout(app.ui.detailHeightZomm,100);
                    paramsObj.overlay && $('#overlay2').show();
                    paramsObj.cbk && paramsObj.cbk();
                    setTimeout(function(){(typeof DD_belatedPNG!=='undefined') && DD_belatedPNG.fix('.ie6png,.ie6png_bg');},100);
                }
            });
        },
        detailClose: function(){
            if($('#overlay2').is(':visible')) $('#overlay2').hide();
            return $('#detail_w').html('<p class="pd_load">Loading..</p>').hide();
        },
        toastOpen: function(msg,timeout,obj){
            clearTimeout(app.ui.timer);
            var $toast = $('#toast').stop(true,true);
            setTimeout(function(){
                $toast.find('span').html(msg||'').end().show();
                var w = $toast.outerWidth();
                $toast.css('margin-left',-w/2);
                if(timeout===0);
                else{
                    timeout = timeout || 3000;
                    app.ui.timer = setTimeout(function(){ $toast.fadeOut(500); },timeout);
                }
            },10);
            return $toast;
        },
        toastClose: function(){
            clearTimeout(app.ui.timer);
            return $('#toast').stop(true,true).hide();
        },
        getColor: function(str){
            for(var i in app.conf.colors){
                if(app.conf.colors[i].indexOf(str)>-1) return i;
            }
            return '';
        },
        detailHeightZomm: function(){
            var w = $('#detail_w').css('height','auto'), ht = w.height(), fht = $('body').height()-20-20;
            w.css('height', ht>fht ? fht : 'auto');
        },
        getBtnStatus: function(str){
            var goOnPay = {t:'继续支付',c:'ATpay'},
                detail = {t:'详情',c:'ATdetail'},
                catchPort = {t:'异常上报', c:'ATport'},
                shipmented = {t:'装货完成',c:'ATshipmented'};
            var waitPay = [goOnPay], waitAgree = [detail], waitShipment = [shipmented,catchPort,detail], yetFinish = [detail], reject = [detail], catchs = [detail], ept = [];
            waitPay.status = '待支付';waitAgree.status = '待同意';waitShipment.status = '装货中';
                yetFinish.status = '已完成';reject.status = '拒绝/退费';catchs.status = '违约/异常';ept.status = '';
            return {
                waitPay: waitPay,
                waitAgree: waitAgree,
                waitShipment: waitShipment,
                yetFinish: yetFinish,
                reject: reject,
                catchs: catchs
            }[str] || ept;
        },
        makeBtns: function(arrOrStr){
            var sarr, rarr = [];
            if(typeof arrOrStr==='string') sarr = app.ui.getBtnStatus(arrOrStr);
            else sarr = arrOrStr;
            if(!('status' in sarr)){
                console.warn('该数组需要具有status属性');
                sarr.status = '';
            }
            $.each(sarr,function(i,v){
                rarr.push('<a class="'+v.c+' '+app.ui.getColor(v.t)+'" href="javascript:;">'+v.t+'</a>');
            });
            rarr.status = sarr.status;
            return rarr;
        },
        norFilter: (function (tagProp) {
            return function(data,warp){
                warp = warp || document.body;
                data = data || {};
                $('['+tagProp+']',warp).each(function(){
                    var str = $(this).attr(tagProp), filterArr = str.split('|'), dataKey = filterArr[0], sdata = '';
                    var dataKeyArr = dataKey.split('.');
                    if(dataKeyArr[0] in data){
                        if(dataKeyArr.length>1){
                            sdata =  data[dataKeyArr[0]][dataKeyArr[1]] || ''; // data-aj="agencyMoneyList.goodsOrderNo"
                        }else sdata = data[dataKeyArr[0]] || ''; // data-aj="goodsOrderNo"

                        if(filterArr.length!==1){
                            var filterr = filterArr[1], sre = '', index = filterr.indexOf(':'),
                                rule = [filterr.substring(0,index),filterr.substring(index+1)];
                            if(rule[0]==='date'){ // data-aj="detailBean.firstPublishTime|date:hh: mm: ss"
                                sre = app.util.dateFormat(sdata,rule[1]);
                            }
                            else if(rule[0]==='fmt'){// data-aj="detailBean.weight|fmt:%%吨"
                                sre = rule[1].replace('%%',sdata);
                            }
                            else if(rule[0]==='obj'){// data-aj="exceptionBean.exStatus|obj:0:初始化,1:处理中,2:处理完成"
                                var arr = rule[1].split(','), o = {};
                                $.each(arr,function(i,v){
                                    var sh = v.split(':');
                                    o[sh[0]] = sh[1];
                                });
                                if(sdata in o) sre = o[sdata];
                            }
                            sdata = sre;
                        }
                    }
                    $(this).html(sdata);
                });
            }
        })('data-aj'),
        classFilter: (function(tagProp){
            return function(data,warp) {
                warp = warp || document.body;
                data = data || {};
                $('[' + tagProp + ']', warp).each(function() {
                    var arr = $(this).attr(tagProp).split('|'), re = '';
                    var dd = arr[0], str = arr[1];
                    var ddArr = dd.split('.'), dataGet = '';
                    if(ddArr[0] in data){
                        if(ddArr.length===1) dataGet = data[ddArr[0]]; // data-aj-class="detailBean|0:identificate-ico-no,1:identificate-ico-yet"
                        else if(ddArr.length===2 && (ddArr[1] in data[ddArr[0]])) dataGet = data[ddArr[0]][ddArr[1]]; // data-aj-class="detailBean.verifyFlag|0:identificate-ico-no,1:identificate-ico-yet"
                        var strArr = str.split(','), strO = {};
                        $.each(strArr,function(i,v){
                            var sarr = v.split(':');
                            strO[sarr[0]] = sarr[1];
                        });
                        if(dataGet in strO) re = strO[dataGet];
                    }
                    if(re) $(this).addClass(re);
                });
            };
        })('data-aj-class')
    };
    app.ajax = function(url,type,params){
        params = params || {};
        return $.ajax({
            type: type || 'get',
            url: app.util.apiUrlBase(url),
            data: params.data || '',
            dataType: 'json',
            success: function(data, textStatus, jqXHR){
                if(data && data.code==200){
                    params.success && params.success(data);
                }
                else{
                    data.code!=1004 && app.ui.toastOpen(data.msg || '');
                }
            },
            error: function (xhr, textStatus, errorThrown) { params.error && params.error(textStatus) },
            complete: function(xhr, textStatus){ params.complete && params.complete(xhr); }
        });
    };
    app.ajax.post = function(url,params){
        return app.ajax(url,'post',params);
    };
    app.ajax.get = function(url,params){
        return app.ajax(url,'get',params);
    };
    app.conf = {
        ftype: {
            pay: '支付信息费', //

            waitAgree: '待同意',
            waitShipment: '待装货', //
            waitPay: '待支付',

            shipmentIng: '装货中', //
            fixPublishIng: '发布中', //

            yetShipment: '装货完成', //
            yetExpires: '已撤消/过期', //
            yetFinish: '已完成',
            reject: '拒绝/退费',
            catchs: '违约/异常'
        },
        colors: {
            yellow: '待支付,待同意,待装货,装货中,拒绝,待处理,处理中',
            red: '异常上报,违约异常',
            gray: '已完成,已成交,处理完成',
            green: '继续支付',
            blue: '详情,装货完成'
        },
        api: {
            listReceiptYet: '/plat/plat/infoFee/orders/list.action', //已接单
            listCatch: '/plat/plat/infoFee/ex/list.action', //违约异常列表
            listAll: '/plat/plat/infoFee/orders/alllist.action', //全部
            catchReport: '/plat/plat/infoFee/ex/save.action', //异常上报
            shipmentFinish: '/plat/plat/infoFee/wayBill/finish.action', //装货完成
            detailGoods: '/plat/plat/infoFee/transport/getSingleDetail.action', //我的货源详情
            shipmentForDo: 'http://59.110.104.99/plat/plat/infoFee/orders/saveOrderStatus.action', //同意装货、拒绝装货、拒绝所有车主装货

            statusGoods: '/tytpc/infoPayment/commonPay/getGoodStatus', //[支付]查询货物状态
            getTels: '/tytpc/infoPayment/pcPay/getPayPhoneList', //获取信息费支付电话列表
            saveOrder: '/tytpc/infoPayment/pcPay/saveWayBill', //[支付]保存订单
            getPayWay: '/tytpc/infoPayment/pcPay/getPcPaymentChannel', //[支付]获取支付渠道
            sbtPay: '/tytpc/infoPayment/pcPay/submitPaymentInfo', //[支付]发起微信/支付宝支付
            getPayResult: '/tytpc/infoPayment/pcPay/getPayStatusById', //[支付]获取支付结果状态
            createCodeImg: '/tytpc/tytpc/payment/weixin/getPayQRCode' //[支付]生成二维码
        },
        catchType : {
            '2':{ '1':'车主爽约', '2':'其他' },
            '1':{
                '1': '发货方爽约',
                '2': '货被他人拉走',
                '3': '实际货物信息与描述不符',
                '4': '装货时间延长,信息费延迟结算',
                '5': '虚假信息',
                '6': '运价纠纷',
                '7': '不想拉了',
                '8': '其他'
            }
        },
        btnImgPreload: [
            'img/btn_b_click.png',
            'img/btn_blue_big_click.png',
            'img/btn_blue_click.png',
            'img/btn_g_click.png',
            'img/s_001_2.png',
            'img/s_002_2.png',
            'img/s_016.png',
            'img/s_017.png',
            'img/ss_001_click.png'
        ],
        dataReceiptMap : {//接单状态
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
        listRequestCounts: 30
    };
    app.work = {
        getCommonParamsObj: function(){
            var obj = app.util.getQueryStringObject();
            return {
                clientSign: obj.clientSign ||'1',
                osVersion: obj.osVersion ||'',
                clientVersion: obj.clientVersion ||'',
                clientId: obj.clientId ||'',
                userId: obj.userId ||'',
                ticket: obj.ticket ||''
            };
        }
    };
    window.app = window['app'] || app;
})();

$(document)
    .on('click','.pop_btn_cancel,#dg_close', app.ui.popClose)
    .on('click','#btn_closeDetail',app.ui.detailClose)
    .on("ajaxStart",function(){$("#loading").show();})
    .on("ajaxStop",function(){$("#loading").hide();});

if(typeof baidu!=='undefined'){
    baidu.template.LEFT_DELIMITER='[@';
    baidu.template.RIGHT_DELIMITER='@]';
}

(typeof DD_belatedPNG!=='undefined') && DD_belatedPNG.fix('.ie6png,.ie6png_bg');

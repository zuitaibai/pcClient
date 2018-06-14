window.console = window['console']||{};
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
            else if(href.indexOf('release.teyuntong')>-1||href.indexOf('47.93.81.31')>-1) _url = 'http://47.93.81.31';
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
                global: false,
                success: function(data, textStatus, jqXHR){
                    $dialog_m.html(data);
                    paramsObj.overlay && $('#overlay').show();
                    paramsObj.cbk && paramsObj.cbk();
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
                global: false,
                success: function(data, textStatus, jqXHR){
                    $detail.html(data).show();
                    paramsObj.overlay && $('#overlay2').show();
                    paramsObj.cbk && paramsObj.cbk();
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
        }
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
                    app.ui.toastOpen(data.msg || '');
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
        dtype: {
            pay: '支付信息费',

            forAgree: '待同意',
            forShipment: '待装货',
            forPay: '待支付',

            shipmenting: '装货中',
            fixPublishing: '发布中',

            shipmented: '装货完成',
            expired: '已撤消/过期',
            eached: '已成交',
            reject: '已拒绝'

        },
        colors: {
            yellow: '待支付,待同意,待装货,拒绝',
            red: '异常上报,违约异常',
            gray: '已完成',
            green: '继续支付',
            blue: '详情,装货完成'
        },
        api: {
            listReceiptYet: '/plat/plat/infoFee/orders/list.action', //已接单
            listCatch: '/plat/plat/infoFee/ex/list.action', //违约异常列表
            listAll: '',
            catchReport: '/plat/plat/infoFee/ex/save.action', //异常上报
            shipmentFinish: '/plat/plat/infoFee/wayBill/finish.action', //装货完成
            detailGoods: '/plat/plat/infoFee/transport/getSingleDetail.action' //我的货源详情
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
        ]
    };
    app.work = {
        getCommonParamsObj: function(){
            var obj = app.util.getQueryStringObject();
            return {
                clientSign: obj.clientSign ||'',
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
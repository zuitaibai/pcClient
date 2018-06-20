var tsOrderNo;
$('.pop_event').on('click.pop','#sbt_pop_goodsfinish',function(){
    var postData = app.work.getCommonParamsObj();
    postData.tsOrderNo = tsOrderNo;
    app.ajax.post(app.conf.api.shipmentFinish,{
        data: postData,
        success:function(data){
            if(data.code==200){
                app.ui.toastOpen('装货完成操作成功！');
                app.ui.popClose();
            }
        }
    });
});

$('#goodsFinish_warp').on('loads', function(event, params) {
    params = params || {};
    if (!params.tsOrderNo) return;
    init(params.tsOrderNo);
});
var loadWeb = app.util.getQueryString('loadWeb');
if(loadWeb=='yes'){
    var tsOrderNo = app.util.getQueryString('tsOrderNo');
    if (tsOrderNo) init(tsOrderNo);
}

function init(tsOrderNo_) {
    tsOrderNo = tsOrderNo_;
}
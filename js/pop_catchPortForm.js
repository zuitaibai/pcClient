var exParty, tsOrderNo;
$('.pop_event').on('click.pop','input[name=p_reason]',function(){
    var $this = $(this);
    $('#catchReasonText')[$this.val()==8?'show':'hide']();
    $this.closest('li').addClass('active').siblings().removeClass('active');
}).on('input.pop','#resonOther',function(e){
    var $this = $(this), v = $.trim($this.val()), len = v.length;
    if(len>100) $this.val(v.substring(0,len=100));
    $this.next().text(len+'/100');
}).on('click.pop','#pop_sbt_catchport',function(){
    var postData = app.work.getCommonParamsObj();
    postData.tsOrderNo = tsOrderNo;
    postData.exParty = exParty;
    postData.exType = $('#catchformlist input:checked').val();
    postData.exOther = $.trim($('#resonOther').val());
    app.ajax.post(app.conf.api.catchReport,{
        data: postData,
        success:function(data){
            if(data.code==200){
                app.ui.toastOpen('上报成功！');
                app.ui.popClose();
            }
        }
    });
});

$('#catchPortForm_warp').on('loads', function(event, params) {
    params = params || {};
    if (!params.exParty || !params.tsOrderNo) return; //exParty: 1车主上报，2货主上报
    init(params.exParty,params.tsOrderNo);
});

var loadWeb = app.util.getQueryString('loadWeb');
if(loadWeb=='yes'){
    var exParty = app.util.getQueryString('exParty')||1;
    var tsOrderNo = app.util.getQueryString('tsOrderNo');
    if (exParty && tsOrderNo) init(exParty,tsOrderNo); //exParty: 1车主上报，2货主上报
}

function init(exParty_,tsOrderNo_) {//exParty: 1车主上报，2货主上报
    exParty = exParty_;
    tsOrderNo = tsOrderNo_;
    var list = app.conf.catchType[exParty], html = [];
    for(var i in list){
        html.push('<li><label><input type="radio" name="p_reason" value="'+i+'"> <span>'+list[i]+'</span></label></li>');
    }
    var lis = $('#catchformlist').html(html.join('\n')).children();
    lis.eq(0).addClass('active').find('input').prop('checked',true);
    lis.last().addClass('last');
}
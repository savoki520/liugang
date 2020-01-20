var $body=$('body');
var $href = "http://www.youguangchina.cn/";
// var $href = 'http://192.168.0.101:8080/';
// var appid = 'wx04d29c82e1d4eb0f';
var appid = 'wxc4aaae117c8ba4e5';

/*****foot_nav*****/
//禁止遮罩层穿透
// document.getElementById('alertK').addEventListener('touchmove', function (event) {
//     event.preventDefault();
// });

//定义弹窗动画
// $body.on('click','.merchant',function () {
//     console.log(444444);
//     // $(this).find('div:first-child').css('background-image','url("img/foot_nav/商家1.png")');
//     $('#alertK').show().find('#alert1').animate({
//         top:'0'
//     },100);
// });

$('.merchant').click(function () {
    // $(this).find('div:first-child').css('background-image','url("img/foot_nav/商家1.png")');
    $('#alertK').show().find('#alert1').animate({
        top:'0'
    },100);
    var shopaccount = localStorage.getItem('shopaccount');
    if(shopaccount){
        $('.login_remeber').prop('checked',true);
        $('#shopname').val(shopaccount);
    }
});
//ios去除alert（）的网址
window.alert = function(name){
    var iframe = document.createElement("IFRAME");
    iframe.style.display="none";
    iframe.setAttribute("src", 'data:text/plain,');
    document.documentElement.appendChild(iframe);
    window.frames[0].window.alert(name);
    iframe.parentNode.removeChild(iframe);
};

$('.back').click(function () {
    $('#alert1').find('input').val('');
    $('#alert1').animate({
        top:'100vh'
    },200,function () {
        $('#alertK').hide();
        // $('.merchant').find('div:first-child').css('background-image','url("img/foot_nav/商家2.png")');
    });
});
//商家登陆记住账号
$('.login_remeber').click(function () {
    console.log($(this).prop('checked'));
    if($(this).prop('checked')){
        localStorage.setItem('shopaccount',$('#shopname').val());
    }else {
        localStorage.setItem('shopaccount','');
    }
});
//定义弹窗返回动画
// $body.on('click','#alert1 .back',function () {
//     $('#alert1').find('input').val('');
//     $('#alert1').animate({
//         top:'100vh'
//     },200,function () {
//         $('#alertK').hide();
//         // $('.merchant').find('div:first-child').css('background-image','url("img/foot_nav/商家2.png")');
//     });
// });

/*****index*****/
if($body.parent().attr('data-page')==='index'){
    //微信授权
    setTimeout('cartoofour()',1500);
    if(sessionStorage.getItem('denglu') !== null&&sessionStorage.getItem('denglu')!==''){//代表已经授权了

        // bannerread();
        //banner图定死三张开始
        // var length=$('#bannerT').find('a').length;
        // $('#bannerT').css('width',(3+2)*95+'%');
        // var bannerDwidth=5.5*(length-1);
        // $('#bannerD').css('width',bannerDwidth+'vw').css('left',(95-bannerDwidth)/2+'vw');
        // for(var i=0;i<length-1;i++){
        //     if(i===0){
        //         $('#bannerD').append('<div class="active"></div>');
        //     }else {
        //         $('#bannerD').append('<div></div>');
        //     }
        // }
        //banner图定死三张结尾
        // newread();
        hotread();
        var url = urlSearch();
        if(url.sh === '0'){
            sessionStorage.setItem('sh',url.sh);
        }
        var personal=JSON.parse(localStorage.getItem('personal'));
        $('.ban_avterimg').attr('src',personal.headPic);
        identity(localStorage.getItem('identity'));
    }else{
        weixinShouquan();
    }
    function weixinShouquan() {
        var appid = 'wxc4aaae117c8ba4e5';
        var getRequest = urlSearch();
        if (getRequest.code!==undefined&&getRequest.code!==null&&getRequest.code!==localStorage.getItem('code')) {
            localStorage.setItem('code',getRequest.code);
            this.code = getRequest.code;
            //把code值传给后台；
            var data = {code:getRequest.code,port:'0',shopId:''};
            console.log(data);
            $.ajax({//微信授权
                url:$href + 'MarketPlatform/user/search',
                type:'post',
                contentType:'application/json',
                data:JSON.stringify(data),
                dataType:'json',
                success:function (data) {
                    var url = urlSearch();
                    sessionStorage.setItem('sh',url.sh);//sh为undefined的时候，代表进入界面的方式非商户后台
                    identity(data.identity);
                    console.log(data);
                    sessionStorage.setItem('denglu','1');
                    localStorage.setItem('openid',data.openid);
                    localStorage.setItem('identity',data.identity);
                    localStorage.setItem('personal',JSON.stringify({openid:data.openid,headPic:data.headPic,nickName:data.nickName}));
                    // bannerread();
                    $('.ban_avterimg').attr('src',data.headPic);
                    // newread();
                    hotread();


                    //banner图定死三张开始
                    // var length=$('#bannerT').find('a').length;
                    // $('#bannerT').css('width',(3+2)*95+'%');
                    // var bannerDwidth=5.5*(length-1);
                    // $('#bannerD').css('width',bannerDwidth+'vw').css('left',(95-bannerDwidth)/2+'vw');
                    // for(var i=0;i<length-1;i++){
                    //     if(i===0){
                    //         $('#bannerD').append('<div class="active"></div>');
                    //     }else {
                    //         $('#bannerD').append('<div></div>');
                    //     }
                    // }
                    //banner图定死三张结尾

                },
                error:function () {
                    alert("请勿频繁操作！");
                }
            });
            var handle = function(event){
                event.preventDefault(); //阻止元素发生默认的行为
            };
            document.body.addEventListener('touchmove',handle,false);//添加监听事件--页面不可滚动
            // document.body.removeEventListener('touchmove',handle,false);//移除监听事件--页面恢复可滚动
        }
//执行微信授权操作；
        else{
            localStorage.setItem('url',window.location.href);
            var pageUrl = window.location.href
                .replace(/[/]/g, "%2f")
                .replace(/[:]/g, "%3a")
                .replace(/[#]/g, "%23")
                .replace(/[&]/g, "%26")
                .replace(/[=]/g, "%3d");
            //调用微信登陆授权获取code值
            window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appid  + "" +
                "&redirect_uri=" + pageUrl + "&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect";
        }
    }

    //判断进入的用户的身份，商户or团长,m为身份
    function identity(m) {
        var sh = sessionStorage.getItem('sh');
        if(sh==='0'){//sh存在，代表进入的人是商户的身份
            $('.prompt').hide();
            window.history.pushState(null, null, 'http://www.youguangchina.cn/hd/platformapp/index.html?sh=0');
            ssss();
        }else{//没有sh，代表进入的人的身份是普通用户or团长
            window.history.pushState(null, null, 'http://www.youguangchina.cn/hd/platformapp/index.html');
            ssss();
            if(m === 'header'){//团长
                $('.prompt').hide();
                $('.ban_avter').show();
            }else {//普通用户
                $('.prompt').show();
                setTimeout('cartoon()',1600);
                $('.ban_avter').hide();
            }
        }
    }


    //读取banner
    function bannerread() {
        var banner = $('#bannerT');
        banner.children().remove();
        var da = {createrLogo1:'0',createrLogo2:'0',activitystatus:'',shopId:'',nowPage:'',eachNumber:'',newstatus:'',hotstatus:'',banner:1};
        $.ajax({
            url:$href + 'MarketPlatform/activity/getActivities',
            type:'post',
            data:JSON.stringify(da),
            dataType:'json',
            contentType:'application/json',
            success:function (data) {
                console.log(data);
                for(var i = 0;i<data.totalNum;i++){
                    banner.append("<a href=\"../project/platform/index.html?activityId="+ data.activities[i].activityId +"" +
                        "&shopId="+ data.activities[i].shopid +"&openid=null&getertype=0&status=0\" style=\"background-image: url(\'"+ data.activities[i].QRCode1 +"\');\"></a>");
                    if(i === data.totalNum-1){
                        banner.append("<a href=\"../project/platform/index.html?activityId="+ data.activities[0].activityId +"" +
                            "&shopId="+ data.activities[0].shopid +"&openid=null&getertype=0&status=0\"  style=\"background-image: url(\'"+ data.activities[0].QRCode1 +"\');\"></a>");
                    }
                }
                $('#bannerT').css('width',(data.totalNum+2)*95+'%');
                    // banner.append("<a href=\"../project/platform/index.html?activityId="+ data.activities[0].activityId +"" +
                    //    "&shopId="+ data.activities[0].shopid +"&openid=null&getertype=0&status=0\"  style=\"background-image: url(\'"+ data.activities[0].QRCode1 +"\');\"></a>");
                var length=$('#bannerT').find('a').length;
                // console.log(length);
                var bannerDwidth=5.5*(length-1);
                $('#bannerD').css('width',bannerDwidth+'vw').css('left',(95-bannerDwidth)/2+'vw');
                for(var i=0;i<length-1;i++){
                    if(i===0){
                        $('#bannerD').append('<div class="active"></div>');
                    }else {
                        $('#bannerD').append('<div></div>');
                    }
                }
            },
            error:function () {
                alert('请勿频繁操作');
            }
        });
    }

    //定义banner滚动
    // var bannerLen=0;
    //
    // function bannerTime() {
    //     var length=$('#bannerT').find('a').length;
    //     bannerLen++;
    //     $('#bannerD').find('div').removeClass('active');
    //     $('#bannerD').find('div').eq(bannerLen).addClass('active');
    //     if(bannerLen===length-1){
    //         $('#bannerD').find('div').eq(0).addClass('active');
    //     }
    //     var animateLength;
    //     if(bannerLen>length-1){
    //         bannerLen=0;
    //         $("#bannerT").css({"left":0});
    //         bannerLen++;
    //         animateLength = bannerLen*(-95)+"vw";
    //         $("#bannerT").stop().animate({"left":animateLength},1000,function(){
    //             if(bannerLen===length-1){
    //                 bannerLen=0;
    //                 $("#bannerT").css({"left":0});
    //             }
    //         });
    //     }else {
    //         animateLength = bannerLen*(-95)+"vw";
    //         $("#bannerT").stop().animate({"left":animateLength},1000,function(){
    //             if(bannerLen===length-1){
    //                 bannerLen=0;
    //                 $("#bannerT").css({"left":0});
    //             }
    //         });
    //     }
    //     // console.log(bannerLen);
    // }
    // var bannnertime=setInterval(bannerTime,3000);
    //
    // //banner切换
    // function bannerBack() {
    //     clearInterval(bannnertime);
    //     var length=$('#bannerT').find('a').length;
    //     bannerLen--;
    //     $('#bannerD').find('div').removeClass('active');
    //     $('#bannerD').find('div').eq(bannerLen).addClass('active');
    //     if(bannerLen===0){
    //         $('#bannerD').find('div').eq(length-1).addClass('active');
    //     }
    //     var animateLength;
    //     if(bannerLen<0){
    //         bannerLen=length-1;
    //         $("#bannerT").css({"left":(length-1)*(-95)+"vw"});
    //         bannerLen--;
    //         animateLength = bannerLen*(-95)+"vw";
    //         $("#bannerT").stop().animate({"left":animateLength},1000,function(){
    //             if(bannerLen===0){
    //                 bannerLen=length-1;
    //                 $("#bannerT").css({"left":(length-1)*(-95)+"vw"});
    //             }
    //         });
    //     }else {
    //         animateLength = bannerLen*(-95)+"vw";
    //         $("#bannerT").stop().animate({"left":animateLength},1000,function(){
    //             if(bannerLen===0){
    //                 bannerLen=length-1;
    //                 $("#bannerT").css({"left":(length-1)*(-95)+"vw"});
    //             }
    //         });
    //     }
    //     // console.log(bannerLen);
    //     bannnertime=setInterval(bannerTime,2500);
    // }
    // function bannerGo() {
    //     clearInterval(bannnertime);
    //     bannerTime();
    //     bannnertime=setInterval(bannerTime,2500);
    // }
    // //banner滑动
    // var startX1,startY1,startX2,startY2;
    // $body.on('touchstart','#banner',function (e) {
    //     // console.log(e);
    //     startX1 = e.originalEvent.changedTouches[0].pageX;
    //     startY1 = e.originalEvent.changedTouches[0].pageY;
    // });
    // $body.on('touchend','#banner',function (e) {
    //     // console.log(e);
    //     startX2 = e.originalEvent.changedTouches[0].pageX;
    //     startY2 = e.originalEvent.changedTouches[0].pageY;
    //
    //     var sx=startX2-startX1;
    //     var sy=startY2-startY1;
    //     // console.log(sx,sy);
    //     if(sx>50&&(sy<200&&sy>-200)){
    //         // console.log('右滑');
    //         bannerBack();
    //
    //         // $(this).siblings().removeClass('shanxian').find('.dgo').hide().siblings().show();
    //         // $(this).addClass('right').removeClass('left');
    //
    //     }else if(sx<-50&&(sy<200&&sy>-200)){
    //         // console.log('左滑');
    //         bannerGo();
    //
    //         // $(this).addClass('left').removeClass('right');
    //         // $(this).siblings().find('.dt').hide().siblings().show();
    //         // $(this).siblings().addClass('shanxian');
    //
    //     }
    // });


    //最新列表数据读取
    function newread() {
        var ne = $('#scroll');
        ne.children().remove();
        var dat = {createrLogo1:'0',createrLogo2:'0',activitystatus:'',shopId:'',nowPage:'',eachNumber:'',newstatus:1,hotstatus:'',banner:''};
        $.ajax({
            url:$href + 'MarketPlatform/activity/getActivities',
            type:'post',
            data:JSON.stringify(dat),
            dataType:'json',
            contentType:'application/json',
            success:function (data) {
                console.log(data);
                for(var i = 0;i<data.activities.length;i++) {
                    if(i === 0){
                        ne.append('<a class="pos0" href="../project/platform/index.html?activityId='+data.activities[i].activityId+'' +
                            '&shopId='+data.activities[i].shopid+'&openid=null&getertype=0&status=0">\n' +
                            '                <div class="hot_item_img">\n' +
                            '                    <img src="'+ data.activities[i].QRCode1 +'">\n' +
                            '                </div>\n' +
                            '                <div class="hot_item_title">'+ data.activities[i].activityName +'</div>\n' +
                            '               <div class="hot_item_box">\n' +
                            '                    <div class="hot_newprice">现价:￥'+data.activities[i].nowprice+'</div>\n' +
                            '                    <div class="hot_commission"><span class="pro_item_yjone">佣金</span><span class="pro_item_yjtwo">'+data.activities[i].commissionMoney+'￥</span></div>\n' +
                            '                </div>\n'+
                            '            </a>')
                    }else if(i === 1){
                        ne.append('<a class="pos1" href="../project/platform/index.html?activityId='+data.activities[i].activityId+'' +
                            '&shopId='+data.activities[i].shopid+'&openid=null&getertype=0&status=0">\n' +
                            '                <div class="hot_item_img">\n' +
                            '                    <img src="'+ data.activities[i].QRCode1 +'">\n' +
                            '                </div>\n' +
                            '                <div class="hot_item_title">'+ data.activities[i].activityName +'</div>\n' +
                            '               <div class="hot_item_box">\n' +
                            '                    <div class="hot_newprice">现价:￥'+data.activities[i].nowprice+'</div>\n' +
                            '                    <div class="hot_commission"><span class="pro_item_yjone">佣金</span><span class="pro_item_yjtwo">'+data.activities[i].commissionMoney+'￥</span></div>\n' +
                            '                </div>\n'+
                            '            </a>')
                    }else if(i === data.activities.length-1){
                        ne.append('<a class="pos3" href="../project/platform/index.html?activityId='+data.activities[i].activityId+'' +
                            '&shopId='+data.activities[i].shopid+'&openid=null&getertype=0&status=0">\n' +
                            '                <div class="hot_item_img">\n' +
                            '                    <img src="'+ data.activities[i].QRCode1 +'">\n' +
                            '                </div>\n' +
                            '                <div class="hot_item_title">'+ data.activities[i].activityName +'</div>\n' +
                            '               <div class="hot_item_box">\n' +
                            '                    <div class="hot_newprice">现价:￥'+data.activities[i].nowprice+'</div>\n' +
                            '                    <div class="hot_commission"><span class="pro_item_yjone">佣金</span><span class="pro_item_yjtwo">'+data.activities[i].commissionMoney+'￥</span></div>\n' +
                            '                </div>\n'+
                            '            </a>')
                    }else {
                        ne.append('<a class="pos2" href="../project/platform/index.html?activityId='+data.activities[i].activityId+'' +
                            '&shopId='+data.activities[i].shopid+'&openid=null&getertype=0&status=0">\n' +
                            '                <div class="hot_item_img">\n' +
                            '                    <img src="'+ data.activities[i].QRCode1 +'">\n' +
                            '                </div>\n' +
                            '                <div class="hot_item_title">'+ data.activities[i].activityName +'</div>\n' +
                            '               <div class="hot_item_box">\n' +
                            '                    <div class="hot_newprice">现价:￥'+data.activities[i].nowprice+'</div>\n' +
                            '                    <div class="hot_commission"><span class="pro_item_yjone">佣金</span><span class="pro_item_yjtwo">'+data.activities[i].commissionMoney+'￥</span></div>\n' +
                            '                </div>\n'+
                            '            </a>')
                    }
                }
            },
            error:function () {
                alert('请勿频繁操作');
            }
        });
    }

    //最新动画
    var hotTime=setInterval(function () {
        go(true)
    },3000);

    $body.on('click', '.ban_r_btn', function () {
        console.log(1);
        go(true);
    }).on('click', '.ban_l_btn', function () {
        console.log(2);
        go();
    });
    //定义环绕切换事件
    function go(where) {
        // where表示前一张还是后一张, true则为后一张
        const box = $('#scroll'),
            imgs = box.find('a'),
            pos = ((box.data('pos') | 0) + (where ? 1 : -1) + imgs.length) % imgs.length;
        box.data('pos', pos);
        imgs.each(function (i,v) {
            // console.log(i,v);
            switch (i) {
                case (pos - 1 + imgs.length) % imgs.length:
                    v.className = "pos3";
                    break;
                case pos:
                    v.className = "pos0";
                    break;
                case (pos + 1) % imgs.length:
                    v.className = "pos1";
                    break;
                default:
                    v.className = "pos2";
            }
        });
    }

    //热门列表数据读取
    function hotread() {
        var hot = $('.all');
        hot.children().remove();
        var dat = {createrLogo1:'0',createrLogo2:'0',activitystatus:'',shopId:'',nowPage:'',eachNumber:'',newstatus:'',hotstatus:1,banner:''};
        $.ajax({
            url:$href + 'MarketPlatform/activity/getActivities',
            type:'post',
            data:JSON.stringify(dat),
            dataType:'json',
            contentType:'application/json',
            success:function (data) {
                console.log(data);
                for(var i = 0;i<data.activities.length;i++) {
                    hot.append('<a class="all_item"  href="../project/platform/index.html?activityId='+data.activities[i].activityId+'' +
                        '&shopId='+data.activities[i].shopid+'&openid=null&getertype=0&status=0">\n' +
                        '                <div class="all_one">\n' +
                        '                    <img src="'+ data.activities[i].QRCode1 +'">\n' +
                        '                </div>\n' +
                        '                <div class="all_two">\n' +
                        '                    <div class="all_two_title">'+ data.activities[i].activityName +'</div>\n' +
                        '                    <div class="all_two_price">\n' +
                        '                        <div class="all_two_oldprice">原价：￥'+ data.activities[i].realprice +'</div>\n' +
                        '                        <div class="all_two_newprice">平台价：￥'+ data.activities[i].nowprice +'</div>\n' +
                        '                    </div>\n' +
                        '                </div>\n' +
                        '                <div class="ma_mc_item_commission">\n' +
                        '                     <div class="pro_item_yjone">佣金</div>\n' +
                        '                     <div class="pro_item_yjtwo">'+data.activities[i].commissionMoney+'<span>￥</span></div>\n' +
                        '                </div>\n' +
                        '            </a>')
                }
            },
            error:function () {
                alert('请勿频繁操作');
            }
        });
    }

    //主页分类跳转
    $body.on('click','#classification_2 a',function () {
        var st = $(this).attr('data-id');
        localStorage.setItem('classtz',st);
        window.location.href = 'classification.html';
    });
    $('.prompt_item').click(function () {
        window.location.href = 'http://www.youguangchina.cn/hd/platformapp/authentication.html?dataType=1&au=1'
    });
}

/*****classification*****/
if($body.parent().attr('data-page')==='classification'){
    //定义tab切换
    $body.on('click','#classification_2 a',function () {
        $(this).parents('section').find('a').removeClass('active');
        $('.moreclass a').removeClass('active');
        $(this).addClass('active');
        $(this).find('.img1').addClass('act').siblings('.img2').removeClass('act');
        $(this).siblings('a').find('.img').removeClass('act').siblings('.img2').addClass('act');
    });
    $body.on('click','.moreclass a',function () {
        $('#classification_2 a').removeClass('active');
        $(this).parents('section').find('a').removeClass('active');
        $(this).addClass('active');
        $(this).find('.img1').addClass('act').siblings('.img2').removeClass('act');
        $(this).siblings('a').find('.img').removeClass('act').siblings('.img2').addClass('act');
    });

    //定义界面跳转显示tab选项
    var dataObj=urlSearch();
    // console.log(dataObj);
    $('#classification_1').find('a[data-type1='+dataObj.dataType1+']').trigger('click');

    ssss();
    //初始化选项
    classzt();
    function classzt() {
        if(dataObj.k === '1'||dataObj.k === 1){//通过导航栏进入
            $('.pro_list').children().not('.index_anmat').not('.loader').remove();
            read('',1,'','','','0');
        }else {
            var st = localStorage.getItem('classtz');
            $('#classification_2').find('a').removeClass('active').eq(st).addClass('active');
            if(st === '0'||st === '6'){//分类为全部or更多
                st = undefined;
            }else {
                st = parseInt(st) - 1;
            }
            $('.pro_list').children().not('.index_anmat').not('.loader').remove();
            read('',1,'',st,'','0');
        }
        var data = {openid:localStorage.getItem('openid')};
        $.ajax({
            url:$href + 'MarketPlatform/wx/getUserInfo',
            type:'post',
            data:JSON.stringify(data),
            dataType:'json',
            contentType:'application/json',
            success:function (data) {
                // console.log(data);
                if(data.result !== 'error'){
                    $('.presonl_one_name').text(data.nickName);
                    $('.presonl_one_avter').attr('src',data.headPic);
                    $('.presonl_two_addressfont').text(data.address);
                }else {
                    alert('用户不存在！');
                }
            },
            error:function () {
                alert('请勿频繁操作');
            }
        })
    }

    //获取列表数据
    function read(name,page,sort,classification,region,farpoint) {//name为搜索时的活动名称，page为当前页码，sort为排序方式（暂无）classification为分类类名
        sort = 'beginTime';
        var pa = $('.pro_load');
        $('.loader').show();
        if(classification === undefined){
            classification = '';
        }
        if(region === undefined||region === '全部地区'){
            region = '';
        }
        var data = {activityName:name,nowPage:page,eachNumber:50,actcategory:classification,
            sort:sort,region:region,farpoint:farpoint,openid:localStorage.getItem('openid')};
        // alert(JSON.stringify(data));
        // console.log(data);
        $.ajax({
            url:$href + 'MarketPlatform/PTYD/PTYDshopManagement',
            type:'post',
            data:JSON.stringify(data),
            dataType:'json',
            contentType:'application/json',
            success:function (data) {
                console.log(data);
                var k = Math.ceil(data.PTYDshopActTotalNum/50);
                // alert(JSON.stringify(data));
                // alert(data.activitylist.length);
                if(data.activitylist.length === 0){//没有数据
                    pa.hide();
                    setTimeout('cartoothree()',10);
                }else {
                    pa.show();
                    if(page === k){//数据读到最后一页，不能再进行加载更多操作
                        pa.text('暂无更多数据！')
                    }else {
                        pa.text('下一页');
                    }
                    page++;
                    pa.attr('data-page',page);
                    for(var i = 0;i<data.activitylist.length;i++){
                        var dis;
                        if(data.activitylist[i].distance === 'undefined'){
                            dis = '无';
                        }else {
                            dis = data.activitylist[i].distance;
                        }
                        $('.loader').before('<a href="../project/platform/index.html?activityId='+data.activitylist[i].activityId+'' +
                            '&shopId='+data.activitylist[i].shopid+'&openid=null&getertype=0&status=0" class="pro_item">\n' +
                            '            <div class="pro_item_one">\n' +
                            '                <div class="pro_item_img">\n' +
                            '                    <img src=\''+ data.activitylist[i].QRCode1 +'\'>\n' +
                            '                </div>\n' +
                            '                <div class="pro_item_hot">热度：<span class="pro_hot">'+ data.activitylist[i].joinnumber +'</span></div>\n' +
                            '            </div>\n' +
                            '            <div class="pro_item_two">\n' +
                            '                <div class="pro_item_name">' + data.activitylist[i].activityName + '</div>\n' +
                            '                <div class="pro_item_price">\n' +
                            '                    <div class="pro_item_oldprice">原价：￥<span class="pro_oldprice">'+ data.activitylist[i].realprice +'</span></div>\n' +
                            '                    <div class="pro_item_box">\n' +
                            '                        <div class="pro_item_newprice">￥<span class="pro_newprice">'+data.activitylist[i].nowprice+'</span></div>\n' +
                            '                        <div class="pro_item_commiss">\n' +
                            '                            <span class="pro_item_yjone">佣金</span>\n' +
                            '                            <span class="pro_item_yjtwo">'+data.activitylist[i].commissionMoney+'￥</span>\n' +
                            '                        </div>\n' +
                            '                    </div>\n'+
                            '                </div>\n' +
                            '                <div class="pro_item_distance">'+dis+'</div>\n'+
                            '            </div>\n' +
                            '        </a>');
                        if(i === data.activitylist.length-1){
                            $('.loader').hide();
                        }
                    }
                }
            },
            error:function () {
                alert('请勿频繁操作');
            }
        })
    }

    //选择2级分类
    $('.c_nav').click(function () {
        $('.presonl_two_sort').removeClass('presonl_two_sort_add').attr('data-id','0');
        $('.presonl_two_time').addClass('presonl_two_sort_add');
        $('.pro_list').children().not('.index_anmat').not('.loader').remove();
        $('.pro_load').attr('data-page',1);
        var name = $('#nav_text').val();
        var cla = $(this).attr('data-id');
        $('.index_anmat').show();
        var region = $('.nav_address').attr('data-address');
        read(name,1,'',cla,region,'0');
        localStorage.setItem('classtz',$('.c_nav').index(this));
        var more = $('.moreclass');
        if(more.css('display') === 'block'){
            more.animate({
                height:'0'
            },function () {
                more.css('display','none')
            })
        }
    });
    //更多2级分类
    $('.more').click(function () {
        var more = $('.moreclass');
        if(more.css('display') === 'none'){
            more.show().animate({
                height:'10vw'
            })
        }
    });
    $('.c_mnav').click(function () {
        $('.presonl_two_sort').removeClass('presonl_two_sort_add').attr('data-id','0');
        $('.presonl_two_time').addClass('presonl_two_sort_add');
        $('.pro_list').children().not('.index_anmat').not('.loader').remove();
        $('.pro_load').attr('data-page',1);
        var name = $('#nav_text').val();
        var cla = $(this).attr('data-id');
        var region = $('.nav_address').attr('data-address');
        $('.index_anmat').show();
        read(name,1,'',cla,region,'0');
        localStorage.setItem('classtz','0');
    });
    //活动搜索回车确定
    $('#nav_text').keydown(function (event) {
        if (event.keyCode == 13) {
            $('.nav_ss').triggerHandler('click');
        }
    });
    //搜索
    $('.nav_ss').click(function () {
        $('.pro_list').children().not('.index_anmat').not('.loader').remove();
        $('.pro_load').attr('data-page',1);
        var name = $('#nav_text').val();
        var cla = $('.active').attr('data-id');
        var region = $('.nav_address').attr('data-address');
        $('.index_anmat').show();
        var distance = $('.presonl_two_sort').attr('data-id');
        read(name,1,'',cla,region,distance);
    });
    //选择3级分类
    $('.c3_navdp').click(function () {
        alert('即将上线，敬请期待');
    });


    $(document).scroll(function () {
        var height = $(document).height();
        var scrheight = $(document).scrollTop();
        var viewh = $(window).height();
        if(viewh+scrheight >= height){
            var load = $('.pro_load');
            var tex = load.text();
            if(tex === '下一页'){
                var page = parseInt(load.attr('data-page'));
                var name = $('#nav_text').val();
                var cla = $('.active').attr('data-id');
                var region = $('.nav_address').attr('data-address');
                var distance = $('.presonl_two_sort').attr('data-id');
                read(name,page,'',cla,region,distance);
            }
        }
    });
    
    $('.nav_address').click(function () {
        $('.region').show();
    });
    //地区选择
    $('.region_item').click(function () {
        var add = $(this).children('.region_item_font').text();
        $('.pro_list').children().not('.index_anmat').not('.loader').remove();
        $('.region').hide();
        $('.nav_address').text(add).attr('data-address',add);
        var name = $('#nav_text').val();
        var cla = $('.active').attr('data-id');
        $('.index_anmat').show();
        var distance = $('.presonl_two_sort').attr('data-id');
        read(name,1,'',cla,add,distance);
    });

//附近活动
    $('.presonl_two_sort').click(function () {
        $(this).addClass('presonl_two_sort_add');
        $('.presonl_two_time').removeClass('presonl_two_sort_add');
        $('.pro_list').children().not('.index_anmat').not('.loader').remove();
        $('.pro_load').attr('data-page',1);
        var name = $('#nav_text').val();
        var cla = $('.active').attr('data-id');
        var region = $('.nav_address').attr('data-address');
        $('.index_anmat').show();
        $('.presonl_two_sort').attr('data-id','1');
        read(name,1,'',cla,region,'1');
    });
//最新活动
    $('.presonl_two_time').click(function () {
        $(this).addClass('presonl_two_sort_add');
        $('.presonl_two_sort').removeClass('presonl_two_sort_add').attr('data-id','0');
        $('.pro_list').children().not('.index_anmat').not('.loader').remove();
        $('.pro_load').attr('data-page',1);
        var name = $('#nav_text').val();
        var cla = $('.active').attr('data-id');
        var region = $('.nav_address').attr('data-address');
        $('.index_anmat').show();
        read(name,1,'',cla,region,'0');
    });
//非团长进入弹框点击进入入驻界面
    $('.prompt_item').click(function () {
        window.location.href = 'authentication.html';
    });
    //点击地区外围退出选择区域
    $('.region').click(function (event) {
        if(event.target==this){
            $(this).hide();
        }
    })
}

if($body.parent().attr('data-page')==='authentication'){
    var he = urlSearch();
    csh(he.dataType);
    //初始化商家入驻和团长申请
    function csh(i) {
        $('.infor_nav_item').removeClass('infor_nav_active').eq(parseInt(i)).addClass('infor_nav_active');
        if(i === '0'){//商家
            $('.more_img').hide();
            $('.shop_title').show();
            $('.shop_infor').show();
            $('.information').hide();
            $('.title').hide();
            $('#banner').css('background-image','url("image/index/i_31.png")');

        }else {
            $('.more_img').show();
            $('.shop_title').hide();
            $('.shop_infor').hide();
            $('.information').show();
            $('.title').show();
            $('#banner').css('background-image','url("image/index/i_4.png")')
        }
    }
    //提交数据
    $('#submit').click(function () {
       var name = $('#au_name').val();
       var phone = $('#au_phone').val();
       var address = $('#au_address').val();
        var data = {openid:localStorage.getItem('openid'),headerName:name,headertel:phone,headeraddress:address};
        console.log(data);
        var num1 = parseInt(phone);
        var num2 = num1.toString();
        if(phone===''||phone===null||name===''||name===null){
            alert('请完善个人信息！');
        }else if(phone.length !== 11||num2 !== phone){
            alert('请填写正确的联系方式！');
        }else {
            $.ajax({
                url:$href + 'MarketPlatform/PTYD/PTYDheaderapply',
                type:'post',
                data:JSON.stringify(data),
                dataType:'json',
                contentType:'application/json',
                success:function (data) {
                    console.log(data);
                    if(data.result === 'success'){
                        alert('提交成功，请耐心等待！');
                        $('#au_name').val(null);
                        $('#au_phone').val(null);
                        $('#au_address').val(null);
                    }else if(data.message === '团长信息已在审核中，请勿重复提交！'){
                        alert('您已提交信息，请勿重复提交！')
                    }else if(data.message === '团长信息已审核通过，请勿重复提交！'){
                        alert('您已是团长！请勿再次申请！')
                    }
                },
                error:function () {
                    alert('请勿频繁操作');
                }
            })
        }
    });
    //商家、团长申请切换
    $('.infor_nav_item').click(function () {
        $('.infor_nav_item').removeClass('infor_nav_active');
        $(this).addClass('infor_nav_active');
        var status = $(this).attr('data-status');
        if(status === '0'){//商家
            $('.more_img').hide();
            $('.shop_title').show();
            $('.shop_infor').show();
            $('.title').hide();
            $('.equity').hide();
            $('.information').hide();
            $('#banner').css('background-image','url("image/index/i_31.png")')
        }else {
            $('.more_img').show();
            $('.title').show();
            $('.equity').show();
            $('.information').show();
            $('.shop_title').hide();
            $('.shop_infor').hide();
            $('#banner').css('background-image','url("image/index/i_4.png")')
        }

    });
    //商家入驻提交数据
    $('.submit').click(function () {
        var name = $('.au_name').val();
        var phone = $('.au_phone').val();
        var address = $('.au_address').val();
        var shopname = $('.au_shopname').val();
        var xqaddress = $('.xxlocat').val();
        address = address + xqaddress;
        var data = {leaderName:name,tel1:phone,shopAddress:address,shopName:shopname,workHours:'',tel2:''};
        console.log(data);
        var num1 = parseInt(phone);
        var num2 = num1.toString();
        if(phone===''||phone===null||name===''||name===null||address===''||address===null||shopname===''||shopname===num1){
            alert('请完善个人信息！');
        }else if(phone.length !== 11||num2 !== phone){
            alert('请填写正确的联系方式！');
        }else {
            $.ajax({
                url:$href + 'MarketPlatform/PTYD/shopapply',
                type:'post',
                data:JSON.stringify(data),
                dataType:'json',
                contentType:'application/json',
                success:function (data) {
                    console.log(data);
                    if(data.result === 'success'){
                        alert('提交成功，请耐心等待！');
                        $('.au_name').val(null);
                        $('.au_phone').val(null);
                        $('.au_address').val(null);
                        $('.au_shopname').val(null);
                        $('.xxlocat').val(null);
                    }
                },
                error:function () {
                    alert('请勿频繁操作');
                }
            })
        }
    });

    var urls = urlSearch();
    if(urls.au==='1'){//通过入驻进，非其他页面进来

    }else {
        ssss();
    }

}

if($body.parent().attr('data-page')==='personalcenter'){
    //弹窗
    document.getElementById('alertK').addEventListener('touchmove', function (event) {
        event.preventDefault();
    });
    document.body.addEventListener('touchstart', function () { });
    $body.on('click','.merchant',function () {
        // console.log(14556);
        // $(this).find('div:first-child').css('background-image','url("img/foot_nav/商家1.png")');
        $('#alertK').show().find('#alert1').animate({
            top:'0'
        },100);
    });
    $body.on('click','#alert1 .back',function () {
        $('#alert1').find('input').val('');
        $('#alert1').animate({
            top:'100vh'
        },200,function () {
            $('#alertK').hide();
            // $('.merchant').find('div:first-child').css('background-image','url("img/foot_nav/商家2.png")');
        });
    });
    
    //初始化数据读取
    peroread();
    function peroread() {
        var data = {openid:localStorage.getItem('openid')};
        console.log(data);
        $.ajax({
            url:$href + 'MarketPlatform/wx/getUserInfo',
            type:'post',
            data:JSON.stringify(data),
            dataType:'json',
            contentType:'application/json',
            success:function (data) {
                console.log(data);
                if(data.result !== 'error'){
                    $('.header_avter').attr('src',data.headPic);
                    $('.header_avtername').text(data.nickName);
                    if(data.identity === '0'||data.identity === '2'){//普通用户
                        $('.content_onebecome').show();
                        $('.content_oneamout').text('0.0');
                        $('.header_totalcomiss').text('0.0');
                        $('.header_avter_id').hide();
                        $('.header_one_id').hide();
                    }else {//团长
                        $('.content_onebecome').hide();
                        $('.header_monthcommiss').text(data.headerEarning);
                        $('.header_totalcomiss').text(data.allheaderEarning);
                        $('.header_avter_id').show();
                        $('.header_one_id').show();
                        $('.header_one_item_time').text(data.headerjointime);
                        $('.header_one_item_address').text(data.address)
                    }
                    setTimeout('cartoontwo()',500);
                }else {
                    alert('用户不存在！');
                }
            },
            error:function () {
                alert('请勿频繁操作');
            }
        })
    }
    ssss();
    
    //个人中心-->佣金明细
    $('.header_comiss').click(function () {
        window.location.href = 'headdetail.html';
    });
    //个人中心-->提现
    $(".content_withdraw").click(function () {
        alert('您的余额为0，无法提现！');
    });
    //个人中心-->版本说明退出与进入
    $('.version_header_cannel').click(function () {
        $(".versionbox").toggle();
    });
    $('#version').click(function () {
        // $(".versionbox").toggle();
        $(".versionbox").toggle().children('.version').addClass('cate');
    });
    //个人中心-->关于我们退出与进入
    $('.about_header_cannel').click(function () {
        $('.aboutbox').toggle();
    });
    $('#about').click(function () {
        $('.aboutbox').toggle().children('.about').addClass('cate');
    });
    //个人中心-->联系我们退出与进入
    $('.contact_header_cannel').click(function () {
        $('.contactbox').toggle();
    });
    $('#contact').click(function () {
        $('.contactbox').toggle().children('.contact').addClass('cate');
    });
    //个人中心-->全部订单
    $('.content_two_order').click(function () {
        window.location.href = 'order.html';
        localStorage.setItem('coor',4);
    });
    //个人中心-->进入特定的订单
    $('.menu_item').click(function () {
        var index = $('.menu_item').index(this);
        window.location.href = 'order.html';
        localStorage.setItem('coor',index);

    });
    //个人中心-->成为团长，立享佣金
    $('.content_onebecomea').click(function () {
        window.location.href = 'authentication.html?dataType=1'
    });
    //个人中心-->成为团长
    $("#head").click(function () {
        window.location.href = 'authentication.html?dataType=1'
    });
    //个人中心--》商家入驻
    $('#shop').click(function () {
        window.location.href = 'authentication.html?dataType=0'
    });
    //个人中心-->佣金明细
    $("#commission").click(function () {
        alert('您目前没有佣金');
    });
    //个人中心-->核销码
    $('#writeoff').click(function () {
        window.location.href = 'order.html';
        localStorage.setItem('coor',5);
    });

}

if($body.parent().attr('data-page')==='order'){
    // index代表的是个人中心界面进入订单页的坐标，0代表的是待支付，2代表的是待收货，3代表的是已完成
    // 4代表的是全部，1代表的也是全部。
    ssss()
    $(".order_content").children().not('.slice').remove();
    // $('.index_anmat').show();
    $('.slice').show();
    var index = parseInt(localStorage.getItem('coor'));
    if(index === 0){//点击待支付进入
        $('.order_header_lis').eq(index+1).addClass('header_add');
        $('.order_more').attr('data-page','1');
        order_read(1,1);
    }
    else if(index === 3){//点击已完成进入
        $('.order_header_lis').eq(4).addClass('header_add');
        $('.order_more').attr('data-page','1');
        order_read(4,1);
    }
    else if(index === 2){//点击待收货进入
        $('.order_header_lis').eq(3).addClass('header_add');
        $('.order_more').attr('data-page','1');
        order_read(3,1);
    }
    else if(index === 5){//点击核销码进入
        $('.order_header_lis').eq(2).addClass('header_add');
        $('.order_more').attr('data-page','1');
        order_read(2,1);
    }
    else {//其他，包括点击全部订单进入
        $('.order_header_lis').eq(0).addClass('header_add');
        $('.order_more').attr('data-page','1');
        order_read(0,1);
    }

    //订单-->选项卡
    $('.order_header_li').click(function () {
        // $('.index_anmat').show();
        $('.slice').show();
        $('.order_header_lis').removeClass('header_add');
        $(this).children('.order_header_lis').addClass('header_add');
        var index = $('.order_header_li').index(this);
        $('.order_more').attr('data-page','1');
        $(".order_content").children().not('.slice').remove();
        order_read(index,1);
        localStorage.setItem('index',index);
        if(index === 0){
            localStorage.setItem('coor',1);
        } else if(index === 1){
            localStorage.setItem('coor',0);
        } else if(index === 2){
            localStorage.setItem('coor',5)
        } else if(index === 3){
            localStorage.setItem('coor',2);
        } else {
            localStorage.setItem('coor',3)
        }

    });

    //读取更多数据
    $('.order_more').click(function () {
        if($(this).text() === '下一页'){
            var page = parseInt($(this).attr('data-page'));
            var status = parseInt($('.header_add').attr('data-id'));
            order_read(status,page);
        }
    });

    //订单--> 读取列表

    var tt;//定时循环参数
    var onc = 0;//刷新参数
    //定义加载
    /*
    * userId：定义用户
    * status：定义选中的购买状态
    * page：定义当前页
    * limit：定义条数
    * load：定义是否为加载更多
    */
    function order_read(i,page) {
        var noo = $(".order_none"),k;
        var pa = $('.order_more');
        noo.hide();
        if(i === 0){//代表该项是全部
            k = ''
        } else if(i === 1){//代表该项是待支付
            k = '0';
        } else if(i === 2){//代表该项是待使用
            k = '1'
        } else if(i === 3){//代表待收货
           k = '3';
        } else if(i === 4){//代表已完成
            k = '2';
        }
        //paystatus:0为待支付，1为支付成功待使用，2为支付成功已完成，-1为未支付过期
        var data = {contactUserId:localStorage.getItem('openid'),payStatus:k,nowPage:page,eachNumber:10};
        // var data = {contactUserId:'odN1v1ibu_Mocf9eYUhFEQlxHB2A',payStatus:k,nowPage:page,eachNumber:10};
        console.log(data);
        $.ajax({
            url:$href + 'MarketPlatform/wx/getOrderList',
            type:'post',
            data:JSON.stringify(data),
            dataType:'json',
            contentType:'application/json',
            success:function (data) {
                console.log(data);
                var status1,status2;
                if(data.orderList.length === 0){//无数据
                    $('.order_content').append('<div class="order_no"></div>');
                    pa.hide();
                    // setTimeout('cartoon()',500);
                    $('.slice').hide();
                }else {
                    var kl = Math.ceil(data.totalOrderNum/10);
                    if(kl === parseInt(page)){
                        pa.text('暂无更多数据！');
                    } else {
                        pa.text('下一页');
                    }
                    page++;
                    pa.attr('data-page',page);
                    $.each(data.orderList,function (ind,val) {//遍历数据追加插入
                        var st1 = 'block',st2 = 'none';
                        if(val.payStatus === '5'){//已过期
                            st1 = 'none';
                            st2 = 'block';
                        }else {
                            st2 = 'none';
                            st1 = 'block';
                        }
                        $('.slice').before('<div class="order_item" data-ss="'+page+'_'+ind+'" data-id="'+ val.activityId +'">\n' +
                            '            <div class="order_item_title">订单编号：'+val.orderId+'</div>\n' +
                            '            <div class="order_item_three">\n' +
                            '                <div class="order_item_threeimg">\n' +
                            '                    <img src="'+val.showPic+'">\n' +
                            '                </div>\n' +
                            '                <div class="order_item_threebox">\n' +
                            '                    <div class="order_item_threenale">'+val.goodsName+'</div>\n' +
                            '                </div>\n' +
                            '                <div class="order_item_three_time" style="display: '+st1+';">截止日期：'+val.cdkusedtime+' </div>\n' +
                            '                <div class="order_item_three_time" style="display: '+st2+';">支付截止日期：'+val.timePoint+' </div>\n' +
                            '            </div>\n' +
                            '        </div>');
                        var $a=$('div[data-ss='+page+'_'+ind+ ']');
                        switch (val.payStatus){
                            case '0':
                                // var date1=new Date();//当前时间
                                // var date2=new Date(val.timePoint.replace(/-/g,'/'));//到期时间
                                // var timeOut=date2.getTime()+1000;//到期时间转换成毫秒
                                // var timeThis=date1.getTime();//当前时间转换成毫秒
                                // var time= (timeOut-timeThis)/1000+1;//计算当前时间距到期时间所剩余的时间
                                // var min=Math.floor(time/60);//向下取整分
                                // var ss=Math.ceil(time%60);//向上取余秒

                                // $a.append('<div class="order_item_two_timebox" >截止时间：<span class="order_item_two_time">\n' +
                                //     '        '+ val.timePoint +'</div>\n' +
                                //     '      <div class="order_item_cannel" data-orderId="'+val.orderId+'" onclick="paycannel($(this))">取消</div>\n'+
                                //     '      <div  class="order_item_pay" data-orderId="'+val.orderId+'" onclick="pay($(this))">支付</div>\n');
                                $a.append('<div class="order_item_four">\n' +
                                    '                <div class="order_item_four_amountbox">\n' +
                                    '                    <div class="order_item_four_totalamout">总价：￥'+val.realPayMoney+'</div>\n' +
                                    '                    <div class="order_item_four_number">商品数量：'+val.buyNum+'</div>\n' +
                                    '                </div>\n' +
                                    '                <div class="order_item_four_operate">\n' +
                                    '                    <div class="order_item_four_ok order_item_four_do" data-orderId="'+val.orderId+'" onclick="pay($(this))">支付</div>\n' +
                                    '                    <div class="order_item_four_cannel order_item_four_do" data-orderId="'+val.orderId+'" onclick="paycannel($(this))">取消</div>\n' +
                                    '                </div>\n' +
                                    '            </div>');
                                // var timeT='tt'+val.orderId;//定义独立变量名
                                // var obj={};
                                // clearInterval(obj[timeT]);//重加载时清空原时间循环
                                // obj[timeT]=setInterval(gd,1000);//重启时间循环
                                //定义加载参数
                            // function gd() {
                            //     var date1=new Date();//当前时间
                            //     var date2=new Date(val.timePoint.replace(/-/g,'/'));//到期时间
                            //     var timeOut=date2.getTime()+1000;//到期时间转换成毫秒
                            //     var timeThis=date1.getTime();//当前时间转换成毫秒
                            //     // var time= Math.floor((timeOut-timeThis)/1000);//计算当前时间距到期时间所剩余的时间
                            //     var time= (timeOut-timeThis)/1000+1;//计算当前时间距到期时间所剩余的时间
                            //     var min=Math.floor(time/60);
                            //     var ss=Math.ceil(time%60);
                            //
                            //     if(time<=0&&onc===0){/*到点刷新*/
                            //         clearInterval(obj[timeT]);
                            //         $('.order_more').attr('data-page','1');
                            //         var status = parseInt($('.header_add').attr('data-id'));
                            //         $(".order_content").children().remove();
                            //         order_read(status,1);
                            //     }else if((time<=0)&&onc===1){/*到点但是点击支付不刷新*/
                            //         clearInterval(obj[timeT]);
                            //     }
                            //     $a.find('.min').text(min);
                            //     $a.find('.s').text(ss);
                            //
                            //     // console.log(timeOut,timeThis,time);
                            // }
                                //点击继续付款


                                $body.off('click').on('click','.order>div .order_item_pay[data-orderId="'+val.orderId+'"]',function () {
                                    console.log(val.orderId);
                                    onc=1;//停止其他订单刷新界面
                                    clearInterval(obj[timeT]);//停止该订单定时器
                                    //调起支付时的订单参数
                                    var list={
                                        openid : JSON.parse(localStorage.getItem('personal')).openid,
                                        orderId:val.orderId
                                    };
                                    //同调起支付
                                    $.ajax({
                                        //请求方式
                                        type: "POST",
                                        //请求的媒体类型
                                        contentType: "application/json;charset=UTF-8",
                                        //请求地址
                                        url: $href + "MarketPlatform/wx/getJSApiPayInfo",
                                        //数据，json字符串
                                        data: JSON.stringify(list),
                                        //请求成功
                                        success: function (result) {

                                            // alert(JSON.stringify(result));

                                            x_json = result.obj;
                                            payt(list.orderId,userId,status,page,limit,load);// 请求调起微信支付
                                        },
                                        //请求失败，包含具体的错误信息
                                        error: function (e) {
                                            alert('请求出错'+JSON.stringify(e));
                                            console.log(e.status);
                                            console.log(e.responseText);
                                        }
                                    });
                                    //同微信支付，多出重新加载数据字段
                                    function payt(orderId,userId,status,page,limit,load) {
                                        WeixinJSBridge.invoke('getBrandWCPayRequest', x_json, function (res) {
                                            // alert(JSON.stringify(res));
                                            if (res.err_msg === 'get_brand_wcpay_request:ok') {
                                                // alert(orderId);
                                                // alert(1);
                                                //支付成功，可以做跳转到支付成功的提示页面
                                                //...

                                                //修改订单状态
                                                $.ajax({
                                                    url:$url+'MarketPlatform/wx/updatePayInfo',
                                                    method:'POST',
                                                    contentType:"application/json;charset=utf-8",
                                                    data:JSON.stringify({orderId:orderId,payStatus:1}),
                                                    success:function (data) {
                                                        // alert(JSON.stringify(data))
                                                        //重加载订单数据
                                                        onLoad1(userId,status,page,limit,load);
                                                        onc=0;//重置刷新参数
                                                    },
                                                    error:function () {
                                                        alert($url+urlT+' 端口连接错误');
                                                    }
                                                });

                                            } else {

                                                //支付失败
                                                // alert(res.err_msg);
                                                obj[timeT]=setInterval(gd,1000);//重启定时器
                                                onc=0;//重置刷新参数
                                            }
                                        });
                                    }

                                    return false;
                                });
                                break;
                            case '1':
                                // $a.append('<div class="order_item_two">\n' +
                                //     '           <div class="order_item_two_title">核销码</div>\n' +
                                //     '           <div class="order_item_two_c">'+ val.goodsCdk +'</div>\n' +
                                //     '            <div class="order_item_three">\n' +
                                //     '                    <div class="order_itemtwo_time">'+val.lasttime+'</div>\n' +
                                //     '                    <div class="order_itemtwo_font">有效期</div>\n' +
                                //     '                </div>\n'+
                                //     '      </div>');
                                // $a.append(' <div class="order_details">\n' +
                                //     '                <a class="order_name" href="orderdetails.html?orderid='+val.orderId+'" >订单详情</a>\n' +
                                //     '            </div>');
                                $a.append('<div class="order_item_four">\n' +
                                    '                <div class="order_item_four_amountbox">\n' +
                                    '                    <div class="order_item_four_totalamout">总价：￥'+val.realPayMoney+'</div>\n' +
                                    '                    <div class="order_item_four_number">商品数量：'+val.buyNum+'</div>\n' +
                                    '                </div>\n' +
                                    '                <div class="order_item_four_details">\n' +
                                    '                    <a class="order_item_four_name" href="orderdetails.html?orderid='+val.orderId+'" >订单详情</a>\n' +
                                    '                </div>\n' +
                                    '            </div>');
                                break;
                            case '2'://已完成
                                // $a.append(' <div class="order_details">\n' +
                                //     '                <a class="order_name" href="orderdetails.html?orderid='+val.orderId+'" >订单详情</a>\n' +
                                //     '            </div>' +
                                //     '       <div class="statustwo" data-status="2">\n' +
                                //     '                                    <div></div>\n'  +
                                //     '                                    </div>');
                                $a.append('<div class="order_item_four">\n' +
                                    '                <div class="order_item_four_amountbox">\n' +
                                    '                    <div class="order_item_four_totalamout">总价：￥'+val.realPayMoney+'</div>\n' +
                                    '                    <div class="order_item_four_number">商品数量：'+val.buyNum+'</div>\n' +
                                    '                </div>\n' +
                                    '                <div class="order_item_four_details">\n' +
                                    '                    <a class="order_item_four_name" href="orderdetails.html?orderid='+val.orderId+'" >订单详情</a>\n' +
                                    '                </div>\n' +
                                    '                <div class="statustwo" data-status="2">\n' +
                                    '                    <div></div>\n' +
                                    '                </div>\n' +
                                    '            </div>');
                                break;
                            case '5'://已过期
                                // $a.append(' <div class="order_details">\n'  +
                                //     '             <a class="order_name" href="orderdetails.html?orderid='+val.orderId+'" >订单详情</a>\n' +
                                //     '       </div>' +
                                //     '<div class="status" data-status="-1">\n' +
                                //     '<div></div>\n' +
                                //     '</div>');
                                $a.append('<div class="order_item_four">\n' +
                                    '                <div class="order_item_four_amountbox">\n' +
                                    '                    <div class="order_item_four_totalamout">总价：￥'+val.realPayMoney+'</div>\n' +
                                    '                    <div class="order_item_four_number">商品数量：'+val.buyNum+'</div>\n' +
                                    '                </div>\n' +
                                    '                <div class="order_item_four_details">\n' +
                                    '                    <a class="order_item_four_name" href="orderdetails.html?orderid='+val.orderId+'" >订单详情</a>\n' +
                                    '                </div>\n' +
                                    '                <div class="status" data-status="-1">\n' +
                                    '                    <div></div>\n' +
                                    '                </div>\n' +
                                    '            </div>');
                                break;
                        }
                        if(ind === data.orderList.length-1){
                            // setTimeout('cartoon()',1000);
                            $('.slice').hide();
                        }
                    });
                }
            },
            error:function () {
                alert('请勿频繁操作');
            }
        });
    }

    //立即支付
    function pay(e) {
        var orderid = e.attr('data-orderid');
        //调起支付时的订单参数
        var list={
            openid : localStorage.getItem('openid'),
            orderId:orderid
        };
        //同调起支付
        $.ajax({
            //请求方式
            type: "POST",
            //请求的媒体类型
            contentType: "application/json;charset=UTF-8",
            //请求地址
            url: $href + "MarketPlatform/wx/getJSApiPayInfo",
            //数据，json字符串
            data: JSON.stringify(list),
            //请求成功
            success: function (result) {
                console.log(result);
                // alert(result.message);
                if (result.message!==undefined){
                    alert(result.message);//反馈出错信息
                }else {
                    x_json = result.obj;
                    payt(list.orderId);// 请求调起微信支付
                }

            },
            //请求失败，包含具体的错误信息
            error: function (e) {
                alert('请勿频繁操作');
                console.log(e.status);
                console.log(e.responseText);
            }
        });
        //同微信支付，多出重新加载数据字段
        function payt(orderId) {
            WeixinJSBridge.invoke('getBrandWCPayRequest', x_json, function (res) {
                // alert(JSON.stringify(res));
                if (res.err_msg === 'get_brand_wcpay_request:ok') {
                    // alert(orderId);
                    // alert(1);
                    //支付成功，可以做跳转到支付成功的提示页面
                    //...
                    //修改订单状态
                    var data = {orderId:orderId,payStatus:1};
                    $.ajax({
                        url:$href+'MarketPlatform/wx/updatePayInfo',
                        method:'POST',
                        contentType:"application/json;charset=utf-8",
                        data:JSON.stringify(data),
                        success:function (data) {
                            console.log(data);
                            //重加载订单数据
                            // onLoad1(userId,status,page,limit,load);
                            $('.public').show();
                            // $(".order_content").children().remove();
                            // var page = parseInt($('.order_more').attr('data-page'));
                            // var status = parseInt($('.header_add').attr('data-id'));
                            // order_read(status,page);
                        },
                        error:function () {
                            alert('请勿频繁操作！');
                        }
                    });
                } else {
                    alert('支付失败');
                    //支付失败
                    // obj[timeT]=setInterval(gd,1000);//重启定时器
                    // onc=0;//重置刷新参数
                }
            });
        }
    }
    //支付取消
    function paycannel(e) {
        $('.wr').show().attr('data-id',e.attr('data-orderid'));
    }
    //确定取消支付
    $('.wr_ok').click(function () {
        var data = {orderId:$('.wr').attr('data-id')};
        console.log(data);
        $.ajax({
            url:$href + 'MarketPlatform/PTYD/cancelpay',
            type:'post',
            data:JSON.stringify(data),
            dataType:'json',
            contentType:'application/json',
            success:function (data) {
                $('.slice').show();
                $('.wr').hide();
                $(".order_content").children().not('.slice').remove();
                $('.order_more').attr('data-page','1');
                var status = parseInt($('.header_add').attr('data-id'));
                order_read(status,'1');
            },
            error:function () {
                alert('请勿频繁操作');
            }
        })
    });
    //取消确定取值支付
    $('.wr_cannel').click(function () {
        $('.wr').hide();
    });
    //关注公众号关闭
    $('.public_item_cannel').click(function () {
        $('.slice').show();
        $('.public').hide();
        $(".order_content").children().not('.slice').remove();
        $('.order_more').attr('data-page','1');
        var status = parseInt($('.header_add').attr('data-id'));
        order_read(status,'1');
    });
    //滚动条加载数据
    $(document).scroll(function () {
        var height = $(document).height();
        var scrheight = $(document).scrollTop();
        var viewh = $(window).height();
        if(viewh+scrheight >=height){
            var ordermore = $('.order_more');
            var tex = ordermore.text();
            if(tex === '下一页'){
                var page = parseInt(ordermore.attr('data-page'));
                var status = parseInt($('.header_add').attr('data-id'));
                $('.slice').show();
                order_read(status,page);
            }
        }
    })
}

if($body.parent().attr('data-page')==='ordertwo'){
    // index代表的是个人中心界面进入订单页的坐标，0代表的是待支付，2代表的是待收货，3代表的是已完成
    // 4代表的是全部，1代表的也是全部。
    ssss();
    $(".order_content").children().not('.slice').remove();
    // $('.index_anmat').show();
    $('.slice').show();
    var index = parseInt(localStorage.getItem('coor'));
    if(index === 0){//点击待支付进入
        $('.order_header_lis').eq(index+1).addClass('header_add');
        $('.order_more').attr('data-page','1');
        order_read(1,1);
    } else if(index === 3){//点击已完成进入
        $('.order_header_lis').eq(4).addClass('header_add');
        $('.order_more').attr('data-page','1');
        order_read(4,1);
    } else if(index === 2){//点击待收货进入
        $('.order_header_lis').eq(3).addClass('header_add');
        $('.order_more').attr('data-page','1');
        order_read(3,1);
    } else if(index === 5){//点击核销码进入
        $('.order_header_lis').eq(2).addClass('header_add');
        $('.order_more').attr('data-page','1');
        order_read(2,1);
    } else {//其他，包括点击全部订单进入
        $('.order_header_lis').eq(0).addClass('header_add');
        $('.order_more').attr('data-page','1');
        order_read(0,1);
    }

    //订单-->选项卡
    $('.order_header_li').click(function () {
        $('.order_header_lis').removeClass('header_add');
        $(this).children('.order_header_lis').addClass('header_add');
        var index = $('.order_header_li').index(this);
        $('.order_more').attr('data-page','1');
        $(".order_content").children().not('.slice').remove();
        $('.slice').show();
        order_read(index,1);
        localStorage.setItem('index',index);
        if(index === 0){
            localStorage.setItem('coor',1);
        } else if(index === 1){
            localStorage.setItem('coor',0);
        } else if(index === 2){
            localStorage.setItem('coor',5)
        } else if(index === 3){
            localStorage.setItem('coor',2);
        } else {
            localStorage.setItem('coor',3)
        }
    });

    //读取更多数据
    $('.order_more').click(function () {
        if($(this).text() === '下一页'){
            var page = parseInt($(this).attr('data-page'));
            var status = parseInt($('.header_add').attr('data-id'));
            order_read(status,page);
        }
    });

    //订单--> 读取列表

    var tt;//定时循环参数
    var onc = 0;//刷新参数
    //定义加载
    /*
    * userId：定义用户
    * status：定义选中的购买状态
    * page：定义当前页
    * limit：定义条数
    * load：定义是否为加载更多
    */
    function order_read(i,page) {
        var noo = $(".order_none"),k;
        var pa = $('.order_more');
        noo.hide();
        if(i === 0){//代表该项是全部
            k = ''
        } else if(i === 1){//代表该项是待支付
            k = '0';
        } else if(i === 2){//代表该项是待使用
            k = '1'
        } else if(i === 3){//代表待收货
            k = '3';
        } else if(i === 4){//代表已完成
            k = '2';
        }
        //paystatus:0为待支付，1为支付成功待使用，2为支付成功已完成，5为未支付过期
        var data = {contactUserId:localStorage.getItem('openid'),payStatus:k,nowPage:page,eachNumber:10};
        console.log(data);
        $.ajax({
            url:$href + 'MarketPlatform/wx/getOrderList',
            type:'post',
            data:JSON.stringify(data),
            dataType:'json',
            contentType:'application/json',
            success:function (data) {
                console.log(data);
                var status1,status2;
                if(data.orderList.length === 0){//无数据
                    $('.order_content').append('<div class="order_no"></div>');
                    pa.hide();
                    // setTimeout('cartoon()',500);
                    $('.slice').hide();
                }else {
                    var kl = Math.ceil(data.totalOrderNum/10);
                    if(kl === parseInt(page)){
                        pa.text('暂无更多数据！');
                    } else {
                        pa.text('下一页');
                    }
                    page++;
                    pa.attr('data-page',page);
                    $.each(data.orderList,function (ind,val) {//遍历数据追加插入
                        var st1 = 'block',st2 = 'none';
                        if(val.payStatus === '5'){//已过期
                            st1 = 'none';
                            st2 = 'block';
                        }else {
                            st2 = 'none';
                            st1 = 'block';
                        }
                        $('.slice').before('<div class="order_item" data-ss="'+page+'_'+ind+'" data-id="'+ val.activityId +'">\n' +
                            '            <div class="order_item_title">订单编号：'+val.orderId+'</div>\n' +
                            '            <div class="order_item_three">\n' +
                            '                <div class="order_item_threeimg">\n' +
                            '                    <img src="'+val.showPic+'">\n' +
                            '                </div>\n' +
                            '                <div class="order_item_threebox">\n' +
                            '                    <div class="order_item_threenale">'+val.goodsName+'</div>\n' +
                            '                </div>\n' +
                            '                <div class="order_item_three_time" style="display: '+st1+';">截止日期：'+val.cdkusedtime+' </div>\n' +
                            '                <div class="order_item_three_time" style="display: '+st2+';">支付截止日期：'+val.timePoint+' </div>\n' +
                            '            </div>\n' +
                            '        </div>');
                        var $a=$('div[data-ss='+page+'_'+ind+ ']');
                        switch (val.payStatus){
                            case '0':
                                // var date1=new Date();//当前时间
                                // var date2=new Date(val.timePoint.replace(/-/g,'/'));//到期时间
                                // var timeOut=date2.getTime()+1000;//到期时间转换成毫秒
                                // var timeThis=date1.getTime();//当前时间转换成毫秒
                                // var time= (timeOut-timeThis)/1000+1;//计算当前时间距到期时间所剩余的时间
                                // var min=Math.floor(time/60);//向下取整分
                                // var ss=Math.ceil(time%60);//向上取余秒

                                // $a.append('<div class="order_item_two_timebox" >截止时间：<span class="order_item_two_time">\n' +
                                //     '        '+ val.timePoint +'</div>\n' +
                                //     '      <div class="order_item_cannel" data-orderId="'+val.orderId+'" onclick="paycannel($(this))">取消</div>\n'+
                                //     '      <div  class="order_item_pay" data-orderId="'+val.orderId+'" onclick="pay($(this))">支付</div>\n');
                                $a.append('<div class="order_item_four">\n' +
                                    '                <div class="order_item_four_amountbox">\n' +
                                    '                    <div class="order_item_four_totalamout">总价：￥'+val.realPayMoney+'</div>\n' +
                                    '                    <div class="order_item_four_number">商品数量：'+val.buyNum+'</div>\n' +
                                    '                </div>\n' +
                                    '                <div class="order_item_four_operate">\n' +
                                    '                    <div class="order_item_four_ok order_item_four_do" data-orderId="'+val.orderId+'" onclick="pay($(this))">支付</div>\n' +
                                    '                    <div class="order_item_four_cannel order_item_four_do" data-orderId="'+val.orderId+'" onclick="paycannel($(this))">取消</div>\n' +
                                    '                </div>\n' +
                                    '            </div>');
                                // var timeT='tt'+val.orderId;//定义独立变量名
                                // var obj={};
                                // clearInterval(obj[timeT]);//重加载时清空原时间循环
                                // obj[timeT]=setInterval(gd,1000);//重启时间循环
                                //定义加载参数
                                // function gd() {
                                //     var date1=new Date();//当前时间
                                //     var date2=new Date(val.timePoint.replace(/-/g,'/'));//到期时间
                                //     var timeOut=date2.getTime()+1000;//到期时间转换成毫秒
                                //     var timeThis=date1.getTime();//当前时间转换成毫秒
                                //     // var time= Math.floor((timeOut-timeThis)/1000);//计算当前时间距到期时间所剩余的时间
                                //     var time= (timeOut-timeThis)/1000+1;//计算当前时间距到期时间所剩余的时间
                                //     var min=Math.floor(time/60);
                                //     var ss=Math.ceil(time%60);
                                //
                                //     if(time<=0&&onc===0){/*到点刷新*/
                                //         clearInterval(obj[timeT]);
                                //         $('.order_more').attr('data-page','1');
                                //         var status = parseInt($('.header_add').attr('data-id'));
                                //         $(".order_content").children().remove();
                                //         order_read(status,1);
                                //     }else if((time<=0)&&onc===1){/*到点但是点击支付不刷新*/
                                //         clearInterval(obj[timeT]);
                                //     }
                                //     $a.find('.min').text(min);
                                //     $a.find('.s').text(ss);
                                //
                                //     // console.log(timeOut,timeThis,time);
                                // }
                                //点击继续付款


                                $body.off('click').on('click','.order>div .order_item_pay[data-orderId="'+val.orderId+'"]',function () {
                                    console.log(val.orderId);
                                    onc=1;//停止其他订单刷新界面
                                    clearInterval(obj[timeT]);//停止该订单定时器
                                    //调起支付时的订单参数
                                    var list={
                                        openid : JSON.parse(localStorage.getItem('personal')).openid,
                                        orderId:val.orderId
                                    };
                                    //同调起支付
                                    $.ajax({
                                        //请求方式
                                        type: "POST",
                                        //请求的媒体类型
                                        contentType: "application/json;charset=UTF-8",
                                        //请求地址
                                        url: $href + "MarketPlatform/wx/getJSApiPayInfo",
                                        //数据，json字符串
                                        data: JSON.stringify(list),
                                        //请求成功
                                        success: function (result) {

                                            // alert(JSON.stringify(result));

                                            x_json = result.obj;
                                            payt(list.orderId,userId,status,page,limit,load);// 请求调起微信支付
                                        },
                                        //请求失败，包含具体的错误信息
                                        error: function (e) {
                                            alert('请求出错'+JSON.stringify(e));
                                            console.log(e.status);
                                            console.log(e.responseText);
                                        }
                                    });
                                    //同微信支付，多出重新加载数据字段
                                    function payt(orderId,userId,status,page,limit,load) {
                                        WeixinJSBridge.invoke('getBrandWCPayRequest', x_json, function (res) {
                                            // alert(JSON.stringify(res));
                                            if (res.err_msg === 'get_brand_wcpay_request:ok') {
                                                // alert(orderId);
                                                // alert(1);
                                                //支付成功，可以做跳转到支付成功的提示页面
                                                //...

                                                //修改订单状态
                                                $.ajax({
                                                    url:$url+'MarketPlatform/wx/updatePayInfo',
                                                    method:'POST',
                                                    contentType:"application/json;charset=utf-8",
                                                    data:JSON.stringify({orderId:orderId,payStatus:1}),
                                                    success:function (data) {
                                                        // alert(JSON.stringify(data))
                                                        //重加载订单数据
                                                        onLoad1(userId,status,page,limit,load);
                                                        onc=0;//重置刷新参数
                                                    },
                                                    error:function () {
                                                        alert($url+urlT+' 端口连接错误');
                                                    }
                                                });

                                            } else {

                                                //支付失败
                                                // alert(res.err_msg);
                                                obj[timeT]=setInterval(gd,1000);//重启定时器
                                                onc=0;//重置刷新参数
                                            }
                                        });
                                    }

                                    return false;
                                });
                                break;
                            case '1':
                                // $a.append('<div class="order_item_two">\n' +
                                //     '           <div class="order_item_two_title">核销码</div>\n' +
                                //     '           <div class="order_item_two_c">'+ val.goodsCdk +'</div>\n' +
                                //     '            <div class="order_item_three">\n' +
                                //     '                    <div class="order_itemtwo_time">'+val.lasttime+'</div>\n' +
                                //     '                    <div class="order_itemtwo_font">有效期</div>\n' +
                                //     '                </div>\n'+
                                //     '      </div>');
                                // $a.append(' <div class="order_details">\n' +
                                //     '                <a class="order_name" href="orderdetails.html?orderid='+val.orderId+'" >订单详情</a>\n' +
                                //     '            </div>');
                                $a.append('<div class="order_item_four">\n' +
                                    '                <div class="order_item_four_amountbox">\n' +
                                    '                    <div class="order_item_four_totalamout">总价：￥'+val.realPayMoney+'</div>\n' +
                                    '                    <div class="order_item_four_number">商品数量：'+val.buyNum+'</div>\n' +
                                    '                </div>\n' +
                                    '                <div class="order_item_four_details">\n' +
                                    '                    <a class="order_item_four_name" href="orderdetails.html?orderid='+val.orderId+'&k=1" >订单详情</a>\n' +
                                    '                </div>\n' +
                                    '            </div>');
                                break;
                            case '2'://已完成
                                // $a.append(' <div class="order_details">\n' +
                                //     '                <a class="order_name" href="orderdetails.html?orderid='+val.orderId+'" >订单详情</a>\n' +
                                //     '            </div>' +
                                //     '       <div class="statustwo" data-status="2">\n' +
                                //     '                                    <div></div>\n'  +
                                //     '                                    </div>');
                                $a.append('<div class="order_item_four">\n' +
                                    '                <div class="order_item_four_amountbox">\n' +
                                    '                    <div class="order_item_four_totalamout">总价：￥'+val.realPayMoney+'</div>\n' +
                                    '                    <div class="order_item_four_number">商品数量：'+val.buyNum+'</div>\n' +
                                    '                </div>\n' +
                                    '                <div class="order_item_four_details">\n' +
                                    '                    <a class="order_item_four_name" href="orderdetails.html?orderid='+val.orderId+'&k=1" >订单详情</a>\n' +
                                    '                </div>\n' +
                                    '                <div class="statustwo" data-status="2">\n' +
                                    '                    <div></div>\n' +
                                    '                </div>\n' +
                                    '            </div>');
                                break;
                            case '5'://已过期
                                // $a.append(' <div class="order_details">\n'  +
                                //     '             <a class="order_name" href="orderdetails.html?orderid='+val.orderId+'" >订单详情</a>\n' +
                                //     '       </div>' +
                                //     '<div class="status" data-status="-1">\n' +
                                //     '<div></div>\n' +
                                //     '</div>');
                                $a.append('<div class="order_item_four">\n' +
                                    '                <div class="order_item_four_amountbox">\n' +
                                    '                    <div class="order_item_four_totalamout">总价：￥'+val.realPayMoney+'</div>\n' +
                                    '                    <div class="order_item_four_number">商品数量：'+val.buyNum+'</div>\n' +
                                    '                </div>\n' +
                                    '                <div class="order_item_four_details">\n' +
                                    '                    <a class="order_item_four_name" href="orderdetails.html?orderid='+val.orderId+'&k=1" >订单详情</a>\n' +
                                    '                </div>\n' +
                                    '                <div class="status" data-status="-1">\n' +
                                    '                    <div></div>\n' +
                                    '                </div>\n' +
                                    '            </div>');
                                break;
                        }
                        if(ind === data.orderList.length-1){
                            // setTimeout('cartoon()',1000);
                            $('.slice').hide();
                        }
                    });
                }
            },
            error:function () {
                alert('请勿频繁操作');
            }
        });
    }

    //立即支付
    function pay(e) {
        var orderid = e.attr('data-orderid');
        //调起支付时的订单参数
        var list={
            openid : localStorage.getItem('openid'),
            orderId:orderid
        };
        //同调起支付
        $.ajax({
            //请求方式
            type: "POST",
            //请求的媒体类型
            contentType: "application/json;charset=UTF-8",
            //请求地址
            url: $href + "MarketPlatform/wx/getJSApiPayInfo",
            //数据，json字符串
            data: JSON.stringify(list),
            //请求成功
            success: function (result) {
                console.log(result);
                if (result.message!==undefined){
                    alert(result.message);//反馈出错信息
                }else {
                    x_json = result.obj;
                    payt(list.orderId);// 请求调起微信支付
                }
            },
            //请求失败，包含具体的错误信息
            error: function (e) {
                alert('请勿频繁操作');
                console.log(e.status);
                console.log(e.responseText);
            }
        });
        //同微信支付，多出重新加载数据字段
        function payt(orderId) {
            WeixinJSBridge.invoke('getBrandWCPayRequest', x_json, function (res) {
                // alert(JSON.stringify(res));
                if (res.err_msg === 'get_brand_wcpay_request:ok') {
                    // alert(orderId);
                    // alert(1);
                    //支付成功，可以做跳转到支付成功的提示页面
                    //...
                    //修改订单状态
                    var data = {orderId:orderId,payStatus:1};
                    $.ajax({
                        url:$href+'MarketPlatform/wx/updatePayInfo',
                        method:'POST',
                        contentType:"application/json;charset=utf-8",
                        data:JSON.stringify(data),
                        success:function (data) {
                            console.log(data);
                            //重加载订单数据
                            // onLoad1(userId,status,page,limit,load);
                            $('.public').show();
                            // $(".order_content").children().remove();
                            // var page = parseInt($('.order_more').attr('data-page'));
                            // var status = parseInt($('.header_add').attr('data-id'));
                            // order_read(status,page);
                        },
                        error:function () {
                            alert('请勿频繁操作！');
                        }
                    });
                } else {
                    alert('支付失败');
                    //支付失败
                    // obj[timeT]=setInterval(gd,1000);//重启定时器
                    // onc=0;//重置刷新参数
                }
            });
        }
    }
    //支付取消
    function paycannel(e) {
        $('.wr').show().attr('data-id',e.attr('data-orderid'));
    }
    //确定取消支付
    $('.wr_ok').click(function () {
        var data = {orderId:$('.wr').attr('data-id')};
        console.log(data);
        $.ajax({
            url:$href + 'MarketPlatform/PTYD/cancelpay',
            type:'post',
            data:JSON.stringify(data),
            dataType:'json',
            contentType:'application/json',
            success:function (data) {
                $('.slice').show();
                $('.wr').hide();
                $(".order_content").children().not('.slice').remove();
                $('.order_more').attr('data-page','1');
                var status = parseInt($('.header_add').attr('data-id'));
                order_read(status,'1');
            },
            error:function () {
                alert('请勿频繁操作');
            }
        })
    });
    //取消确定取值支付
    $('.wr_cannel').click(function () {
        $('.wr').hide();
    });
    //关注公众号关闭
    $('.public_item_cannel').click(function () {
        $('.slice').show();
        $('.public').hide();
        $(".order_content").children().not('.slice').remove();
        $('.order_more').attr('data-page','1');
        var status = parseInt($('.header_add').attr('data-id'));
        order_read(status,'1');
    });
    //滚动条加载数据
    $(document).scroll(function () {
        var height = $(document).height();
        var scrheight = $(document).scrollTop();
        var viewh = $(window).height();
        if(viewh+scrheight >=height){
            var ordermore = $('.order_more');
            var tex = ordermore.text();
            if(tex === '下一页'){
                var page = parseInt(ordermore.attr('data-page'));
                var status = parseInt($('.header_add').attr('data-id'));
                $('.slice').show();
                order_read(status,page);
            }
        }
    })
}

if($body.parent().attr('data-page')==='orderdetails'){
// 获取订单具体信息
    odread();
    ssss();
    function odread() {
        var urla = urlSearch();
        if(urla.k === '1'||urla.k === 1){
            $('#foot_nav').hide();
        }
        var data = {orderId:urla.orderid};
        console.log(data);
        $.ajax({
            url:$href + 'MarketPlatform/PTYD/getorderdetails',
            type:'post',
            data:JSON.stringify(data),
            dataType:'json',
            contentType:'application/json',
            success:function (data) {
                console.log(data);
                $('.od_img').attr('src',data.QRCode1);//活动头像
                $('.od_one_name').text(data.activityName);//活动名称
                for(var i=0;i<data.goodsCdk.length;i++){
                    if(data.goodsCdk[i].cdkstatus === '0'){
                        $('.od_one_cdk').append('<div>'+data.goodsCdk[i].goodsCdk+'</div>');//活动核销码
                    }else if(data.goodsCdk[i].cdkstatus === '1'||data.goodsCdk[i].cdkstatus === '-1'){
                        $('.od_one_cdk').append('<div style="text-decoration: line-through;">'+data.goodsCdk[i].goodsCdk+'</div>');//活动核销码
                    }
                }
                $('#od_two_time').text(data.beginTime + '-' + data.cdkusedtime);//核销码有效期
                $('#od_amount').text(data.realPayMoney);//活动支付金额
                $('#od_name').text(data.nickName);//用户名称
                $('#od_orderid').text(data.orderId);//订单编号
                $('#od_shopname').text(data.shopName);//商户名称
                $('#od_time').text(data.workHours);//商户营业时间
                // $('#od_address').text(data.shopAddress);//商户地址
                var add = data.exchangeAddress.split('/');
                var odadd = $('#od_address');
                odadd.text(add[0]);
                for(var i = 1;i<add.length-1;i++){
                    odadd.after('<div class="od_three_itemcontent" style="margin-left: 17vw">'+add[i]+'</div>');
                }
                var p = data.tel.split('/');
                var odtel = $('#od_tel');
                odtel.text(p[0]);
                for(var i = 1;i<p.length-1;i++){
                    odtel.after('<div class="od_three_itemcontent" style="margin-left: 18vw">'+p[i]+'</div>');
                }
                // $('#od_tel').text(data.tel);//客服电话
                $('#notice').append(data.notice);//产品说明
                $('#refund').append(data.instructions);//退改说明
                $('.od_four_time').text(data.beginTime + '-' + data.cdkusedtime);//核销码有效期
                $('#od_paytime').text(data.paytime);//付款时间
            },
            error:function () {
                alert('请勿频繁操作');
            }
        })
    }
}

if($body.parent().attr('data-page')==='headdetail'){
    headdetail();
    function headdetail() {
        var data = {shopId:'',headerId:localStorage.getItem('openid')};
        $('.detail_content_c').children().remove();
        console.log(data);
        $.ajax({
            url:$href + 'MarketPlatform/PTYD/getearninglist',
            type:'post',
            data:JSON.stringify(data),
            dataType:'json',
            contentType:'application/json',
            success:function (data) {
                console.log(data);
                var leng = data.earninglist.length;
                var hand = parseFloat(data.earninglist[leng-1].remark2)*100;
                var jj = hand.toFixed(1).toString() + '%';
                $('.detail_header_fee').text('手续费：'+jj);
                if(data.earninglist.length === 0){
                    $('.detail_content_c').append('<div class="detail_c_no"></div>')
                }else{
                    for(var i = 0;i<data.earninglist.length;i++){
                        var ab = data.earninglist[i].remark3;
                        if(ab === '已到账！'){
                            ab = '已到账';
                        }else {
                            ab = '未到账';
                        }
                        $('.detail_content_c').append('<div class="detail_c_item">\n' +
                            '                        <div class="detail_c_itemfont">'+data.earninglist[i].transfertime+'</div>\n' +
                            '                        <div class="detail_c_itemfont">'+data.earninglist[i].allearning+'</div>\n' +
                            '                        <div class="detail_c_itemfont">'+data.earninglist[i].tradingMoney+'</div>\n' +
                            '                       <div class="detail_c_itemfont">'+ab+'</div>\n'+
                            '                    </div>')
                    }
                }
            },
            error:function () {
                alert('提交信息失败！');
            }
        })
    }
}

function urlSearch() {
    var str=location.href; //取得整个地址栏
    var num=str.split('?');
    var arr;
    var data={};
    var name;
    $.each(num,function (ind,val) {
        if(ind>0){
            if(val.split('&').length>1){
                for(var i=0;i<val.split('&').length;i++){
                    arr=val.split('&')[i].split('=');
                    name=arr[0];
                    data[name]=arr[1];
                }
            }else {
                arr=val.split('=');
                var name=arr[0];
                data[name]=arr[1];
            }
        }
    });
    return data;
}

//商家登陆
$('.login').click(function () {
    var acount = $('#shopname').val();
    var password = $('#shoppassword').val();
    var data = {account:acount,initialPassword:password};
    console.log(data);
    if(acount === ''||acount === null||password === ''||password === null){
        alert('账号密码不能为空！');
    }
    else {
        $.ajax({
            url:$href + 'MarketPlatform/seller/login',
            type:'post',
            data:JSON.stringify(data),
            dataType:'json',
            contentType:'application/json',
            success:function (data) {
                console.log(data);
                if(data.result === 'success'){
                    localStorage.setItem('account',acount);
                    localStorage.setItem('shopid',data.shopId);
                    window.location.href = 'http://www.youguangchina.cn/hd/Marketapp/index.html';
                }
                else {
                    alert('登陆失败，请确认账号密码是否正确？');
                }
            },
            error:function () {
                alert('请勿频繁操作');
            }
        })
    }
});


//分享
function sss() {
    var url = window.location.href;
    // var newurl = window.location.href + '?ui=1';

    //判断是否是ios设备
    // var isIOS = function() {
    //     var isIphone = navigator.userAgent.includes('iPhone');
    //     var isIpad = navigator.userAgent.includes('iPad');
    //     return isIphone || isIpad;
    // };
    // if(isIOS()){
    //     var getRequest = urlSearch();
    //     if(getRequest.ui!==undefined&&getRequest.ui!==null){//存在ui
    //     }
    //     else {//不存在ui刷新界面
    //         window.location.href=newurl;
    //     }
    // }
    $.ajax({
        url:$href + 'MarketPlatform/user/getJsCfgByUrl?url=' + url,
        type:'get',
        success:function (data) {
            console.log(data);
            var timestamp = data.obj.timestamp;
            var nonceStr = data.obj.nonceStr;
            var signature = data.obj.signature;
            var shareTitle = '有光网络科技';
            var shareDesc =  "一键推广，轻松获客，迅速提高营业额！\n2020分享经济，营销新模式";
            var shareUrl = "http://www.youguangchina.cn/hd/platformapp/index.html";
            wx.config({
                debug: false,
                appId: appid,
                timestamp: timestamp,
                nonceStr:  nonceStr,
                signature: signature,
                jsApiList: [
                    'getLocation',
                    'hideMenuItems'
                ]
            });
            wx.ready(function () {
                wx.hideMenuItems({
                    menuList: [
                        'menuItem:share:qq', // 分享道QQ
                        'menuItem:share:weiboApp',//分享给微博
                        'menuItem:share:QZone', // 分享到QQ空间
                        "menuItem:copyUrl",//禁止复制链接
                        'menuItem:share:appMessage',//分享到朋友
                        'menuItem:share:timeline'//分享到朋友圈
                    ],
                    success: function (res) {
                        // alert("hide成功")
                    },
                    fail: function (res) {
                        // alert("hide出错");
                    }
                });
                wx.getLocation({
                    type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                    success: function (res) {
                        var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                        var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                        var speed = res.speed; // 速度，以米/每秒计
                        var accuracy = res.accuracy; // 位置精度
                        console.log(latitude,longitude,speed,accuracy);
                    }
                });
                wx.error(function (res) {
                    // console.log("config信息验证失败");
                    console.log(res);
                    // alert('验证失败')
                    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可
                    // 以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                });
            });
        },
        error:function () {
            console.log("error");
        }
    });
}

//禁止微信分享
function ssss() {
    // var url = window.location.href;
    var url = encodeURIComponent(location.href.split('#')[0]);
    // var newurl = window.location.href + '?ui=1';

    //判断是否是ios设备
    // var isIOS = function() {
    //     var isIphone = navigator.userAgent.includes('iPhone');
    //     var isIpad = navigator.userAgent.includes('iPad');
    //     return isIphone || isIpad;
    // };
    // if(isIOS()){
    //     var getRequest = urlSearch();
    //     if(getRequest.ui!==undefined&&getRequest.ui!==null){//存在ui
    //     }
    //     else {//不存在ui刷新界面
    //         window.location.href=newurl;
    //     }
    // }
    $.ajax({
        url:$href + 'MarketPlatform/user/getJsCfgByUrl?url=' + url,
        type:'get',
        success:function (data) {
            // console.log(data);
            var timestamp = data.obj.timestamp;
            var nonceStr = data.obj.nonceStr;
            var signature = data.obj.signature;
            var shareTitle = '有光网络科技';
            var shareDesc =  "一键推广，轻松获客，迅速提高营业额！\n2020分享经济，营销新模式";
            var shareUrl = "http://www.youguangchina.cn/hd/project/platform/index.html";
            wx.config({
                debug: false,
                appId: appid,
                timestamp: timestamp,
                nonceStr:  nonceStr,
                signature: signature,
                jsApiList: [
                    'hideMenuItems'
                ]
            });
            wx.ready(function () {
                wx.hideMenuItems({
                    menuList: [
                        'menuItem:share:qq', // 分享道QQ
                        'menuItem:share:weiboApp',//分享给微博
                        'menuItem:share:QZone', // 分享到QQ空间
                        "menuItem:copyUrl",//禁止复制链接
                        'menuItem:share:appMessage',//分享到朋友
                        'menuItem:share:timeline'//分享到朋友圈
                    ],
                    success: function (res) {
                        // alert("hide成功")
                    },
                    fail: function (res) {
                        // alert("hide出错");
                    }
                });
                wx.error(function (res) {
                    // console.log("config信息验证失败");
                    console.log(res);
                    // alert('验证失败')
                    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可
                    // 以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                });
            });
        },
        error:function () {
            console.log("error");
        }
    });
}

//动画延时函数
function cartoon() {
    $('.prompt_item').animate({
        opacity:'1',
        top:'18vh'
    },600,function () {
        // $('.prompt_item').hide().css({'opacity':'0','top':'20vh'});
    })
}
function cartoontwo() {
    $('.loading').animate({
        opacity:'0'
    },function () {
        $('.loading').hide().css('opacity','1');
    })
}
function cartoothree() {
    $('.loader').animate({
        opacity:'0'
    },function () {
        $('.loader').hide().css('opacity','1');
        $('.pro_list').append('<div class="ma_mc_no"></div>');
    })
}
function cartoofour() {
    $('#app').hide();
}

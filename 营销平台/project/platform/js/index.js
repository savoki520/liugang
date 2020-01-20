
var $body=$('body');
 $url='http://www.youguangchina.cn/';
// var $url='http://192.168.0.101:8080/';
// var appid = 'wx04d29c82e1d4eb0f';
var appid = 'wxc4aaae117c8ba4e5';

var openId;

//ios去除alert（）的网址
window.alert = function(name){
    var iframe = document.createElement("IFRAME");
    iframe.style.display="none";
    iframe.setAttribute("src", 'data:text/plain,');
    document.documentElement.appendChild(iframe);
    window.frames[0].window.alert(name);
    iframe.parentNode.removeChild(iframe);
};
/*****index*****/
if($body.parent().attr('data-page')==='index'){
    setTimeout('cartoontwo()',1000);
    //获取活动参数
    var urldata=urlSearchT();
    var getertype=urldata.getertype;//获取端口 0平台/1商家
    openId=urldata.openid;//分享人微信
    var activityId=urldata.activityId;//活动id
    var shopId=urldata.shopId;//商家id
    var status=urldata.status;//操作(是否是分享进入 0不是/1是)


    // window.history.pushState(null, null, 'http://www.youguangchina.cn/hd/project/platform/index.html');
    sss();
    if(openId==='null'){//没有分享人
        openId='';
    }else {//有分享人
        var data = {openid:localStorage.getItem('openid')};
        $('.material').hide();
        $.ajax({
            url:$url + 'MarketPlatform/PTYD/headeridentitycheck',
            type:'post',
            data:JSON.stringify(data),
            dataType:'json',
            contentType:'application/json',
            success:function (data) {
                console.log(data);
                if(data.identity === 1||data.identity === '1'){//团长
                    $('.comission').show();
                }else {//非团长
                    $('.comission').hide();
                }
            },
            error:function () {
                alert('请勿频繁操作');
            }
        });
    }
    localStorage.setItem('shareopenid',openId);

    /*自定义信息*/
    // openId='odN1v1uG0tHCCxVPiAwgJTxDuDt4';
    // shopId='efa826a2e2af454c8efe3124f1f51a18';
    // getertype=1;
    // shareId='';
    // activityId='f14cd80fd18042dfa19b5892ac73ea25';
    /*自定义信息结束*/

    localStorage.setItem('port',getertype);//存储活动端口（商家/平台）

    var actdata={getertype:getertype,activityId:activityId};
    // console.log(urldata,actdata);

    /*获取活动信息
    * 传输参数
    * activityId：活动id
    * getertype：获取端口方式（0商家/1平台）
    * 反馈参数
    * activityId：活动id
    * goodsId：活动商品id
    * shopId：商家id
    * activityName：活动名称
    * goodsName：商品名称（无作用）
    * QRCode1：商品头图（展示图）
    * beginTime：活动开始时间（无作用）
    * overTime：活动到期时间
    * notice：商品购买须知
    * QRCode2、QRCode3、QRCode4：商品详情图
    * nowprice：商品现价
    * realprice：商品原价
    * shopName：商家名称
    * workHours：营业时间
    * businessHours：兑奖时间
    * tel1：商家联系方式1
    * tel2：商家其他联系方式
    * QRCode5：分享图（分享海报图）
    * shopAddress：商家地址
    * exchangeAddress：兑换地址（多个 ‘/’区分）
    * goodsNumber：剩余商品数量
    * sellNumber：售出数量
    * joinNumber：参与人数（无作用）
    * peoplenumber：在线团长人数（无作用）
    * commissionMoney：佣金金额
    */
    var activityData=postAjax('MarketPlatform/activity/getActivity',actdata);
    var limitnum;
    console.log(activityData);
    if(activityData.result!=='error'&&activityData!==''&&activityData!==undefined&&activityData!==null){
        $('#activity_name').text(activityData.activityName);//活动名称
        $('#title').text(activityData.activityName);//title
        $('#banner').css('background-image','url("'+activityData.QRCode6+'")');//活动商品头图
        $('.overTime').text(activityData.overTime.split('-').join('/'));//活动到期时间
        $('#buying_instructions').append(activityData.instructions);//活动商品退改说明
        $('#buying_notice').append(activityData.notice);//活动商品产品介绍

        var begintt = activityData.beginTime.split('-');
        var beginyear = begintt[0],beginmon = begintt[1],beginday = begintt[2];
        var overtt = activityData.overTime.split('-');
        var overyear = overtt[0],overmon = overtt[1],overday = overtt[2];
        $('#buying_use').text('本券有效期为：'+beginyear+'年'+beginmon+'月'+beginday + '日-'+overyear+'年'+overmon+'月'+overday+'日'+
            '本券为电子券，购买凭电子核销码码到店核销即可使用，数量有限售完为止');
        // $('#commodity_details').children().each(function (ind,val) {
        //     $(this).attr('src',activityData['QRCode'+(ind+2)]);
        // });//商品详情图
        $('#com_imgone').attr('src',activityData.QRCode2);
        $('#com_imgtwo').attr('src',activityData.QRCode3);
        $('#com_imgthree').attr('src',activityData.QRCode4);
        $('#com_imgfour').attr('src',activityData.QRCode7);
        $('#com_imgfive').attr('src',activityData.QRCode8);
        $('#com_imgsix').attr('src',activityData.QRCode9);
        $('#com_imgseven').attr('src',activityData.QRCode10);
        $('#com_imgeight').attr('src',activityData.QRCode11);
        var jk = parseFloat(activityData.nowprice) + parseFloat(activityData.commissionMoney);
        $('#activity_price').find('.moneyNow').text(jk.toFixed(2))//现价
            .parent().siblings().find('.moneyYear').text(activityData.realprice);//原价
        $('.pos_name').text(activityData.shopName);//商家名称
        // $('.pos_time1').text(activityData.workHours);//营业时间
        $('.pos_time2').text(activityData.businessHours);//兑奖时间
        // $('.pos_phone1').text(activityData.tel);//商家联系方式1
        $('.bh').attr('href','tel:'+activityData.tel);
        // $('.pos_phone2').text(activityData.tel2);//商家联系方式2
        $('.commiss_yjtwo').text(activityData.commissionMoney + '￥');//佣金

        $('#share_img').attr('src',activityData.QRCode5);//海报图

        $('.money').text(jk.toFixed(2));//底部导航购买价格
        limitnum = activityData.limitnum;

        // $('.pos_address1').children('div').text(activityData.shopAddress);//商家地址
        $.each(activityData.exchangeAddress.split('/'),function (ind,val) {
            if(ind!==activityData.exchangeAddress.split('/').length-1){
                $('.pos_address2').append('<div>'+val+'</div>')
            }
        });//兑换地址
        $.each(activityData.tel.split('/'),function (ind,val) {
            if(ind!==activityData.tel.split('/').length-1){
                $('.pos_phone1').append('<div>'+val+'</div>')
            }
        });//客服电话
        $('.surplus').text(activityData.goodsNumber);//剩余活动商品数量



        //获取分享人信息
        // var shareData=postAjax('MarketPlatform/wx/getUserInfo',{openid:openId});
        // $('#sharer').find('.sharer_head').css('background-image','url("'+shareData.headPic+'")').siblings('.sharer_name').text(shareData.nickName);

    }else {//查无数据或数据出错
        if(activityData===''){
            console.log('查无此数据')
        }else if(activityData.result==='error') {
            console.log(activityData.message);
        }
    }

    var canvasImg;

    //生成图片海报
    function canvasHtml() {
        // console.log(canvasImg);
        if(canvasImg===null||canvasImg===''||canvasImg===undefined){
            var personal=JSON.parse(localStorage.getItem('personal'));
           // $('.sharer_head.ctt').attr('src',personal.headPic);


            // var imgg = personal.headPic;
            // var image = new Image();
            // image.src = imgg;
            // image.setAttribute('crossOrigin','Anonymous');//解决跨域问题
            // image.onload = function(){
            //     var base64 = getBase64Image(image);
            //     $('.sharer_head.ctt').attr('src',base64);
            // };


            var urd=urlSearchT();
            var ur = 'http://www.youguangchina.cn/hd/project/platform/index.html?activityId='+urd.activityId+'&' +
                'shopId='+urd.shopId+'&openid='+localStorage.getItem('openid')+'&status=2&getertype=0';
            var qr = qrImg(ur);
           $('.shareim').attr('src',qr);
            var qrhead = qrheader(localStorage.getItem('openid'));
           $('.sharer_head.ctt').attr('src',qrhead);
//                 var emt=$('#share');
//                 html2canvas(emt, {
//                 useCORS:true,
//                 allowTaint:false,
//                 taintTest: false,
//                 width: emt.offsetWidth ,
//                 height: emt.offsetHeight ,
//                 // window.devicePixelRatio是设备像素比
//                 dpi: window.devicePixelRatio *2,
//                 // scale: window.devicePixelRatio *2
//                 scale: 2
//             }).then(function (canvas) {
//                     var context = canvas.getContext('2d');
//                     // 【重要】关闭抗锯齿
//                     context.scale(2,2);
//                     context.mozImageSmoothingEnabled = false;
//                     context.webkitImageSmoothingEnabled = false;
//                     context.msImageSmoothingEnabled = false;
//                     context.imageSmoothingEnabled = false;
//
//                     var url = canvas.toDataURL("image/png");
//                     // console.log(url);
//                     canvasImg=url;
//                     $('#shareImg').attr('src',url).css('display','block').siblings('.ctt').hide();
//                     $('.anim').hide();
//                 });


            var c_width = $('#share').outerWidth();//如果box设置了padding，需要获取outerWidth和outerHeight来赋给canvas；
            var c_height =$('#share').outerHeight();
            var canvas = document.createElement("canvas");
            var context = canvas.getContext("2d");
            //以下代码是获取根据屏幕分辨率，来设置canvas的宽高以获得高清图片
            // 屏幕的设备像素比
            var devicePixelRatio = window.devicePixelRatio || 2;
            // 浏览器在渲染canvas之前存储画布信息的像素比
            var backingStoreRatio = context.webkitBackingStorePixelRatio ||
                context.mozBackingStorePixelRatio ||
                context.msBackingStorePixelRatio ||
                context.oBackingStorePixelRatio ||
                context.backingStorePixelRatio || 1;

            // canvas的实际渲染倍率
            var ratio = devicePixelRatio/backingStoreRatio;
            canvas.width = c_width * ratio;
            canvas.height = c_height * ratio;
            canvas.style.width = c_width + "px";
            canvas.style.height = c_height + "px";
            var transTop = $(document).scrollTop() - $('#share').offset().top;//获取div垂直方向的位置
            context.scale(ratio,ratio);
            context.translate((c_width-$(window).width())/2,transTop) ;//canvas的位置要保证与div位置相同。
            //高清图设置完成
            //解决跨域，将跨域图片路径转为base64格式
            var img = new Image();
            var canvas2 = document.createElement('canvas');
            var ctx = canvas2.getContext('2d');
            img.crossOrigin = 'Anonymous';
            img.src=$('#share_img').attr('src');
            img.onload = function () {
                canvas2.height = img.height;
                canvas2.width = img.width;
                ctx.drawImage(img, 0, 0);
                var dataURL = canvas2.toDataURL('image/png');
                $('#share_img').attr('src',dataURL);
                canvas2 = null;

                //重新给img赋值成功后，执行截图方法
                getCard();
            };
            function getCard(){
                html2canvas($("#share"),{
                    allowTaint:true,
                    useCORS:true,
                    canvas:canvas,
                    onrendered:function(canvas){
                        dataURL =canvas.toDataURL("image/png");
                        canvasImg = dataURL;
                        $('.ctt').hide();
                        $('.sharemm').show().css('display','block');
                        $('#shareImg').attr('src',dataURL);
                        $('.anim').hide();
                    },
                    width:c_width,
                    height:c_height
                })
            }
        }else {
            $('.ctt').hide();
            $('.sharemm').show().css('display','block');
            $('#shareImg').attr('src',canvasImg);
            $('.anim').hide();
        }


        // html2canvas($('#share'), {
        //     // allowTaint:true,
        //     useCORS: true,
        //     onrendered: function (canvas) {
        //         var url = canvas.toDataURL("image/png");
        //         console.log(url);
        //     }
        // });


    }
    //点击分享
    function share() {
        $('#alertK').show().find('#share').show();
        $('.anim').show();
        canvasHtml();
    }
    //将图片转为base64码
    function getBase64Image(img) {

        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height);
        var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
        var dataURL = canvas.toDataURL('image/'+ext);
        return dataURL;

    }

    //获取头像base64
    function qrheader(openid) {
        var dt;
        var data = {openid:openid};
        $.ajax({
            url:$url+'MarketPlatform/PTYD/imagetransform',
            method:'post',
            async:false,
            contentType:'application/json',
            data:JSON.stringify(data),
            success:function (data) {
                // console.log('data:img/jpg;base64,',data);
                // console.log(data);
                dt=data;

                // $('#QR').find('.img').attr('src','data:img/jpg;base64,'+data+'')
            },
            error:function () {
                alert('请勿频繁操作');
            }
        });
        return dt;//反馈QR码 base64
    }

    //商家返回主页
    $('#return').click(function () {
       window.location.href = 'http://www.youguangchina.cn/hd/Marketapp/myactivity.html';
    });

    //核销码
    function hq() {
        window.location.href = '../../platformapp/ordertwo.html';
        localStorage.setItem('coor',5);
    }

    //增加购买份数
    $('.plus').click(function () {
        var footnum = $('.footer_number');
        var number = parseInt(footnum.text());
        var money = $('.money');
        var m = parseFloat($('.moneyNow').text());
        if(number <limitnum){
            number ++;
            m = m*number;
            footnum.text(number);
            money.text(m.toFixed(2));
        }else {
            alert('抱歉，已超过商品购买数量！');
        }
    });
    //减少购买分数
    $('.less').click(function () {
        var footnum = $('.footer_number');
        var number = parseInt(footnum.text());
        var money = $('.money');
        var m = parseFloat($('.moneyNow').text());
        if(number > 1){
            number --;
            m = m*number;
            footnum.text(number);
            money.text(m.toFixed(2));
        }else {
            // alert('提示：数量不能为负！')
        }
    });
    //进入文字素材页面
    $('.material').click(function () {
        window.location.href = 'material.html?activityid='+activityData.activityId
    })
}


if($body.parent().attr('data-page')==='material'){
    var url = urlSearchT();
    var activityid = url.activityid;
    var data = {activityId:activityid};
    console.log(data);
    var Data=postAjax('MarketPlatform/activity/getActivity',data);
    console.log(Data);
    $('.content').append(Data.graphicdetail);

}



//禁止微信分享
function sss() {
    // var url = window.location.href;
    var url = encodeURIComponent(location.href.split('#')[0]);
    $.ajax({
        url:$url + 'MarketPlatform/user/getJsCfgByUrl?url=' + url,
        type:'get',
        success:function (data) {
            console.log(data);
            var urld=urlSearchT();
            var timestamp = data.obj.timestamp;
            var nonceStr = data.obj.nonceStr;
            var signature = data.obj.signature;
            var shareTitle = $('#activity_name').text();
            var shareDesc =  $('#buying_notice').children('p').text();
            var shareUrl = 'http://www.youguangchina.cn/hd/project/platform/index.html?activityId='+urld.activityId+'&' +
            'shopId='+urld.shopId+'&openid='+localStorage.getItem('openid')+'&status=2&getertype=0';
            wx.config({
                debug: false,
                appId: appid,
                timestamp: timestamp,
                nonceStr:  nonceStr,
                signature: signature,
                jsApiList: [
                    'onMenuShareAppMessage',
                    'onMenuShareTimeline',
                    'hideMenuItems'
                ]
            });
            wx.ready(function () {
                wx.hideMenuItems({
                    menuList: [
                        'menuItem:share:qq', // 分享道QQ
                        'menuItem:share:weiboApp',//分享给微博
                        'menuItem:share:QZone', // 分享到QQ空间
                        "menuItem:copyUrl"//禁止复制链接
                        // 'menuItem:share:appMessage',//分享到朋友
                        // 'menuItem:share:timeline'//分享到朋友圈
                    ],
                    success: function (res) {
                        // alert("hide成功")
                    },
                    fail: function (res) {
                        // alert("hide出错");
                    }
                });
                // 2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果
                wx.onMenuShareAppMessage({
                    title: shareTitle, // 分享标题
                    desc: shareDesc, // 分享描述
                    link: shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: 'http://www.youguangchina.cn/yxgj/Mall/image/YG.png', // 分享图标
                    type: '', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    trigger: function (res) {
                        // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返噿
                        // alert('用户点击发送给朋友');
                    },
                    success: function () {
                        // alert('分享成功')
                        // 用户确认分享后执行的回调函数
                        // $.ajax({//转发成功，给后台判定是否是第一次转发
                        //     url:href + 'yhq/add?userId=' + localStorage.getItem('userid') + '&yhhdId=1',
                        //     type:'post',
                        //     success:function (data) {
                        //         console.log(data);
                        //         // if(data.success === false){
                        //         //     // $(".share_limit").toggle();
                        //         // }
                        //     },
                        //     error:function () {
                        //         console.log("数据获取出错");
                        //     }
                        // });
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                        // alert('已取消');
                    }
                });
                // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果
                wx.onMenuShareTimeline({
                    title: shareTitle, // 分享标题
                    link: shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: 'http://www.youguangchina.cn/yxgj/Mall/image/YG.png', // 分享图标
                    trigger: function (res) {
                        // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返噿
//                        alert('用户点击分享到朋友圈');
                    },
                    success: function (res) {
                        // alert('分享成功');
                        // $.ajax({//转发成功，给后台判定是否是第一次转发
                        //     url:href + 'yhq/add?userId=' + localStorage.getItem('userid') + '&yhhdId=1',
                        //     type:'post',
                        //     success:function (data) {
                        //         console.log(data);
                        //         // if(data.success === false){
                        //         //     // $(".share_limit").toggle();
                        //         // }
                        //     },
                        //     error:function () {
                        //         console.log("数据获取出错");
                        //     }
                        // });
                    },
                    cancel: function (res) {
                        // alert('已取消');
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






//postAjax传输
function postAjax(urlT,dat) {
    var dt;
    $.ajax({
        url:$url+urlT,
        async:false,
        method:'POST',
        contentType:"application/json;charset=utf-8",
        data:JSON.stringify(dat),
        success:function (data) {
            dt=data;
        },
        error:function () {
            alert('请勿频繁操作');
        }
    });
    return dt;//反馈数据
}


//获取QR码
function qrImg(dat) {
    var dt;
    var data = {content:dat};
    $.ajax({
        url:$url+'MarketPlatform/generateQR',
        method:'post',
        async:false,
        contentType:'application/json',
        data:JSON.stringify(data),
        success:function (data) {
            // console.log('data:img/jpg;base64,',data);
            // console.log(data);
            dt='data:img/jpg;base64,'+data;

            // $('#QR').find('.img').attr('src','data:img/jpg;base64,'+data+'')
        },
        error:function () {
            alert('请勿频繁操作');
        }
    });
    return dt;//反馈QR码 base64
}



//调起支付（生成订单，唤起微信支付界面）
function payFrom(money) {

    // alert(JSON.parse(localStorage.getItem('personal')).openid+' <br/> '+money*100);
    console.log(activityData);


    // var openid='odN1v1ibu_Mocf9eYUhFEQlxHB2A';
    //  var openid='oYDqs0epGr16NpF7hhmCUFZ_ilBM';
    var openid=JSON.parse(localStorage.getItem('personal')).openid;

    console.log(openId);
    /*
    * 传输生成订单参数
    * goodsId：商品ID
    * goodsName：商品名称（活动名称）
    * realprice：原价（单位：分）
    * realPayMoney：用户真实付款价格（单位：分）
    * showPic：商品头图
    * contactUserId：购买人ID
    * shareOne：分享人ID
    * shopId：商家ID
    * activityId：活动ID
    * mark：端口进入方式（0平台/1商家）
    */
    var actdata={
        goodsId:activityData.goodsId,
        goodsName:activityData.activityName,
        realprice:activityData.realprice,
        realPayMoney:money,
        showPic:activityData.QRCode1,
        contactUserId:openid,
        shareOne:localStorage.getItem('shareopenid'),
        shopId:shopId,
        activityId:activityId,
        mark:getertype,
        buyNum:$('.footer_number').text()
    };

    var orderData=postAjax('MarketPlatform/wx/createOrderInfo',actdata);//生成订单
    // alert(JSON.stringify(orderData));
    console.log(orderData);
    if (orderData.message!==undefined){//判断生成订单是否成功
        alert(orderData.message);//反馈出错信息
    }else {
        //请求参数
        var list = {
            openid : openid,
            orderId:orderData.orderId
        };

        // alert(JSON.stringify(list));
        $.ajax({
            //请求方式
            type: "POST",
            //请求的媒体类型
            contentType: "application/json;charset=UTF-8",
            //请求地址
            url: $url+"MarketPlatform/wx/getJSApiPayInfo",
            // url: "http://192.168.0.101:8080/MarketPlatform/wx/getJSApiPayInfo",
            //数据，json字符串
            data: JSON.stringify(list),
            //请求成功
            success: function (result) {
                // alert(JSON.stringify(result));
                if (result.message!==undefined){
                    alert(result.message);//反馈出错信息
                }else {
                    x_json = result.obj;
                    pay(list.orderId);// 请求调起微信支付
                }
            },
            //请求失败，包含具体的错误信息
            error: function (e) {
                alert('请勿频繁操作');
                console.log(e.status);
                console.log(e.responseText);
            }
        });
    }


}

//微信支付（支付确定操作）
function pay(orderId) {
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
                        $('.public').show();
                    },
                    error:function () {
                        alert('请勿频繁操作');
                    }
                })


            }
            else {
                //支付失败
                // alert(res.err_msg);
            }
        });
}

//关注公众号关闭
$('.public_item_cannel').click(function () {
    $('.public').hide();
});

/*获取链接参数
* http://www.baidu.com?a=1&b=2&c=3 ==> {a:1,b:2,c:3}
* */
function urlSearchT() {
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
function cartoontwo() {
    $('.loading').hide()
}
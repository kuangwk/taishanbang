function IsPC()  
{  
           var userAgentInfo = navigator.userAgent;  
           var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");  
           var flag = true;  
           for (var v = 0; v < Agents.length; v++) {  
               if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }  
           }  
           return flag;  
}

var jumpPc = IsPC();
if(jumpPc!=false){
//window.location.href = "http://up.qq.com";
}

document.body.addEventListener('touchstart', function (e) {
    //console.log("target:"+e.target.className);
    e = e.changedTouches[0];
    onStart(e);
});

document.body.addEventListener('touchmove', function (e) {
    onMove(e.changedTouches[0], e);
});

document.body.addEventListener('touchend', function (e) {
    onEnd(e.changedTouches[0]);
});

// 翻转的绑定
window.onorientationchange = orientationChange;

function initPage(){
  pageWidth = $(window).width();
  pageHeight = $(".wrap").height();
  pages = $(".wrap section");
  $(".bg .bg_sec").css("height",pageHeight);
    var bg_sec_height = $('.bg .bg_sec').height();

    $(".wrap section").css({
        "width":pageWidth+"px",//"height":$(".wrap").height()+"px"
        "height":pageHeight+"px"
    });
    //$(".wrap").height($(".wrap").height());

    secHeight = pageHeight * $(".wrap section").length;
    lineHeight = 832 * secHeight / pageHeight;

    $(".sec, .line").addClass("drag");
    animatePage(curPage);
    //$(".sec, .line").removeClass("drag");

}

function orientationChange(){
  initPage();
}

// 以下是拖动效果
var startX = 0,
    startY = 0;
    margin = 0;
var pages = null;
var curPage = 0;
var pageWidth = 0,
    pageHeight = 0;
var lineHeight = 0, secHeight = 0;
var targetElement = null;
var scrollPrevent = false, movePrevent = false, touchDown = false;

$(document).ready(function(){
  initPage();
});

function onStart (e) {
    if(movePrevent == true){
        event.preventDefault();
        return false;
    }
    if($(e.target).parents("#container").length==1){
        scrollPrevent = true;
    }else{
        scrollPrevent = false;
    }

    $(".map").on('click', function(e){
      $(".map_show").addClass("show");
    })

    if(!$(e.target).parents("#container").length==1){
      $(".map_show").removeClass("show");
    }

    touchDown = true;

    // 起始点，页面位置
    startX = e.pageX;
    startY = e.pageY;
    //margin = parseInt($(".sec").css("top"));
    //-webkit-transform:translateY(0px)

    //matrix(1, 0, 0, 1, 0, 8)

    $(".sec, .line").addClass("drag");

    margin = $(".sec").css("-webkit-transform");
    //margin = "matrix(1, 0, 0, 1, 0, -50)";
    margin = margin.replace("matrix(", "");
    margin = margin.replace(")", "");
    margin = margin.split(",");
    margin = parseInt(margin[5]);
}

function onMove (e, oe) {
    if(movePrevent == true || touchDown != true){
        event.preventDefault();
        return false;
    }
    event.preventDefault();
    if( scrollPrevent==false && e.pageY!=startY){
        var temp = margin + e.pageY - startY;
        $(".sec").css("-webkit-transform", "matrix(1, 0, 0, 1, 0, "+temp+")");
        var b =  lineHeight / secHeight * temp;
        $(".line").css("-webkit-transform", "matrix(1, 0, 0, 1, 0, "+b+")");
    }
}

function onEnd (e) {
    if(movePrevent == true){
        event.preventDefault();
        return false;
    }

    touchDown = false;

    if( scrollPrevent==false ){
        // 抬起点，页面位置
        endX = e.pageX;
        endY = e.pageY;
        // swip 事件默认大于50px才会触发，小于这个就将页面归回
        if( Math.abs(endY-startY)<=50) {
            animatePage(curPage);
        }else{
          if(endY>startY){
            prevPage();
          }else{
            nextPage();
          }
        }
    }

    $(".sec, .line").removeClass("drag");
}

function prevPage(){
    var newPage = curPage - 1;
    animatePage(newPage);
    
}
function nextPage(){
    var newPage = curPage + 1;
    animatePage(newPage);
}

function animatePage( newPage ){
    if(newPage<0){
        newPage = 0;
    }
    if(newPage>$(".wrap section").length-1){
        newPage = $(".wrap section").length-1;
    }

    curPage = newPage;
    var newMarginTop = newPage * (-pageHeight);
    $(".sec").css({
        "-webkit-transform" : "matrix(1, 0, 0, 1, 0, "+newMarginTop+")"
    });

    var newTop = -parseInt(curPage*pageHeight*(lineHeight/secHeight));
    $(".line").css({
        "-webkit-transform" : "matrix(1, 0, 0, 1, 0, "+newTop+")"
    });

    movePrevent = true;
    setTimeout("movePrevent=false;", 300 );

    // 每页动画
    if( !$(pages[curPage]).hasClass("sec0" + (curPage+1) + "_show") ){
        $(pages[curPage]).addClass("sec0" + (curPage+1) + "_show");
    }
    $(pages[curPage-1]).removeClass("sec0" + (curPage) + "_show");
    $(pages[curPage+1]).removeClass("sec0" + (curPage+2) + "_show");

}


// 视差
var scene = document.getElementById('scene');
function onBridgeReady() {
    var mainTitle="嘉讲堂第2季全国巡回演讲邀请函",
        mainDesc="嘉讲堂第2季全国巡回演讲",
        mainURL="http://dev.hotkeypower.com/lfhtml/jjt/index.html",
        mainImgUrl= "http://dev.hotkeypower.com/lfhtml/jjt/img/jia.jpg";

    //转发朋友圈
    WeixinJSBridge.on("menu:share:timeline", function(e) {
        var data = {
            img_url:mainImgUrl,
            img_width: "120",
            img_height: "120",
            link: mainURL,
            //desc这个属性要加上，虽然不会显示，但是不加暂时会导致无法转发至朋友圈，
            desc: mainDesc,
            title: mainTitle
        };
        WeixinJSBridge.invoke("shareTimeline", data, function(res) {
            WeixinJSBridge.log(res.err_msg)
        });
    });
    //同步到微博
    WeixinJSBridge.on("menu:share:weibo", function() {
        WeixinJSBridge.invoke("shareWeibo", {
            "content": mainDesc,
            "url": mainURL
        }, function(res) {
            WeixinJSBridge.log(res.err_msg);
        });
    });
    //分享给朋友
    WeixinJSBridge.on('menu:share:appmessage', function(argv) {
        WeixinJSBridge.invoke("sendAppMessage", {
            img_url: mainImgUrl,
            img_width: "120",
            img_height: "120",
            link: mainURL,
            desc: mainDesc,
            title: mainTitle
        }, function(res) {
            WeixinJSBridge.log(res.err_msg)
        });
    });
};
//执行
document.addEventListener('WeixinJSBridgeReady', function() {
    onBridgeReady();
});


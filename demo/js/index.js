// 需求1:点击菜单,显示菜单列表,菜单显示的时候,占屏幕宽度的80%,右侧的内容占20%;
// 需求2:获取轮播图数据,轮播图的自动轮播
// 需求3:tab栏的切换
var category;
window.addEventListener("load", function () {
    // 构造函数实例化的对象
    category = new Category();
    // 调用获取菜单列表的方法
    category.getCateList();
    // 调用获取轮播图的数据方法
    category.getSlideData();
    // 调用tab栏切换的方法
    category.getTabContent();
});
// 构造函数
var Category = function () {

};
// 原型函数
Category.prototype = {
    // 需求1:
    getCateList: function () {
        // 获取左边的菜单栏元素
        // var left =$(".main-left");
        // console.log(left.width());
        // var main =$("#main");
        // var right=$(".main-left");
        // console.log(left);
        // console.log(main);
            // 给菜单注册点击事件
            $(".header-menu").click(function () {
                // 给当前左边的菜单栏添加类名
                $(this).toggleClass("selected");
                // 如果有selected类名,就显示左边栏的内容
                if ($(this).hasClass("selected")) {
                    // left.width(main.width()*0.95);
                    // var leftW=left.width();
                    mainElement.style.transform = "translateX(0)";
                    mainElement.style.transition = "all 0.5s";
                } else {
                    mainElement.style.transform = "translateX(" + (-parentW) + "px)";
                    mainElement.style.transition = "all 0.5s";
                }
            });
        // 触摸事件
        // 获取当前移动的元素
        var mainElement = document.querySelector("#main .main-list");
        // console.log(mainElement);
        // 记录当前触摸的起始位置
        var startX = 0;
        mainElement.addEventListener("touchstart", function (e) {
            startX = e.changedTouches[0].clientX;
            // console.log(startY);
        });
        // 记录触摸移动的位置
        var moveX = 0;
        // 获取移动的位置
        var distanceX = 0;
        mainElement.addEventListener("touchmove", function (e) {
            moveX = e.changedTouches[0].clientX;
            distanceX = moveX - startX;
            // console.log("触摸开始的位置"+startX);
            // console.log("移动中的位置"+moveX);
            console.log("当前移动的位置" + distanceX);
            // 判断当前的移动距离,如果是等于0,该元素就不设置移动,反之就移动
            if(distanceX==0) {
                    mainElement.style.transform = "translateX(0)";
            }else {
                if ((currentX + distanceX) < maxSlide && (currentX + distanceX) > minSlide) {
                    mainElement.style.transform = "translate(" + (currentX + distanceX) + "px)";
                    // 设置过渡
                    mainElement.style.transition = "all 0.5s";
                }              
            }
        });
        // 设置最大移动的位置,当子元素与父元素左边对齐的时候
        var maxdistanceX = 0;
        // 获取当前移动元素的宽度
        var mainElementW = mainElement.offsetWidth;
        // 获取当前移动元素的父元素的宽度
        var parentW = mainElement.parentNode.offsetWidth;
        // console.log(parentW);
        // 设置最小移动的位置
        var mindistanceX = parentW - mainElementW;
        // console.log(mindistanceX);
        // 设置最大滚动距离
        var maxSlide = 50;
        // 设置最小滚动距离
        var minSlide = parentW - mainElementW - 50;
        // 记录当前的位置
        var currentX = 0;
        mainElement.addEventListener("touchend", function () {
            currentX += distanceX;
            console.log("当前的位置" + currentX+"当前移动的距离"+distanceX);
            // 判断当前的移动的位置是否会大于它父元素的1/3,如果是,就显示左边的元素,如果不是,还是显示当前的页面
            // console.log(Math.abs(distanceX));
            // console.log(parentW / 3);
            if (Math.abs(distanceX) > (parentW / 3)) {
                mainElement.style.transform = "translateX(0)";
                // 设置过渡
                mainElement.style.transition = "all 0.5s";
            } else {
                mainElement.style.transform = "translateX(" + (-parentW) + "px)";
                // 设置过渡
                mainElement.style.transition = "all 0.5s";
            }
            // 判断当前的位置是否会大于最大的移动位置,如果是,就让当前的位置等于它
            if (currentX > maxdistanceX) {
                currentX = maxdistanceX;
                mainElement.style.transform = "translate(" + currentX + "px)";
                // 设置过渡
                mainElement.style.transition = "all 0.5s";
            }
            // 判断当前的位置是否会小于最小的移动位置,如果是,就让当前的位置等于它
            if (currentX < mindistanceX) {
                currentX = mindistanceX;
                mainElement.style.transform = "translate(" + currentX + "px)";
                // 设置过渡
                mainElement.style.transition = "all 0.5s";
            }
        });
    },
    // 需求2:
    getSlideData: function () {
        // var $this=this;
        // 获取轮播图
        $.ajax({
            url: "http://127.0.0.1:9090/api/getlunbo",
            success: function (data) {
                var Data = {
                    "rows": data
                };
                // console.log(Data);
                var result = template("slideTmp", Data);
                $(".wrapper-list").html(result);
                // 轮播图的自动轮播
                // 定义一个变量,表示轮播图片的张数
                var idx = 1;
                // 设置timeID;
                var timeID;
                // 获取移动的元素
                var slideUl = document.querySelector(".wrapper-list .slide-img");
                // 获取移动的宽度
                var slideWidth = $(".wrapper-list").width();
                // console.log(slideWidth);
                // 克隆第一张图片添加到最后一张
                var cloneFirst = $(".slide-img>li:first-of-type").clone();
                // 克隆最后一张图片添加到第一张
                var cloneLast = $(".slide-img>li:last-of-type").clone();
                $(".slide-img>li:first-of-type").before(cloneLast);
                $(".slide-img>li:last-of-type").after(cloneFirst);
                // 获取所有的小圆点
                var pointList = document.querySelectorAll(".slide-point li");
                // console.log(pointList);
                setClock(); //先调用一下
                function setClock() {
                    timeID = setInterval(function () {
                        idx++;
                        // console.log(idx);
                        slideUl.style.transform = "translateX(" + (-idx * slideWidth) + "px)";
                        // 设置过渡
                        slideUl.style.transition = "all 0.6s";
                    }, 1000);
                };
                // 添加一个过渡限制,当整张图片轮播完才进行下一次的轮播
                var istransitionend = true; //默认是完成的;
                slideUl.addEventListener("transitionend", function () {
                    // 判断当前是不是最后一张图片,如果是,就让它快速回到第一张
                    if (idx >= 3) {
                        idx = 1;
                        slideUl.style.transform = "translateX(" + (-idx * slideWidth) + "px)";
                        // 取消过渡
                        slideUl.style.transition = "none";
                    };
                    // 判断当前索引是否为0;如果是,就让它回到最后一张图片
                    if (idx <= 0) {
                        idx = 2;
                        slideUl.style.transform = "translateX(" + (-idx * slideWidth) + "px)";
                        // 取消过渡
                        slideUl.style.transition = "none";
                    }
                    // 给下面的小圆点设置类名
                    for (var i = 0; i < pointList.length; i++) {
                        // pointList[0].classList.add("active");
                        // 先删除所有的类名
                        pointList[i].classList.remove("active");
                    }
                    // console.log(idx);
                    // 给当前的轮播的小圆点添加类名
                    pointList[idx - 1].classList.add("active");
                    istransitionend = true;
                });
                // 触摸事件的开始
                // 获取触摸开始的X坐标
                var startX = 0;
                slideUl.addEventListener("touchstart", function (e) {
                    // console.log(e);
                    startX = e.touches[0].clientX;
                    // 触摸同时停止计时器
                    clearInterval(timeID);
                    // console.log(startX);
                })
                // 获取滑动中的位置
                var moveX = 0;
                // 计算移动的位置
                var distanceX = 0;
                slideUl.addEventListener("touchmove", function (e) {
                    // console.log(e);
                    if (istransitionend) {
                        moveX = e.touches[0].clientX;
                        // console.log(moveX);
                        distanceX = moveX - startX;
                        // 设置移动
                        // console.log(startX);
                        // console.log(moveX);
                        // console.log(distanceX);
                        slideUl.style.transform = "translateX(" + ((-idx * slideWidth) + distanceX) + "px)";
                        // 去除过渡效果
                        slideUl.style.transiton = "none";
                    }
                });
                // 触摸结束
                slideUl.addEventListener("touchend", function () {
                    // console.log(e);
                    // 判断当前滑动的距离是否大于当前图片轮播宽度的1/3,如果是,就显示上一张或者是下一张
                    if (Math.abs(distanceX) > slideWidth / 3) {
                        // 判断当前滑动距离是大于0还是小于0
                        if (distanceX > 0) { //大于0代表往右边轮播
                            idx--;
                        } else { //小于0代表往左边轮播
                            idx++;
                        }
                    }
                    // 设置图片移动
                    slideUl.style.transform = "translateX(" + (-idx * slideWidth) + "px)";
                    // 设置过渡效果
                    slideUl.style.transform = "all 0.6s";
                    // 过渡没完成,设置为false;
                    istransitionend = false;
                    // 重新调用下计时器的函数
                    setClock();
                    // 触摸结束把所有记录都清0;下次触摸重新计算
                    startX = 0;
                    moveX = 0;
                    distanceX = 0;
                })
            }
        });

    },
    // 需求3:
    getTabContent: function () {
        // 找到所有的菜单标题列表
        var lis = document.querySelectorAll(".tab-item");
        // console.log(lis);
        // 循环添加索引
        for (var i = 0; i < lis.length; i++) {
            lis[i].setAttribute("index", i + 1);
        }
        category.getTableImg();
        $(".animation-menu>ul .tab-item").click(function () {
            // console.log(this);
            index = $(this).attr("index");
            console.log(index);
            $.ajax({
                url: "http://127.0.0.1:9090/api/gethometab/" + index + "",
                success: function (data) {
                    var Data = {
                        "rows": data
                    };
                    // console.log(Data);
                    var result = template("tab1Tmp", Data);
                    $(".animation-ul").html(result);
                }
            })
            // 给当前被点击的li标签添加类名,出去兄弟元素的类名
            $(this).addClass("active").siblings().removeClass("active");
            // 获取当前的下标
            var idx = $(this).index();
            // console.log(idx);
            $(".animation-content>ul").eq(idx).addClass("tap-pane").siblings().removeClass("tap-pane");
        });
    },
    getTableImg: function () {
        var index = 1;
        $.ajax({
            url: "http://127.0.0.1:9090/api/gethometab/" + index + "",
            success: function (data) {
                var Data = {
                    "rows": data
                };
                // console.log(Data);
                var result = template("tab1Tmp", Data);
                $(".animation-ul").html(result);
            }
        });
    }
}
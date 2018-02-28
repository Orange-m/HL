// 需求1:点击菜单,显示菜单列表,菜单显示的时候,占屏幕宽度的80%,右侧的内容占20%;
// 需求2:获取轮播图数据,轮播图的自动轮播
// 需求3:tab栏的切换
window.addEventListener("load", function () {
    // 构造函数实例化的对象
    var category = new Category();
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
        // 获取左边的内容;
        var mainLeft = document.querySelector(".main-left");
        // console.log(mainLeft );
        // 获取右边的内容;
        var mainRight = document.querySelector(".main-right");
        // 给菜单注册点击事件
        $(".header-menu").click(function () {
            // 给当前左边的菜单栏添加类名
            $(this).toggleClass("selected");
            // 如果有selected类名,就显示左边栏的内容
            if ($(this).hasClass("selected")) {
                // 获取整个内容的宽度
                var allWidth = document.querySelector("#main").offsetWidth;
                // 给左边的内容设置宽度
                mainLeft.style.width = allWidth - (allWidth * 0.5) + "px";
                mainLeft.style.display = "block";
                //获取左边内容的宽度
                var leftWidth = mainLeft.offsetWidth;
                // 给右边内容设置宽度,就让总宽度减去左边的宽度,就是右边的宽度了
                mainRight.style.width = allWidth - leftWidth + "px";
            } else {
                // 如果没有selected类名,就隐藏左边栏的内容
                mainLeft.style.display = "none";
            }
        });
    },
    // 需求2:
    getSlideData: function () {
        // 定义一个函数获取轮播图
        function getData(){
            $.ajax({
                url:"http://127.0.0.1:9091"
            })
        }
        // 轮播图的自动轮播
        // 定义一个变量,表示轮播图片的张数
        var idx = 1;
        // 设置timeID;
        var timeID;
        // 获取移动的元素
        var slideUl = document.querySelector(".slide-img");
        // 获取移动的宽度
        var slideWidth = slideUl.parentNode.offsetWidth;
        // console.log(slideWidth);
        // 获取所有的小圆点
        var pointList = document.querySelectorAll(".slide-point>li");
        // console.log(pointList);
        setClock(); //先调用一下
        function setClock() {
            timeID = setInterval(function () {
                idx++;
                // console.log(idx);
                slideUl.style.transform = "translateX(" + (-idx * slideWidth) + "px)";
                // 设置过渡
                slideUl.style.transition = "all 0.6s";
                // 给下面的小圆点设置类名
                // for (var i = 0; i < pointList.length; i++) {
                //     // console.log(pointList[i]);
                //     // 先删除所有的类名
                //     pointList[i].classList.remove("active");
                // }
                // 给当前的轮播的小圆点添加类名
                // console.log(pointList[idx-1]);
                // if (idx >= 6) {
                //     idx = 1;
                //     slideUl.style.transform = "translateX(" + (-idx * slideWidth) + "px)";
                //     // 取消过渡
                //     slideUl.style.transition = "none";
                // }
                // pointList[idx - 1].classList.add("active");
            }, 1000);
        };
        // 添加一个过渡限制,当整张图片轮播完才进行下一次的轮播
        var istransitionend = true; //默认是完成的;
        slideUl.addEventListener("transitionend", function () {
            // 判断当前是不是最后一张图片,如果是,就让它快速回到第一张
            if (idx >= 6) {
                idx = 1;
                slideUl.style.transform = "translateX(" + (-idx * slideWidth) + "px)";
                // 取消过渡
                slideUl.style.transition = "none";
            };
            // 判断当前索引是否为0;如果是,就让它回到最后一张图片
            if (idx <= 0) {
                idx = 5;
                slideUl.style.transform = "translateX(" + (-idx * slideWidth) + "px)";
                // 取消过渡
                slideUl.style.transition = "none";
            }
            // 给下面的小圆点设置类名
            for (var i = 0; i < pointList.length; i++) {
                // 先删除所有的类名
                pointList[i].classList.remove("active");
            }
            // 给当前的轮播的小圆点添加类名
            pointList[idx - 1].classList.add("active");
            istransitionend = true;
        });
        // 触摸事件的开始
        // 获取触摸开始的X坐标
        var startX = 0;
        slideUl.addEventListener("touchstart", function (e) {
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
            if (istransitionend) {
                moveX = e.touches[0].clientX;
                // console.log(moveX);
                distanceX = moveX - startX;
                // 设置移动
                console.log(startX);
                console.log(moveX);
                console.log(distanceX);
                slideUl.style.transform = "translateX(" + (-idx * slideWidth) + distanceX + "px)";
                // 去除过渡效果
                slideUl.style.transiton = "all 0.6s";
            }
        })
        // 触摸结束
        slideUl.addEventListener("touchend", function (e) {
            // console.log(e);
            // var end=e.changedTouches[0].clientX;
            // console.log(end);
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
    },
    // 需求3:
    getTabContent: function () {
        // 找到所有的菜单标题列表
        $(".animation-menu>ul .tab-item").click(function () {
            // console.log(this);
            // 给当前被点击的li标签添加类名,出去兄弟元素的类名
            $(this).addClass("active").siblings().removeClass("active");
            // 获取当前的下标
            var idx = $(this).index();
            // console.log(idx);
            $(".animation-content>ul").eq(idx).addClass("tap-pane").siblings().removeClass("tap-pane");
        });
    }
}
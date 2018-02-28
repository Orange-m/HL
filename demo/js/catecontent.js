var category;
window.addEventListener("load", function () {
    // 构造函数实例化的对象
    category = new Category();
    // 调用获取菜单列表的方法
    category.getContent();
    // 产品列表的滚动方法
    // category.getRoll();
});
// var stripRollHeight=0;
// 构造函数
var Category = function () {

};
// 原型函数
Category.prototype = {
    getContent: function () {
        $.ajax({
            url: "http://127.0.0.1:9090/api/getlianzai",
            success: function (data) {
                // console.log(data);
                var Data = {
                    "rows": data
                };
                // console.log(Data);
                var result = template("contentTmp", Data);
                $(".strip-lists").html(result);
                category.getRoll();
            }
        })
    },
    getRoll: function () {
        var stripRoll = document.querySelector(".strip-lists");
        console.log(stripRoll.offsetHeight);
        //定义触摸的起始位置
        var startY = 0;
        // 触摸事件
        stripRoll.addEventListener("touchstart", function (e) {
            startY = e.changedTouches[0].clientY;
            // console.log(startY);
        });
        // 记录移动中位置
        var moveY = 0;
        //  记录移动的位置
        var distanceY = 0;
        // 触摸移动事件
        stripRoll.addEventListener("touchmove", function (e) {
            moveY = e.changedTouches[0].clientY;
            // console.log(moveY);
            // 移动的位置就等于移动中的位置-起始的位置
            distanceY = moveY - startY;
            // 判断当前的位移位置是否会小于最大滚动值并且大于最小滚动值,这样才允许元素滚动
            if ((currentY + distanceY) < maxSlide && (currentY + distanceY) > minSlide) {
                stripRoll.style.transform = "translateY(" + (currentY + distanceY) + "px)";
                // 设置过渡效果
                stripRoll.style.transition = "all 0.2s";
            }
        });
        // 触摸停止事件
        // 记录当前的位置
        var currentY = 0;
        // 设置允许滚动的最大距离
        var maxSlide = 150;
        // 计算出允许滚动的最小距离
        var minSlide = 0;
        var stripRollHeight = stripRoll.offsetHeight; //获取当前元素的高度
        var parentH = stripRoll.parentNode.offsetHeight; //获取当前元素的父元素的高度
        minSlide = parentH - stripRollHeight - 150;
        // console.log(minSlide);
        // 设置位移的最大值,当滚动的元素和父元素顶部相连时
        var maxdistance = 0;
        // 设置位移的最小值,当滚动的元素和父元素底部相连时
        var mindistance = parentH - stripRollHeight;
        stripRoll.addEventListener("touchend", function (e) {
            currentY += distanceY;
            // 判断当前的位置是否大于最大的移动位置,如果是,就让当前位置等于最大位置
            if (currentY > maxdistance) {
                currentY = maxdistance;
                // console.log(currentY);
                stripRoll.style.transform = "translateY(" + currentY + "px)";
                // 设置过渡效果
                stripRoll.style.transition = "all 0.2s";
            }
            // 判断当前的位置是否小于最小的移动位置,如果是,就让当前位置等于最小位置
            if (currentY < mindistance) {
                currentY = mindistance;
                // console.log(currentY);
                stripRoll.style.transform = "translateY(" + currentY + "px)";
                // 设置过渡效果
                stripRoll.style.transition = "all 0.2s";
            }
        })
    }
}
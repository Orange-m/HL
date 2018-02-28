var category;
window.addEventListener("load", function () {
    // 构造函数实例化的对象
    category = new Category();
    // 调用获取菜单列表的方法
    category.getContent();
});
// 构造函数
var Category = function () {

};
// 原型函数
Category.prototype = {
    getContent: function () {
        $.ajax({
            url: "http://127.0.0.1:9090/api/gettopics",
            success: function (data) {
                // console.log(data);
                var Data = {
                    "rows": data
                };
                // console.log(Data);
                var result = template("contentTmp", Data);
                $(".contents").html(result);
                category.getRoll();
            }
        })
    },
    getRoll: function () {
        // 获取当前移动的元素
        var rollElement = document.querySelector(".contents");
        // console.log(rollElement);
        // 获取当前移动元素的高度
        var rollH = rollElement.offsetHeight;
        // console.log(rollH);
        var parentH = rollElement.parentNode.offsetHeight;
        // console.log(parentH);
        // 记录触摸起始位置
        var startY = 0;
        rollElement.addEventListener("touchstart", function (e) {
            // console.log(e);
            startY = e.changedTouches[0].clientY;
        });
        // 记录触摸移动中的位置
        var moveY = 0;
        // 获取当前的移动了的距离
        var distanceY = 0;
        rollElement.addEventListener("touchmove", function (e) {
            // console.log(e);
            moveY = e.changedTouches[0].clientY;
            distanceY = moveY - startY;
            // console.log(moveY,distanceY);
            // 假如当前的位置会小于最大允许滚动值并且大于最小滚动值,这种情况下才允许移动
            if((currentY+distanceY)<maxSlide&&(currentY+distanceY)>minSlide) {
                rollElement.style.transform = "translateY(" + (currentY+distanceY) + "px)";
                // 设置过渡效果
                rollElement.style.transition = "all 0.2s";
            }
        });
        // 允许滚动的最大值
        var maxSlide = 150;
        // 计算允许滚动的最小值
        var minSlide = 0;
        minSlide = parentH - rollH - 150;
        // 设置移动的最大值,当滚动的元素和父元素顶部相连时
        var maxdistanceY = 0;
        // 设置位移的最小值,当滚动的元素和父元素底部相连时
        var mindistanceY = parentH - rollH;
        // 记录当前的位置
        var currentY=0;
        // 触摸结束事件
        rollElement.addEventListener("touchend",function(){
            // 当前的位置就会等于之前移动的距离相加
            currentY+=distanceY;
            // console.log(mindistanceY,currentY);
            // 判断当前位置是否大于最大移动值,如果是,就让当前的位置等于最大值的位置
            if(currentY>maxdistanceY){
                // console.log(currentY);
                currentY=maxdistanceY;
                rollElement.style.transform = "translateY(" + currentY + "px)";
                // 设置过渡效果
                rollElement.style.transition = "all 0.2s";
            }
            // 判断当前位置是否小于最小移动值,如果是,就让当前的位置等于最小值的位置
            if(currentY<mindistanceY){
                currentY=mindistanceY;
                rollElement.style.transform = "translateY(" + currentY + "px)";
                // 设置过渡效果
                rollElement.style.transition = "all 0.2s";
            }
        })
    }
}
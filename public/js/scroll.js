/**
 * Created by Administrator on 2016/3/2.
 */
$(function() {
    var temp1 = $(".eggFrenzy_sec21_con");
    var temp2 = $(".eggFrenzy_sec21_con ul");
    temp1.height(temp2.height());
    var lenth0 = temp1.width();
    var lenth1 = temp2.children("li").length;
    var width1 = temp2.children("li").width();
    var width2 = lenth1 * width1;
    var width3 = (lenth1 - 4) * width1;
    //产品左右滑动
    var timer = setInterval(setTimerM, 1000 * 4);

    function setTimerM() {
        changeSite();
    }

    temp2.mouseover(function() {
        clearInterval(timer);
    });
    temp2.mouseleave(function() {
        timer = setInterval(setTimerM, 1000 * 4);

    });

    function changeSite() {
        var sub01 = temp2.css('left');
        var sub02 = sub01.substring(0, sub01.length - 2);
        if (!temp2.is(":animated")) {
            if (sub02 <= -width3) {
                temp2.animate({
                    left: '0px'
                }, 1000);
            } else {
                temp2.animate({
                    left: '-=' + width1
                }, 1000);
            }
        }
    }
})
var EggPlugin = function(option) {
    var prizeItemList = option.prizeItemList;
    var animationCount = option.animationCount;
    var _this = this;
    var eggCount = option.lastCount; //奖励个数
    var preResult = false; //上一次结果是否中奖 
    var isRun = false;
    var programIndex = 0; //砸蛋逻辑 

    _this.Init = function(document) {
        //if (isRun || !document.hasClass("action") || eggCount <= 0) return; //等待上一个砸完才能再砸 ||  已经砸过的不能砸 || 数量没了不能砸
        if (isRun || eggCount <= 0) return; 
        //document.removeClass(); //禁用点击 
        isRun = true; //同时只能点一个
        var timer = null;
        var num = 0;
        var prizeIndex; //奖品编号 
        var doc = document.find('img');
        var count = animationCount; //动画次数

        //砸蛋动画
        timer = setInterval(function() {
            if (num < 4) {
                doc[0].src = 'public/images/egg' + num + '.png';
            } else {
                num = 0;
                count--;
            }

            if (count == 0) {
                //业务逻辑处理
                clearInterval(timer); //停止动画  \
                // （1）剩余1次砸蛋机会，第一次砸蛋即可砸中奖品
                // （2）第一次砸蛋没砸到，第二次砸蛋砸中奖品
                // （3）剩余8次砸蛋机会，按砸蛋顺序1-8获得奖品，8个奖品，8个奖品图，8个对应

                /*********************edit at 2017年2月15日16:09:58************************* */
                // （1）剩余1次砸蛋机会，第一次砸蛋即可砸中奖品（可选展示奖品为奖品1及对应图片和链接）
                // （2）第一次砸蛋没砸到，第二次砸蛋砸中奖品（可选展示奖品为奖品1及对应图片和链接）
                // （3）剩余8次砸蛋机会，按砸蛋顺序1-8获得奖品，8个奖品，8个奖品图，8个对应链接。（砸蛋一次，剩余机会数减少一次）
                switch (programIndex) {

                    case 0:
                        {
                            prizeIndex = 0;
                            if (eggCount == 1) {
                                prizeIndex = 0;
                            }
                            break;
                        }
                    case 1:
                        {
                            if (eggCount == 8) {
                                prizeIndex = 0;
                            } else if (eggCount == 7 && preResult == false) {
                                prizeIndex = 1;
                            } else {
                                prizeIndex = getRandomNum(false);
                            }
                            break;
                        }
                    case 2:
                        {
                            prizeIndex = 9 - eggCount;
                            break;
                        }
                }

                doc[0].src = 'public/images/egg0.png';
                
                doJinDanResult(1);
                console.log("p=" + programIndex + "  i=" + prizeIndex);
            }
            num++;
        }, 200);

        eggCount--; //蛋数-1 
        editEggCountPage();
    }

    //修改页面eggCount
    editEggCountPage = function() {
        $('#eggC')[0].innerText = eggCount; //修改页面 
    }
    // 参数 0 未中奖  
    // 参数 1-8 对应1到8的奖品
    doJinDanResult = function(index) {
        if (index > 0) { //中奖了
            preResult = true;
        }
        clickJinDanView(index); //弹窗结果 
    }

    clickJinDanView = function(index) {
        var str = '';
        str += '<div class="bg-mask"></div>';
        str += '<div class="pop-cj">';
        str += '<div class="close" alt="关闭"></div>';
        str += '<img class ="link" src="public/images/';
        str += prizeItemList[index].url;
        str += '" alt="结果">';
        str += '</div>';
        //禁用滚动条
        disableScrool(true);
        $("#imglink").attr("href","prizeResult.html");
        $('body').append(str);

        if(index > 0)
        {
            $('.pop-cj .link').bind('click', function() {
                location.href = prizeItemList[index].link;
            });
        }
        
        //10秒后关闭
        //setTimeout(closePop, 10000);

        //绑定关闭抽奖结果按钮
        $('.pop-cj .close').bind('click', '.close', closePop);
    }

    //获取随机数
    getRandomNum = function(isMoreZero) {
        var Rand = Math.random();
        if (Rand > 0.8) {
            Rand = 1 - Rand;
        }
        if (isMoreZero && Rand < 0.1) {
            Rand = 0.8 - Rand;
        }
        return Math.round(Rand * 10);
    }

    //是否禁用页面滚动（包括移动端）
    disableScrool = function(flag) {
            if (flag) {
                $('html').addClass('noscroll').on('touchmove', function(event) {
                    event.preventDefault();
                });
            } else {
                $('html').removeClass('noscroll').unbind('touchmove');
            }
        }
        //关闭弹窗
    closePop = function() {
            $('.bg-mask').remove();
            $('.pop-cj').remove();
            disableScrool(false);
            isRun = false;
        }
        //根据参数修改页面数据
        //eggCount = 0;
    editEggCountPage();
    programIndex = getRandomNum();
}
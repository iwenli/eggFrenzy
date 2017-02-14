var EggPlugin = function(option){  
    var prizeItemList = option.prizeItemList;
    var animationCount= option.animationCount;

    var _this = this;
    var eggCount = prizeItemList.length -1; //奖励个数
    var preResult = false;
    var isRun = false;  
    var timerClose = null;

    _this.Init = function(document){ 
        if(isRun || !document.hasClass("action") || eggCount <= 0) return; //等待上一个砸完才能再砸 ||  已经砸过的不能砸 || 数量没了不能砸
        
		document.removeClass(); //禁用点击 
        isRun = true; //同时只能点一个
        var timer = null;  
        var num = 1;  
        var prizeIndex; //奖品编号 
        var doc =  document.find('img');
        var count = animationCount; //动画次数

		//砸蛋动画
        timer = setInterval(function(){  
            if (num < 4) {    
                doc[0].src='public/images/egg'+num+'.png';
            }
            else{
               num=0; 
               count--;
            } 
			
            if(count == 0) 
            {
                //业务逻辑处理
                clearInterval(timer); //停止动画  
                // （1）剩余1次砸蛋机会，第一次砸蛋即可砸中奖品
                // （2）第一次砸蛋没砸到，第二次砸蛋砸中奖品
                // （3）剩余8次砸蛋机会，按砸蛋顺序1-8获得奖品，8个奖品，8个奖品图，8个对应
                if(eggCount == 1 || (eggCount == 7 && preResult == false)) {
                    prizeIndex = getRandomNum(true);
                }
                else{
                     prizeIndex = getRandomNum(false);
                }
                
                if(prizeIndex == 0){ 
                    doc[0].src='public/images/egg4.png';   //未中奖 
                }
                else{
                     doc[0].src='public/images/egg5.png';   //中奖
                }  
                doJinDanResult(prizeIndex);
            }
            num++;  
        },200);
        eggCount--; //次数-1 
        editEggCountPage();
    }

    //修改页面eggCount
    editEggCountPage = function(){
        $('#eggC')[0].innerText = eggCount; //修改页面 
    }

    // 参数 0 未中奖  
    // 参数 1-8 对应1到8的奖品
     doJinDanResult = function(index){
        if(index > 0) {  //中奖了
            preResult = true;
        } 
        clickJinDanView(index);   //弹窗结果 
    }

    clickJinDanView = function(index){   
		var str = '';
		str +='<div class="bg-mask"></div>';
		str +='<div class="pop-cj">'; 
		str +='<img class="close" src="public/images/x.png" alt="关闭">';
		str +='<img class ="link" src="public/images/';
        str += prizeItemList[index].url;
        str +='" alt="结果">';
		str +='</div>';  
        //禁用滚动条
        disableScrool(true);  

		$('body').append(str);

        $('.pop-cj').on('click','.link',function(){ 
            location.href = prizeItemList[index].link;
        });
        //10秒后关闭
		timerClose =  setTimeout(closePop,10000);

        //绑定关闭抽奖结果按钮
        $('body').on('click','.close',closePop);
	}

    //获取随机数
    getRandomNum = function(isMoreZero)
    {
        var Rand = Math.random();  
        if(Rand > 0.8) {
            Rand = 1-Rand;
        }
        if(isMoreZero && Rand < 0.1){
            Rand = 0.8 - Rand;
        }
        return Math.round(Rand*10);   
    }  

    //是否禁用页面滚动（包括移动端）
    disableScrool = function(flag){
        if(flag){
            $('html').addClass('noscroll').on('touchmove', function(event) {
                event.preventDefault();
            });
        }
        else{
            $('html').removeClass('noscroll').unbind('touchmove'); 
        }
    }
    //关闭弹窗
    closePop = function(){
        $('.bg-mask').remove();
        $('.pop-cj').remove();
        disableScrool(false);
        isRun = false;
        clearInterval(timerClose); //停止动画 
    } 
    //根据参数修改页面数据
    editEggCountPage();
}     
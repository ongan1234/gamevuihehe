var loader,assetsLoader,countAssetsLoaded,curPer,totalAssets,count;
var stage,renderer,container;
var sw = window.innerWidth;
var sh = window.innerHeight;
var sence0,sence1,sence2,sence3,bubbleBG;
var curMouseX,curMouseY;
var count_sc_eff = 0;
var myRatio = 1;

var initW = 320;
var initH = 568;

var frutPerBottle = 1;
var totalBottle = 2;
var countFrut = 0;

var startTime;
var countTime;
var totalTime = 30;
var stopCountDown = false;

var isStop = false;
var count_sc_eff_bg = 0;
var myCode = "-1";

var isWin = false;
// var haveAPrize = false;


////////////////////////////////////
function init(){
    
    trace("init");

    assetsLoader = [];

    stage = new PIXI.Stage();
    renderer = PIXI.autoDetectRenderer(sw,sh,{transparent:true});
    document.getElementById('canvasHolder').appendChild(renderer.view);

    createBubbleBG();
    container = stage.addContainer({id:"container",alpha:0});

    createSence_0();
    createSence_1();
    createSence_2();
    createSence_3();
    
    
    $(window).resize(onResize);
    onResize();

    startLoadAssets();

    stage.mousedown = stage.touchstart = function(data){
        var mousePos = data.getLocalPosition(this);
            curMouseX = mousePos.x;
            curMouseY = mousePos.y;

           // trace(curMouseX+" - " +curMouseY);
    }
}

function onResize() {
    sw = window.innerWidth;
    sh = window.innerHeight;

    myRatio = sh/initH;

    if(myRatio > 2) myRatio = 2;

    $('#canvasHolder canvas').width = sw;
    $('#canvasHolder canvas').height = sh;

    createSence_0_resize(sw,sh);
    createSence_1_resize(sw,sh);
    createSence_2_resize(sw,sh);
    createSence_3_resize(sw,sh);

   renderer.resize(sw,sh);
}


/////////////////////////////////////////////////////////////////////////////////////////
function animationIn(){
    trace("animationIn");

    onResize();

    var dur = .5;
    var delay = 1;

    TweenMax.to(container,dur,{delay:delay,alpha:1,ease:Sine.easeOut});
    TweenMax.to(bubbleBG,dur,{delay:delay,alpha:1,ease:Sine.easeOut});
    
    sence0_start();
}

function stopGame(){
    trace("stop game");
    stopCountDown = true;
    isStop = true;
        
    if(!haveAPrize) gotoSence(sence1,sence2);
    else{
		 haveAPrize = false;
            gotoSence(sence1,sence2);
     /*   var numOfBottle =  Math.floor(countFrut/frutPerBottle);
        if(numOfBottle >=totalBottle){
            getCodeFromBackend();
        }else{
            haveAPrize = false;
            gotoSence(sence1,sence2);
        }
		*/
    }
}

function startCountDown(){
    stopCountDown = false;
    startTime = Date.now();
    requestAnimFrame(countDown);
}

function countDown(){
    if(isStop) return;
    if(stopCountDown) return;

    countTime = Date.now()-startTime;
    requestAnimFrame(countDown,100);
    setTime(countTime);
}

function setTime(count){
    
    var ms = Math.floor((count%1000)/10);
    var ss = Math.floor(count/1000)%60;
    var mm = Math.floor(Math.floor(count/1000)/60)%60;
    var hh = Math.floor((Math.floor(count/1000)/60)/60)%60;
    
    if(ms < 10) ms = "0" + ms;
    if(ss < 10) ss = "0" + ss;
    if(mm < 10) mm = "0" + mm;
    if(hh < 10) hh = "0" + hh;

    var curTime = totalTime - ss;
        if(curTime <= 0){
          curTime = 0;
          stopGame();
        }

        if(curTime < 10) curTime = "0" + curTime;
        sence1.countDown.txt.setText(curTime);
        sence1.countDown.s.x = sence1.countDown.txt.position.x + sence1.countDown.txt.width;
}

function createBubbleBG(){

    bubbleBG = stage.addContainer({id:"bg",alpha:0});

    var itemArr = [];
    with(bubbleBG){
        for(var i=0; i<20; i++){
            var item = addObject({id:"item"+i,url:"images/tini_bubble.png"})
            addChild(item);
            itemArr.push(item);
            randomBubbleBG(item,true);
        }

        bubbleBG.itemArr = itemArr;
    }

    requestAnimFrame(enterBubbleBG,100);
}

function enterBubbleBG(){
    var itemArr = bubbleBG.itemArr;
    var len = itemArr.length;

    for(var i=0; i<len; i++){
        var item = itemArr[i];
            item.x += item.sp_x;
            item.y -= item.sp_y;

            item.scale.x = item.initSC + Math.sin(count_sc_eff_bg) * 0.08;
            item.scale.y = item.initSC + Math.cos(count_sc_eff_bg) * 0.08;

            if(item.position.x < -item.width ||
               item.position.x > (sw + item.width) ||
               item.position.y < -item.height){

                if(item.curFrut){
                    item.removeChild(item.curFrut);
                }

                randomBubbleBG(item,false);
            }
    }

    count_sc_eff_bg +=0.1;
    requestAnimFrame(enterBubbleBG,100);
}

function randomBubbleBG(item,flag){
    item.position.x = (Math.random() - Math.random())*sw;
    if(flag) item.position.y = Math.random()*sh;
    else item.position.y = sh;

    item.scale.x = item.scale.y = Math.random()*.5 + .1;
    item.initSC = item.scale.x;
    item.alpha = item.scale.x;
    item.rotation = (Math.random() - Math.random())*360;

    item.sp_x = (Math.random() - Math.random())*2;
    item.sp_y = Math.random()*2 + 1;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
function gotoSence(curSence,target){
    TweenMax.to(container,.3,{alpha:0,ease:Sine.easeOut,onComplete:function(){
            container.removeChild(curSence);
            TweenMax.to(container,.3,{alpha:1,ease:Sine.easeOut});

            switch(target.id){
                case "s1": sence1_start();
                break;
                case "s2": sence2_start();
                break;
                case "s3": sence3_start();
                break;
            }
    }})
}

///////////////////////////////////////////////////
function createSence_3(){
    trace("createSence_3");

    with(container){

        sence3 = addContainer({id:"s3",visible:false});

        with(sence3){
            addObject({id:"bg",url:"images/lastScence_bg.png",scaleX:.5,scaleY:.5})

            addContainer({id:"frutHolder"});
            addObject({id:"lastScence",url:"images/lastScence.png",scaleX:.5,scaleY:.5})
            
            with(frutHolder){
                addObject({id:"big_bottle",url:"images/big_bottle.png",scaleX:.5,scaleY:.5,locationX:32 ,locationY:135});
                big_bottle.rotation  = convertToRadian(20);

                addObject({id:"f1",url:"images/f1.png",scaleX:.5,scaleY:.5,locationX:80 ,locationY:274});
                addObject({id:"f2",url:"images/f2.png",scaleX:.5,scaleY:.5,locationX:-83 ,locationY:345});
                addObject({id:"f3",url:"images/f3.png",scaleX:.5,scaleY:.5,locationX:-115 ,locationY:225,x:-10,y:-35});
            }

            addObject({id:"logo",url:"images/logo.png",scaleX:.5,scaleY:.5})
            addObject({id:"goNowBtn",url:"images/goNowBtn.png",scaleX:.5,scaleY:.5})
            addObject({id:"connectWifiBtn",url:"images/connectWifiBtn.png",scaleX:.5,scaleY:.5})

            addObject({id:"myCodeHolder",url:"images/codeBG.png",scaleX:.6,scaleY:.6,visible:false})
            myCodeHolder.addText({id:"code",text:"ABC",font:"bold 17px Arial",color:"#008d41",locationX:65,locationY:12});
        }
    }//end with
}

function sence3_start(){
    var timeout;
    sence3.visible = true;
    sence3.interactive = true;

    with(sence3){
        goNowBtn.interactive = true;
        goNowBtn.buttonMode = true;
        goNowBtn.mousedown = goNowBtn.touchstart = function(data){
            trace("trai nghiem ngay");
            this.alpha = .5;
        }

        goNowBtn.mouseup = goNowBtn.mouseupoutside = goNowBtn.touchend = goNowBtn.touchendoutside = function(data){
            this.alpha = 1;
            connectToWifi();
        }

        connectWifiBtn.interactive = true;
        connectWifiBtn.buttonMode = true;
        connectWifiBtn.mousedown = connectWifiBtn.touchstart = function(data){
            trace("ket noi wifi");
            connectToWifi();
            this.alpha = .5;
        }

        connectWifiBtn.mouseup = connectWifiBtn.mouseupoutside = connectWifiBtn.touchend = connectWifiBtn.touchendoutside = function(data){
            this.alpha = 1;
        }

        TweenMax.to(lastScence,1.5,{delay:Math.random(),y:5,yoyo:true,repeat:-1,ease:Sine.easeInOut,onUpdate:function(){
            bg.y = lastScence.y;
        }});

        with(frutHolder){
            var rota = convertToRadian((Math.random()-Math.random())*20);
            TweenMax.to(big_bottle,1.5,{delay:Math.random(),y:big_bottle.initY - 15,yoyo:true,repeat:-1,ease:Sine.easeInOut});
            TweenMax.to(f1,1.5,{delay:Math.random(),y:f1.initY + 15,yoyo:true,repeat:-1,ease:Sine.easeInOut});
            TweenMax.to(f2,1.5,{delay:Math.random(),y:f2.initY + 15,yoyo:true,repeat:-1,ease:Sine.easeInOut});
            TweenMax.to(f3,1.5,{delay:Math.random(),rotation:rota,y:f3.initY + 8,yoyo:true,repeat:-1,ease:Sine.easeInOut});
        }


        if(haveAPrize){
            if(isWin){
                myCodeHolder.visible = true;
                myCodeHolder.code.setText(myCode);
            }
        }
    }
}

function createSence_3_resize(sw,sh){
    with(sence3){
        
        logo.scale.x = logo.scale.y = myRatio;
        logo.position.x = (sw - logo.width)/2;
        logo.position.y = 10;

        bg.scale.y = myRatio;
        bg.width = sw;
        
        lastScence.scale.y = lastScence.scale.x = myRatio;
        lastScence.position.x = (sw - lastScence.width)/2;

        frutHolder.scale.y = frutHolder.scale.x = myRatio;
        frutHolder.position.x = sw/2;
        
        goNowBtn.scale.y = goNowBtn.scale.x = myRatio;
        goNowBtn.position.x = (sw - goNowBtn.width)/2;
        goNowBtn.position.y = sh - 95*myRatio;

        connectWifiBtn.scale.y = connectWifiBtn.scale.x = myRatio;
        connectWifiBtn.position.x = (sw - connectWifiBtn.width)/2;
        connectWifiBtn.position.y = sh - 47*myRatio;

        myCodeHolder.scale.y = myCodeHolder.scale.x = myRatio;
        myCodeHolder.position.x = (sw - 160*myRatio)/2;
        myCodeHolder.position.y = sh - 160*myRatio;
    }
}



///////////////////////////////////////////////////
function createSence_2(){
    trace("createSence_2")

    with(container){

        sence2 = addContainer({id:"s2",visible:false});
        sence2.interactive = true;
        sence2.buttonMode = true;

        with(sence2){
            addRect("hit",sw,sh,"0xff0",0,0,0);
            addObject({id:"logo",url:"images/logo.png",scaleX:.5,scaleY:.5})
            addObject({id:"copy1",url:"images/congratulation.png",scaleX:.5,scaleY:.5,visible:false});
            addObject({id:"copy2",url:"images/win.png",scaleX:.5,scaleY:.5,visible:false})
        }
    }//end with
}

function sence2_start(){
    var timeout;
    sence2.visible = true;
    
    if(!haveAPrize){
        var txt = sence2.copy1.addText({id:"txt",text:"0",font:"bold 30px Arial",color:"#008d41",locationX:75 ,locationY:93});
        var numOfBottle =  Math.floor(countFrut/frutPerBottle);

        if(numOfBottle < 10 && numOfBottle !=0 ) numOfBottle = "0" + numOfBottle;
        txt.setText(numOfBottle);
        if(numOfBottle >0) txt.position.x = txt.initX - txt.width/2;

        sence2.copy1.visible = true;
        sence2.copy2.visible = false;

        timeout = setTimeout(function(){
            gotoSence(sence2,sence3);
        },3000);

    }else{

        sence2.copy1.visible = false;
        sence2.copy2.visible = true;

        timeout = setTimeout(function(){
            gotoSence(sence2,sence3);
        },8000);
    }

  /*  sence2.mousedown = sence2.touchstart = function(data){
        clearTimeout(timeout);
        gotoSence(sence2,sence3);
    }*/
}

function setCode(code){
     myCode = code;
     isWin = true;

     if(myCode ==""){
        haveAPrize = false;
     }
 
     //
     var txt = sence2.copy2.addText({id:"code",text:code,font:"bold 25px Arial",color:"#008d41",locationX:90 ,locationY:310});
         txt.position.x = 90 + (130 - txt.width)/2;

    gotoSence(sence1,sence2);         
}


function createSence_2_resize(sw,sh){
    with(sence2){

        hit.width = sw;
        hit.height = sh;
        
        logo.scale.x = logo.scale.y = myRatio;
        logo.position.x = (sw - logo.width)/2;
        logo.position.y = 10;

        copy1.scale.x = copy1.scale.y = myRatio;
        copy1.position.x = (sw - copy1.width)/2;
        copy1.position.y = (sh - copy1.height + logo.height)/2;

        copy2.scale.x = copy2.scale.y = myRatio;
        copy2.position.x = (sw - copy2.width)/2;
        copy2.position.y = (sh - copy2.height + logo.height)/2;
    }
}

///////////////////////////////////////////////////
function createSence_1(){
    trace("createSence_1")
    with(container){

        sence1 = addContainer({id:"s1",locationX:sw/2,locationY:sh/2,alpha:0});

        with(sence1){
            addRect("hit",sw,sh,"0xff0",0,0,0);
            addContainer({id:"frutHolder"})
            addContainer({id:"bubbleHolder"})
            addContainer({id:"checkHitHolder"});
            addContainer({id:"countDown",alpha:0});
            addContainer({id:"progressHoder",locationX:-35,alpha:0});
            addContainer({id:"intro"});

            addObject({id:"small_bubble_group",url:"images/bubble_group.png",visible:false});

            with(intro){
                addObject({id:"copy",url:"images/intro_copy.png",scaleX:.5,scaleY:.5,locationX:-155,locationY:-20})
            }
 
            with(countDown){
                addObject({id:"bg",url:"images/countDown.png",scaleX:.5,scaleY:.5});
                addText({id:"txt",text:totalTime,font:"bold 20px Arial",color:"#008d41",locationX:130 ,locationY:15});
                addText({id:"s",text:"s",font:"bold 15px Arial",color:"#008d41",locationX:129 ,locationY:19});
            }

            with(progressHoder){
                addObject({id:"progress_bg",url:"images/progress_bg.png",scaleX:.5,scaleY:.5});
                addObject({id:"progress_bar",url:"images/progress_bar.png",scaleX:.5,scaleY:.5,locationX:3 ,locationY:3});
                addObject({id:"num",url:"images/numOfFrut.png",scaleX:.5,scaleY:.5,locationX:7 ,locationY:7});
                addObject({id:"bottle",url:"images/bottle_double.png",scaleX:.5,scaleY:.5,locationX:80 ,locationY:-37});
            }


            frutHolder.addContainer({id:"core"});
            with(frutHolder){
                var itemArr = [];
                var breakArr = [];
                var ratio = sh/568;
                    if(sh < sw) ratio = sw/568;

                var r = 90 + (ratio - 1)*50;
                var sc = .3;
                itemArr.push(creatFrut(core,"lemon","images/lemon.png",12,r,sc));
                itemArr.push(creatFrut(core,"apple","images/apple.png",12,r,sc));
                itemArr.push(creatFrut(core,"mangcau","images/mangcau.png",12,r,sc));
                itemArr.push(creatFrut(core,"apple","images/apple.png",12,r,sc));
                
                breakArr.push(addObject({id:"lemon_broken",url:"images/lemon_broken.png",visible:false}));
                breakArr.push(addObject({id:"apple_broken",url:"images/apple_broken.png",visible:false}));
                breakArr.push(addObject({id:"mangcau_broken",url:"images/mangcau_broken.png",visible:false}));
                breakArr.push(addObject({id:"apple_broken",url:"images/apple_broken.png",visible:false}));

                frutHolder.breakArr = breakArr;

                var sc = 1/itemArr.length;
                for(var i=0; i<itemArr.length; i++){
                    var item = itemArr[i];
                        item.frutID = i;
                        item.rotation = convertToRadian(45);
                        item.scale.x = item.scale.y = 3;  
            
                }

                frutHolder.itemArr = itemArr;
            }//end with


            with(bubbleHolder){
                var bubbleArr = [];
                for(var i=0; i<5; i++){
                    var bubbleItem = addObject({id:"bubble"+i,regPerX:.5,regPerY:.5,url:"images/bubble.png",scaleX:.5,scaleY:.5});
                    bubbleArr.push(bubbleItem);
                    randomFn(bubbleItem,true);
                }

                bubbleHolder.bubbleArr = bubbleArr;

            }//end with
        }//end with
    }//end with
}

function createSence_1_resize(sw,sh){
    with(sence1){
        hit.width = sw;
        hit.height = sh;
        hit.position.x = -hit.width/2;
        hit.position.y = -hit.height/2;

        position.x = sw/2;
        position.y = sh/2;

        countDown.position.x = -80;
        countDown.position.y = -sh/2 + 5;

        progressHoder.position.y = sh/2 - 60;
    }
}


function sence1_start(){
    //////////
    trace("isAllowWin = " + isAllowWin);
    haveAPrize = isAllowWin;

    //
    TweenMax.to(sence1,.5,{alpha:1,ease:Sine.easeOut})
    setProgressBar(0,0);

    //
    var timeout;
    var itemArr = sence1.frutHolder.itemArr;
    var sc = 1/itemArr.length;
        for(var i=0; i<itemArr.length; i++){
            var item = itemArr[i];
                item.frutID = i;
                item.rotation = convertToRadian(45);
                item.scale.x = item.scale.y = 3;
                
                item.scale.x=item.scale.y=0;
                item.tween=TweenMax.from(item.scale,10,{x:5,y:5,ease:Linear.easeNone,repeat:-1});
               
                 var percent=(1/itemArr.length)*i;
                 item.tween.progress(percent);
               
        }

     requestAnimFrame(sence1_enterFrame);


    //
    sence1.interactive = true;
    sence1.mousedown = sence1.touchstart = function(data){
        clearTimeout(timeout);
        startGame();
    }

    timeout = setTimeout(function(){
        startGame();
    },3000)
}

function startGame(){
    var dur = .3;
    var itemArr = sence1.frutHolder.itemArr;
    
    sence1.interactive = false;
    sence1.removeChild(sence1.hit);

    for(var i=0; i<itemArr.length; i++){
        var item = itemArr[i];
            starDragItem(item);
    }

    with(sence1){
        TweenMax.to(intro.scale,dur,{x:0,y:0,ease:Back.easeIn,onComplete:function(){
            intro.parent.removeChild(intro);
        }});

        TweenMax.to(countDown,dur,{alpha:1,ease:Sine.easeOut,onComplete:function(){
            startCountDown();
        }});

        if(haveAPrize) TweenMax.to(progressHoder,dur,{alpha:1,ease:Sine.easeOut});
    }
}

function sence1_enterFrame(){

    if(isStop) return;
    //
    var itemArr = sence1.frutHolder.itemArr;
    var len = itemArr.length;
    var rota_sp = 0.005;
    var sc_sp = 0.002;

    for(var i=0; i<len; i++){
        var item = itemArr[i];
            if(i%2==0) item.rotation += rota_sp;
            else item.rotation -= rota_sp;
    }

  bubbleHolder_enterFrame();
  requestAnimFrame(sence1_enterFrame,100);
}



////////////////////////////////////////////
function createSence_0(){
    trace("createSence_0")

    with(container){

        sence0 = addContainer({id:"s0"});
        sence0.interactive = true;
        sence0.buttonMode = true;

        with(sence0){
            addRect("hit",sw,sh,"0xff0",0,0,0)
            addObject({id:"logo",url:"images/logo.png",scaleX:.5,scaleY:.5})
            addObject({id:"copy1",url:"images/copy1.png",scaleX:.5,scaleY:.5})
        }
    }//end with
}

function sence0_start(){
    var timeout;

    sence0.mousedown = sence0.touchstart = function(data){
        clearTimeout(timeout);
        gotoSence(sence0,sence1);
    }

    timeout = setTimeout(function(){
        gotoSence(sence0,sence1);
    },3000)
}


function createSence_0_resize(sw,sh){
    with(sence0){

        hit.width = sw;
        hit.height = sh;
        
        if(sw < sh){
            logo.scale.x = logo.scale.y = myRatio;
            copy1.scale.x = copy1.scale.y = myRatio;
        }

        logo.position.x = (sw - logo.width)/2;
        logo.position.y = 10;

        copy1.position.x = (sw - copy1.width)/2;
        copy1.position.y = (sh - copy1.height + logo.height)/2;
    }
}



///////////////////////////////////////////////////////////
function randomFn(item,flag){
    trace("random Bubble")

    item.active = true;
    item.sp_x = (Math.random() - Math.random())*2;
    item.sp_y = Math.random()*3 + 1;

    item.scale.x = item.scale.y = Math.random()*.5 + .5;
    item.initSC = item.scale.x;

    item.position.x = (Math.random() - Math.random())*sw/2;

    if(flag) item.position.y = sh/2 + Math.random()*sh;
    else item.position.y = sh/2 + item.height;
}

function creatFrut(target,name,url,total,r,sc,frutID){
    var item = target.addContainer({id:name});
        item.frutID = frutID;
        item.r = r;
    with(item){

        var rota = 2*Math.PI/total;
        var itemArr = [];

        for(var i=0; i<total; i++){
            var dx = Math.cos(i*rota)*r;
            var dy = Math.sin(i*rota)*r;

            var angle= Math.atan2(dy,dx)*180/Math.PI - 90;
            var radians = convertToRadian(angle);

            var circleFrut = addObject({id:"item"+i,regPerX:.5,regPerY:.5,url:url,rotation:radians,locationX:dx ,locationY:dy,scaleX:sc,scaleY:sc});
            itemArr.push(circleFrut);


        }

        item.itemArr = itemArr;
    }

    return item;
}


function resetFrutCircle(item){
    var itemArr = item.itemArr;
    var len = itemArr.length;

    trace("resetFrutCircle")

    item.isDrag = false;

     for(var i=0; i<len; i++){
            var item = itemArr[i];
                item.visible = true;

                if(!item.dragging)  backFn(item)
    }
}

function bubbleHolder_enterFrame(){
    var bubbleArr = sence1.bubbleHolder.bubbleArr;
    var len = bubbleArr.length;

    for(var i=0; i<len; i++){
        var item = bubbleArr[i];
            item.position.x += item.sp_x;
            item.position.y -= item.sp_y;

            item.scale.x = item.initSC + Math.sin(count_sc_eff) * 0.04;
            item.scale.y = item.initSC + Math.cos(count_sc_eff) * 0.04;

            if(item.position.x < -(sw/2 + item.width/2)||
               item.position.x > (sw/2 + item.width/2) ||
               item.position.y < -(sh/2 + item.height)){

                if(item.curFrut){
                    item.removeChild(item.curFrut);
                }

                randomFn(item,false);
            }
    }

    count_sc_eff +=0.1;
}


function checkHitBubble(target,flag,frutID){
    var bubbleArr = sence1.bubbleHolder.bubbleArr;
    var len = bubbleArr.length;
    var curItem = null;
    var curDis = 100000;
    for(var i=0; i<len; i++){
        var item = bubbleArr[i];
        var dis = distanceTwoPoints(item.position.x,target.position.x,item.position.y,target.position.y);

            if(item.active){
                if(dis < item.width/2){
                   if(curDis > dis){
                        curDis = dis;
                        curItem = item;
                    }
                }
            }
    }

    if(curItem != null){
        if(flag){
            curItem.active = false;
            addFrutToBubble(target,curItem,frutID);
        }
        return true;
    }

    return false;
}

function tweenFn(item,delay,dur,sc){
    TweenMax.to(item.scale,dur,{delay:delay,x:sc,y:sc,ease:Sine.easeOut})
}

function addFrutToBubble(frut,bubble,frutID){
    trace("add frut to bubble");
     var spr = new PIXI.Sprite(frut.generateTexture());
   
         spr.scale.x = spr.scale.y = (bubble.width/spr.width)*.6;
         spr.position.x = -spr.width/2;
         spr.position.y = -spr.height/2;

        sence1.small_bubble_group.visible = true;
    var smallBubble = new PIXI.Sprite(sence1.small_bubble_group.generateTexture());
        smallBubble.visible = false;
        
        smallBubble.anchor.set(0.5,0.5);

        sence1.small_bubble_group.visible = false;

    var breakArr = sence1.frutHolder.breakArr;
    var item = breakArr[frutID]

        bubble.addChild(item);
        item.anchor = new PIXI.Point(0.5, 0.5);;


        item.initSC = spr.scale.x/2;
        item.scale.x = item.scale.y = item.initSC;

        item.position.x = -item.width/2;
        item.position.y = -item.height/2;
        
        item.visible = false;

        bubble.addChild(spr);
        bubble.addChild(smallBubble);
        bubble.curFrut = spr;

        setTimeout(function(){
            item.visible = true;
            spr.visible = false;
            bubble.bitmap.visible = false;

            var delay = .1;
            var dur = .3;
            
            smallBubble.visible = true;
            smallBubble.scale.x = smallBubble.scale.y = .5;
            TweenMax.to(smallBubble.scale,dur,{delay:0,x:1,y:1,ease:Sine.easeIn,onComplete:function(){
                smallBubble.parent.removeChild(smallBubble);
            }})
            
            tweenFn(item,delay,dur,item.initSC*1.5);            

            TweenMax.to(bubble,dur,{delay:delay + .2,alpha:0,ease:Sine.easeIn,onComplete:function(){
                bubble.removeChild(item);
                bubble.bitmap.visible = true;
                bubble.alpha = 1;
                randomFn(bubble,false);
            }})

            backFn(frut);

         },300);

    //
    countFrut++;
    var per = (countFrut/(totalBottle*frutPerBottle));

    setProgressBar(per);
}

function setProgressBar(per,dur){
    var progress_bar = sence1.progressHoder.progress_bar;

    if(per<0) per = 0;
    if(per>1) per = 1;

    if(dur == undefined) dur = .3;
    TweenMax.to(progress_bar.scale,dur,{x:per,ease:Sine.easeOut});
}

function starDragItem(holder){
    var itemArr = holder.itemArr;
    var len = itemArr.length;

    for(var i=0; i<len; i++){
        var item = itemArr[i];
            item.holder = holder;
            startDrag(item);
    }
}


function startDrag(target){
    
    target.interactive = true;
    target.buttonMode = true;

    target.mousedown = target.touchstart = function(data){
        
        trace("touch start");

        data.originalEvent.preventDefault();

        var frutID = target.parent.frutID;

        ////////////////
        var checkHitHolder = sence1.checkHitHolder;
        var sc = target.holder.scale.x;
        var rota = target.holder.rotation;

        var r = 150;
        
        checkHitHolder.addChild(target);

        target.rotation = target.rotation - convertToRadian(-radianToDegree(rota));
        target.position.x = -(sw/2 - curMouseX);
        target.position.y = -(sh/2 - curMouseY);
        target.scale.x = target.scale.y = sc;
   
        target.data = data;
        
        var mousePos = target.data.getLocalPosition(target.parent);
        target.anchorX = mousePos.x;
        target.anchorY = mousePos.y;
        
        target.startX=target.position.x;
        target.startY=target.position.y;
        
        target.dragging = true;
        
        target.mousemove = target.touchmove = function(data){

            trace("touch move");

            if(target.dragging){

                var mousePos = target.data.getLocalPosition(target.parent);
                var dx=target.startX+(mousePos.x-target.anchorX);
                var dy=target.startY+(mousePos.y-target.anchorY);

                target.position.x=dx;
                target.position.y=dy;

                checkHitBubble(target,false,frutID);
            }
        }

        target.mouseup = target.mouseupoutside = target.touchend = target.touchendoutside = function(data){

            trace("touch end outside");

                var hit = checkHitBubble(target,true,frutID);
                if(!hit) backFn(target);
                else target.visible = false;
                
                target.dragging = false;
                target.data = null;
                target.mousemove = target.touchmove = null;
                target.mouseup = target.mouseupoutside = target.touchend = target.touchendoutside = null;
            };

        };  //end mousedown 

    }



function backFn(target){
    target.visible = true;
    target.holder.addChild(target);
    target.scale.x = target.scale.y = 0;
    target.rotation = target.initRota;
    TweenMax.to(target,0,{x:target.initX,y:target.initY,ease:Sine.easeOut});

    tweenFn(target,0,.3,1);
}


function stopDrag(target){
   target.interactive = false;
   target.buttonMode = false;
   target.mousedown = target.touchstart = null;
   target.mousemove = target.touchmove = null;
   target.mouseup = target.mouseupoutside = target.touchend = target.touchendoutside = null;
}



/////////////////////////////////////////////////////////////////////////////////////////////////////
function addToQueue(url){
    trace(url);
    assetsLoader.push(url);
}

function startLoadAssets(){
    count = 0;
    countAssetsLoaded = 0;
    curPer = 0;
    totalAssets = assetsLoader.length;

    loader = new PIXI.AssetLoader(assetsLoader);
    loader.onProgress = onProgress;
    loader.load();
    checkLoadingAssets();
}

function checkLoadingAssets(){
    var per = countAssetsLoaded/totalAssets;
    curPer += (per - curPer)/5;
    // trace("curPer =" + curPer)

    var h = $('#preloader .pr-bottle').height();
    $('#preloader .pr-bottle-grey').css('height',h - curPer*h);
    $('#preloader .pr-txt').css({'top':40 - curPer*(h-30),'font-size':(36 - curPer*20)});
    $('#preloader .pr-txt').text(Math.ceil(curPer*100) + "%");

    setTimeout(function(){
        if(curPer >=.99) loadComplete();
        else checkLoadingAssets();
    },100);
}

function onProgress(){
    countAssetsLoaded++;
}

function loadComplete(){
    trace("onAssetsLoadComplete");
    hidePreloader(0,1,true);
    animationIn();
    requestAnimFrame(enterFrameFn);
}

function enterFrameFn() {
    requestAnimFrame(enterFrameFn,1000);
    renderer.render(stage);
}

function fontLoaded(font, callback) {   
    var check = new PIXI.Text("giItT1WQy@!-/#", { font: "50px " + font});
    var width = check.width;
    var interval = setInterval(function() {         
        check.setStyle({ font: "50px " + font });
        check.updateText();
        
        if(check.width != width) {
            clearInterval(interval);
            check.destroy(true);
            callback();
        }
    }, 50);
}


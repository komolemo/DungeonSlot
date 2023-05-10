///////////////////////
////ゲーム画面を構成////
///////////////////////

setSlotPicImg();
setHeroImg();
setTileImg();

//スロットの画面上の座標を設定
document.getElementById("score").value = $gameSlot.allCoin;
const slotTop = parseInt(
    getComputedStyle(document.querySelector(".slot")).top
);

//スロットの初期表示
function setSlotPicImg() {
    //const clientWidth = document.documentElement.clientWidth;
    const elem_1 = document.getElementById("one");
    const elem_2 = document.getElementById("two");
    const elem_3 = document.getElementById("three");

    const url = "url(img/slots/01_Slot_1.png)";

    elem_1.style.backgroundImage = url;
    elem_1.style.backgroundSize = "100%";
    elem_2.style.backgroundImage = url;
    elem_2.style.backgroundSize = "100%";
    elem_3.style.backgroundImage = url;
    elem_3.style.backgroundSize = "100%";
};

//勇者のキャラグラ表示
function setHeroImg() {
    const elem = document.querySelector("#hero");
    elem.style.backgroundImage = "url(img/actors/01_actor.png)";
    elem.style.backgroundPosition = "-192px 0px";
};

//フィールドタイル表示
function setTileImg() {
    const elem_1 = document.querySelector("#fieldOne");
    const elem_2 = document.querySelector("#fieldTwo");

    elem_1.style.left = "50%";
    elem_1.style.transform = "translateX(-50%)";
    elem_1.style.backgroundImage = "url(img/tiles/tile.png)";
    //elem_1.style.backgroundPosition = "0px 0px";

    elem_2.style.left = "150%";
    elem_2.style.transform = "translateX(-50%)";
    //elem_2.style.backgroundImage = "url(img/tile.png)";
    //elem_2.style.backgroundPosition = "0px 0px";
};

/////////////////////////////////////
////キャラクター関連のアニメーション////
/////////////////////////////////////
window.$spriteChara = {};
$spriteChara = null;
$spriteChara = new Sprite_Character();

function Sprite_Character() {
};


//アクターのアニメーション

const durationWalkOnce = 150;
//const chara = "#hero";
Sprite_Character.prototype.animationOnce_loop = function(obj) {

    const positionX = - Math.floor(obj.animeId / 4) * 192;
    const positionY = - Math.floor(obj.animeId % 4) * 192;
    const positionAry = [`${positionX}px ${positionY}px`, `${positionX - 192}px ${positionY}px`, `${positionX - 384}px ${positionY}px`];

    const elemForLoopAnime = document.querySelector(obj.chara);

    let orderAry = [0, 1, 2, 1];
    if ($gameSlot.isEnemyExist === true) {
        orderAry = [0, 1, 2];
    };
    //Math.floor(-Math.cos((Math.PI / 2) * loop) + 1)
    //歩行アニメーションフレームの更新
    elemForLoopAnime.style.backgroundPosition = positionAry[orderAry[obj.loop % orderAry.length]];

    obj.loop += 1;
    if (obj.loop <= obj.loopMax) {
        setTimeout(() => {this.animationOnce_loop(obj)}, durationWalkOnce)
    } else {
        //立ち絵に戻す
        elemForLoopAnime.style.backgroundPosition = "-192px 0px";
    }
};

Sprite_Character.prototype.animationOnce = function(obj) {

    const positionX = - Math.floor(obj.animeId / 4) * 192;
    const positionY = - Math.floor(obj.animeId % 4) * 192;
    const positionAry = [`${positionX}px ${positionY}px`, `${positionX - 192}px ${positionY}px`, `${positionX - 384}px ${positionY}px`];

    const elemForAnime = document.querySelector(obj.chara);
    const orderAry = [0, 1, 2]
    //Math.floor(-Math.cos((Math.PI / 2) * loop) + 1)
    //歩行アニメーションフレームの更新
    elemForAnime.style.backgroundPosition = positionAry[orderAry[obj.loop % orderAry.length]];

    obj.loop += 1;
    if (obj.loop <= 3) {setTimeout(() => {this.animationOnce_loop(obj)}, durationWalkOnce)};
};

//敵のアニメーション
Sprite_Character.prototype.enemyAttackAnimation = function(obj) {
    //obj.loopMax / loopNumMod回アニメーションを行う
    const loopNumMod = 3;
    //敵の攻撃モーションは立ち絵をぴょこぴょこジャンプさせる
    const elemForEnemyAnime = document.querySelector(obj.chara);
    elemForEnemyAnime.animate(
        {
            top : ["96px", "72px", "96px"]
        },
        {
            iterations: 1,
            easing: "ease",
            duration: durationWalkOnce * loopNumMod,
        }    
    );


    obj.loop += 1;
    if (obj.loop <= obj.loopMax / loopNumMod) {
        setTimeout(() => {this.enemyAttackAnimation(obj)}, durationWalkOnce * loopNumMod)
    };
};

Sprite_Character.prototype.startWalkAnimation = function() {
    const obj = {
        chara:"#hero",
        animeId:0,
        loop:0,
        loopMax:25,
    }
    this.animationOnce_loop(obj);
    //フィールド
    document.querySelector("#fieldOne").animate(
        {
            backgroundPosition : "-744px -24px"
        },
        {
            iterations: 1,
            duration: durationWalkOnce * 24,
        }    
    );
};

Sprite_Character.prototype.startAttackAnimation = function() {
    const obj = {
        chara:"#hero",
        animeId:1,
        loop:0,
        loopMax:25,
    }
    this.animationOnce_loop(obj);
};

Sprite_Character.prototype.startEnemyAttackAnimation = function() {
    const obj = {
        chara:"#enemy",
        loop:0,
        loopMax:25,
    }
    this.enemyAttackAnimation(obj);
};

//敵出現
Sprite_Character.prototype.enemyArise = function(url) {

    const enemyImage = document.createElement("img");
    enemyImage.className = "character";
    enemyImage.id = "enemy";
    enemyImage.src = url;
    enemyImage.alt="Character"
    document.body.append(enemyImage);
};

//敵消滅
Sprite_Character.prototype.removeEnemy = function() {
    const elem = document.querySelector("#enemy");
    elem.remove();
};

//////////////////////////////////
////スロット関連のアニメーション////
//////////////////////////////////
window.$spriteSlot = {};
$spriteSlot = null;
$spriteSlot = new Sprite_Slot();

function Sprite_Slot() {
};

//スロットの画像配列を生成
const slotPicList = [
    "url(img/slots/01_Slot_1.png)", "url(img/slots/01_Slot_2.png)", 
    "url(img/slots/01_Slot_3.png)", "url(img/slots/01_Slot_4.png)", 
    "url(img/slots/01_Slot_5.png)", "url(img/slots/01_Slot_6.png)", 
    "url(img/slots/01_Slot_7.png)", "url(img/slots/01_Slot_8.png)"
];

//１つのスロットの１回転分の演出
const slotRotateTime = 125;
Sprite_Slot.prototype.slotRotate = function(obj) {
    const elem = document.querySelector(obj.tag);

    elem.style.backgroundImage = slotPicList[obj.index % 8];
    document.querySelector(obj.tag).animate(
        {
            height: ["0px", "128px", "0px"],
            top : [slotTop + 0  + "px", slotTop + 0 + "px", slotTop + 128 + "px"]
        },
        {
            iterations: 1,
            duration: 125,
            easing:"ease",
        }    
    );
    const newObj = obj;
    newObj.index += 1;
    if (newObj.index <= 8 * (obj.slotOrder - 0) + newObj.slotResult) {
        setTimeout(function() {$spriteSlot.slotRotate(newObj)}, slotRotateTime);
    };
};

//戦闘で勝利した場合、敵は消える
Sprite_Slot.prototype.enemyEliminated = function() {
    const elem = document.querySelector("#enemy");
    //次に敵を見えなくする
    elem.animate(
        {
            opacity: 0,
        },
        {
            fill: "forwards",
            duration: 200,
            easing:"ease-in",
        }
    );
    setTimeout(
        () => {
            $spriteChara.removeEnemy();
        }, 200
    );
};

//戦闘で勝利できなかった場合、敵は逃げる
Sprite_Slot.prototype.enemyRun = function() {
    const elem = document.querySelector("#enemy");
    //まず敵を反転
    elem.animate(
        {
            transform: ["scaleX(-1)", "scaleX(-1)", "scaleX(-1)", "scaleX(-1)", "scaleX(-1)", "scaleX(-1)", "scaleX(-1)"],
            top: ["96px", "72px", "96px", "72px", "96px", "72px", "96px"],
            left: "60%",
        },
        {
            fill: "forwards",
            duration: 500,
            easing:"ease-out",
        }
    );
    setTimeout(
        () => {
            $spriteChara.removeEnemy();
        }, 500
    )
};

//戦闘で勝利したとき、コインが散らばるアニメーション
Sprite_Slot.prototype.coinAnimation = function(coinNum) {
    for (let i = 1; i <= coinNum; i++) {
        this.showCoinImage(i);
    };
    for (let i = 1; i <= coinNum; i++) {
        this.scatteredCoin(i);
        setTimeout(()=>{this.removeCoin()}, 800)
    };
};

//コインを表示する
const coinId = ["coin_One", "coin_Two", "coin_Three", "coin_Four", "coin_Five"];
Sprite_Slot.prototype.showCoinImage = function(value) {

    const coinImage = document.createElement("img");
    coinImage.className = "coin";
    coinImage.id = coinId[value - 1];
    coinImage.src = "img/systems/02_coin.png";
    coinImage.alt="Coin"
    document.body.append(coinImage);
};

//コインが散らばるアニメーション
Sprite_Slot.prototype.scatteredCoin = function(value) {
    const elem = document.querySelector("#" + coinId[value - 1]);
    const sign = [1, -1];
    const range = 96 + (Math.random() * 72) * sign[Math.floor(Math.random() * 2)];
    elem.animate(
        {
            transform: ["translateX(96px)", `translateX(${range}px)`],
            top: ["144px", "96px", "144px"],
        },
        {
            fill: "forwards",
            duration: 800,
            easing:"ease",
        }
    );
};

//コインを消す
Sprite_Slot.prototype.removeCoin = function() {
    const elem = document.querySelector(".coin");
    elem.remove();
};


//戦闘結果を表示
Sprite_Slot.prototype.battleResultAnimation = function(result) {
    this.showBattleResult(result);
    setTimeout(()=>{this.removeBattleResult()}, 2000)
};

//戦闘結果を表示するアニメーション
Sprite_Slot.prototype.showBattleResult = function(result) {

    const resultImage = document.createElement("img");
    resultImage.className = "battleResult";
    result === true ? resultImage.id = "win" : resultImage.id = "lose";
    result === true ? resultImage.src = "img/systems/02_WIN.png" : resultImage.src = "img/systems/02_LOSE.png";
    resultImage.alt="result"
    document.body.append(resultImage);
};

//戦闘結果を消す
Sprite_Slot.prototype.removeBattleResult = function() {
    const elem = document.querySelector(".battleResult");
    elem.remove();
};

//コインが増加したときに獲得分を表示
Sprite_Slot.prototype.prizeAnimation = function(value) {
    this.showPrize(value);
    setTimeout(()=>{this.removePrize()}, 2000)
};
//獲得賞金表示
Sprite_Slot.prototype.showPrize = function(value) {
    const prizeText = document.createElement("div");
    prizeText.className = "prize";
    prizeText.textContent = `+${value}`;
    prizeText.dataset.text = `+${value}`;
    document.body.append(prizeText);

};

//賞金表示を消す
Sprite_Slot.prototype.removePrize = function() {
    const elem = document.querySelector(".prize");
    elem.remove();
};
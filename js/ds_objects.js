window.$gameSlot = {};
$gameSlot = null;
$gameSlot = new Game_Slot();

function Game_Slot() {
}

//格納する変数を設定
$gameSlot.chancePoint = 0;
$gameSlot.slotResultArray = new Array();

//スロットのコスト
$gameSlot.slotCost = 100;
//初期所持金
$gameSlot.allCoin = 8000;
//戦闘賞金倍率
$gameSlot.battlePrizeOdds = 5;

//チャンスポイント
$gameSlot.chancePoint = 0;
//ボーナスポイント
$gameSlot.bonusPoint = {
    red:0,
    orange:0,
    yellow:0,
    green:0,
    blue:0,
    indigo:0,
    violet:0
}

///////////////////////////
////---お金関係の処理---////
//////////////////////////
//スロットの費用を減らす
Game_Slot.prototype.consumeSlotCost = function() {
    this.allCoin -= this.slotCost;
    document.getElementById("score").value = this.allCoin;
};

//ゴールドの残額からスロットが起動できるか
Game_Slot.prototype.isSlotAvailable = function() {
    let bool = false;
    if (this.allCoin < this.slotCost) {
        bool = true;
    };
    return bool;
};

/////////////////////////////
////--スロット関係の処理---////
/////////////////////////////

////前処理/////
////前処理/////
const chanceReference = 30;
const bonusReference = 50;

Game_Slot.prototype.isChanceTime = function() {
    let result = false;
    if (this.chancePoint >= chanceReference) {
        result = true;
        this.chancePoint -= chanceReference;
    };
    return result;
};

Game_Slot.prototype.isBonusTime = function() {
    const colorAry = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'rainbow'];

    let result = false;
    for (let i = 1; i <= 7 && result != true; i++) {
        if (this.bonusPoint[colorAry[i-1]] >= bonusReference) {
            this.bonusPoint[colorAry[i-1]] -= bonusReference;          
            result = true;  
        }
    }
    return result;
};

////本処理/////
////本処理/////

//一回のスロットの数値関係の処理
Game_Slot.prototype.dataProcess = function() {
    //スロット結果の生成  
    this.slotResultArray = this.makeSlotResult(this.isBonusTime(), this.isChanceTime());
    const slotResultArray = this.slotResultArray;
    //スロットがアタリかどうか
    this.isLastSlotWin = this.isSlotWin(slotResultArray);
    //「チャンスポイント」の処理
    this.storeChancePt(slotResultArray);
};

//スロット結果の生成
Game_Slot.prototype.makeSlotResult = function(bool1, bool2) {
    const colorAry = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'rainbow'];
    const slotResultAry = new Array();
    for (let i = 1; i <= 3 ; i++) {
        const index = Math.floor(Math.random() * 8);
        const obj = {
            id:index,
            color:colorAry[index]
        };
        slotResultAry[i-1] = obj
    };

    ///////////////////////////////////////////////////
    //２つ目の結果はチャンスタイムまたは確変時に操作を行う//
    ///////////////////////////////////////////////////

    if (bool1) {
        //乱数生成
        let random = Math.random() * 100 + 1
        //チャンスタイム時は確定で確率変動
        if (bool2 === true) {
            random = 0;
        };

        //確率を変動するか判定
        if (50 >= random) {
            slotResultAry[1] = slotResultAry[0];
        };
    };

    //スロット結果を返す
    return slotResultAry;
};

////後処理/////
////後処理/////

//回転終了時の数値関係の処理全部
Game_Slot.prototype.everyTurnEnd = function() {
    //賞金
    this.lastLotPrize = 0
    const ary = $gameSlot.slotResultArray;
    if (this.isSlotWin(ary) === true) {
        //当たっていたら賞金を取得して所持金を増加
        this.allCoin += this.payBackMoney(ary[0].id);
        this.lastLotPrize = this.payBackMoney(ary[0].id);
    };

    //スペシャルスロットに関する処理
    this.storeChancePt(ary);
    //ボーナスポイントの処理
    this.storeBonusPt(ary);
};

//スロットがアタリかどうか
Game_Slot.prototype.isSlotWin = function(array) {
    let isSlotWin = false;
    if (array[0].id === array[1].id && array[0].id === array[2].id) {
        //当たり
        isSlotWin = true;
    }
    return isSlotWin;
};

//当たった時に賞金分増加する
Game_Slot.prototype.payBackMoney = function(value) {
    const odds = [20, 50, 100, 200, 500, 1000, 2000, 5000];
    return odds[value] * this.slotCost;
};

//スロットで絵柄「スペシャルスライム」が出たら、「チャンスポイント」をためる
Game_Slot.prototype.storeChancePt = function(array) {
    for (let i = 1; i <= array.length; i++) {
        if (array[i-1].id === 7) {
            this.chancePoint += 1;
        };
    };
};

//スロットで絵柄ごとにボーナスポイントをためる
Game_Slot.prototype.storeBonusPt = function(array) {
    for (let i = 1; i <= 3; i++) {
        if (array[i-1].id < 7) {
            this.bonusPoint[array[i-1].color] += 1;
        };
    };
};

//////////////////
////---戦闘---////
//////////////////

//エンカウント判定
Game_Slot.prototype.isEncount = function() {
    const random = Math.floor(Math.random() * 100 + 1)

    let result = false;
    if (random <= 50) {
        result = true;
    };
    this.isEnemyExist = result;
    return result;
};

//戦闘判定
Game_Slot.prototype.isBattleWin = function() {
    const ary = this.slotResultArray;
    let damage = 0
    for (let i = 1; i <= 3; i++) {
        damage += ary[i-1].id + 1;
    };

    let isWin = false;
    console.log(damage)
    damage > 12 ? isWin = true : isWin = false;
    return isWin;
};

//戦闘で勝利したら所持金を増加
Game_Slot.prototype.payBattlePrize = function() {
    this.allCoin += this.slotCost * this.battlePrizeOdds;
    this.lastBattlePrize = this.slotCost * this.battlePrizeOdds;
};
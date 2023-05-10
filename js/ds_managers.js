window.$manageSlot = {};
$manageSlot = null;
$manageSlot = new Manage_Slot();

function Manage_Slot() {
}

//ぞれぞれのスロットの回転のスタートにかけるディレイ
const startDelay = 100;

//スロットボタンが押された時の処理
Manage_Slot.prototype.slotStart = function() {
    //お金関係の処理
    $gameSlot.consumeSlotCost()
    //スロットを起動
    this.slotRotateStart();
    //歩行アニメーション
    this.charaAnimeStart();
};

//歩行・攻撃アニメーション
Manage_Slot.prototype.charaAnimeStart = function() {
    console.log($gameSlot.isEnemyExist);
    if ($gameSlot.isEnemyExist != true) {
        //歩行アニメーション
        $spriteChara.startWalkAnimation();
    } else {
        //攻撃アニメーション
        $spriteChara.startAttackAnimation();
        setTimeout(() => {$spriteChara.startEnemyAttackAnimation()}, 100); //敵アニメーションの開始をちょっと遅らせて違和感を減らす
    };
};

//スロットを回す
Manage_Slot.prototype.slotRotateStart = function() {
    //結果を先に生成
    $gameSlot.dataProcess();
    const slotResult = $gameSlot.slotResultArray;
    //スロット回転アニメ
    const tagAry = ["#one", "#two", "#three"];
    $gameSlot.slotData = [];
    for (let i = 1 ; i <= 3 ; i++) {
        //引数オブジェクトの生成
        let obj = {tag:tagAry[i-1], index:0, slotResult:slotResult[i-1].id, slotOrder:i};
        //データ収集用
        $gameSlot.slotData[i-1] = obj;
        //スロットを0.1秒ごとに順番に起動
        setTimeout(function() {$spriteSlot.slotRotate(obj)}, startDelay * (i-1) );
    };
};

//スロット処理終了時の処理
Manage_Slot.prototype.everyRotateEnd = function() {
    //戦闘結果処理
    if ($gameSlot.isEnemyExist === true) {
        //戦闘結果表示アニメ
        $spriteSlot.battleResultAnimation($gameSlot.isBattleWin());
        if ($gameSlot.isBattleWin() === true) {
            //戦闘賞金獲得
            $gameSlot.payBattlePrize();
            //勝利の場合、敵消滅アニメ
            $spriteSlot.enemyEliminated();
            //コインが散らばるアニメ
            $spriteSlot.coinAnimation(5);
            //獲得賞金表示アニメ
            $spriteSlot.prizeAnimation($gameSlot.lastBattlePrize);
        } else {
            //敗北の場合、敵逃走アニメ
            $spriteSlot.enemyRun();
        };
    };
    //賞金・ボーナスポイント
    $gameSlot.everyTurnEnd();
    //獲得賞金表示アニメ
    if ($gameSlot.lastLotPrize > 0) {
        $spriteSlot.prizeAnimation($gameSlot.lastLotPrize);
    }
    //エンカウント(２連でエンカウントすることはない)
    if ($gameSlot.isEnemyExist === true) {
        $gameSlot.isEnemyExist = false;
    } else {
        this.encount();
    }

};

//エンカウント
Manage_Slot.prototype.encount = function() {
    if ($gameSlot.isEncount()) {
        //敵を表示
        $spriteChara.enemyArise("img/enemies/Goblin.png");
    };
};
//スロットボタンを押したときに起動
document.querySelector(".slotButton").addEventListener("click", function() {
    //一旦スロットを回せなくする
    const button = document.querySelector(".slotButton");
    button.disabled = true;
    //スロット起動
    $manageSlot.slotStart();
    //スロット処理終了後の処理    
    setTimeout(
        () => {
            //エンカウント
            $manageSlot.everyRotateEnd();
            //ボタン有効化or無効化
            button.disabled = $gameSlot.isSlotAvailable();
        }, 300 + (8 * 3 + $gameSlot.slotData[2].slotResult + 3) * 125)//+3はfor文のよくわからない仕様のための補正
    }
);
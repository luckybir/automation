console.show();
console.clear();
console.hide();
auto.waitFor();

let height = device.height;
let width = device.width;

launchApp("京东");

// let title = textContains("在当前页").findOnce();
// log(title.parent().bounds());

// let coins = textContains("北京").find();

// log(coins[0].parent().parent().childCount());

// log(coins[0].parent().parent().child(1).childCount());

// for(i=0;i<3;i++){
//     log(coins[0].parent().parent().child(3).child(i).childCount());
// }

// log(coins[4].parent().parent().child(4));
// coins[0].parent().parent().child(4).click();
// log(coins[2].parent().parent().boundsInParent());

// if (coins[5].parent().parent().bounds().bottom == height) {
//   log("swipe");
//   log(height);
//   log(height - 235);
//   swipe(width / 2, coins[5].parent().parent().bounds().top , width / 2, 532 , 1000);
// }

// log(width);
// 版图

// for(i=0;i<s.length;i++){
//     log("i"+i+":"+s[i].bounds())
// }

// log(s[0]);
// s[2].click();

// let s = text("关闭").findOnce();
// log(s);
// click("领金币",0);
// let t = tex
// let t = text("领金币").find();
// let t = t1[0].parent().parent().parent();

// log(t.length);
// log(t)
// log(t.childCount())
// log(t.child(0))
// log(t.child(1))
// log(t.child(2))

// for (i = 0; i < t.length; i++) {
//   log(t[i]);
// }

// t.child(2).click()

// t[0].click()
// log(textContains("领金币").clickable(true).find().length);
// text("领金币").findOnce().click();
// log(text("宝箱随机藏在以下店铺内，去找找吧～").find().length)
// click("领金币")
let t = className("android.view.View").find()
log(t.length)
for (i = 0; i < t.length; i++) {
    if (t[i].text() != "" && t[i].text() != undefined){
  log(t[i].text());
    }
}
exit();

var i = 0;
var taskList = ["去浏览", "去搜索", "去逛逛", "去完成"];
var height = device.height;
var width = device.width;

let taobaoTaskFinish = false;
let taskText = "string";
let speed = 1;

function delay(seconds) {
  let randomSeconds = seconds * speed * 1000 + random(100, 500);
  sleep(randomSeconds);
}

setScreenMetrics(width, height);

dialogs.alert("请确认无障碍和悬浮窗权限已开启");
menu: while (true) {
  var choose = dialogs.select(
    "选择脚本速度",
    "手机网速快",
    "手机网速一般",
    "手机网速较慢"
  );
  switch (choose) {
    case -1:
      toast("请选择");
      continue menu;
    case 0:
      toast("手机网速快");
      speed = 1;
      break menu;
    case 1:
      toast("手机网速一般");
      speed = 1.5;
      break menu;
    case 2:
      toast("手机网速较慢");
      speed = 2;
      break menu;

    default:
      break;
  }
}

let patCatTimes = rawInput("输入拍猫次数（输入100的倍数）");

console.show();
auto.waitFor();

delay(1);

log("正在打开淘宝");
launch("com.taobao.taobao");
delay(1);
log("正在等待进入吸猫活动页面");
log("请手动进入活动页面");

className("android.widget.Button").text("赚喵币").waitFor();
delay(1);
if (!textContains("累计任务奖励").exists()) {
  className("android.widget.Button").text("赚喵币").findOne().click();
  log("进入活动成功");
}

delay(1.5);
if (className("android.widget.Button").text("签到").exists()) {
  className("android.widget.Button").text("签到").click();
  delay(1);
  log("签到成功");
}
delay(1.5);

taskList.forEach((task) => {
  while (textContains(task).exists()) {
    if (taobaoTaskFinish === true) {
      break;
    }

    i++;

    switch (task) {
      case ("去浏览", "去搜索", "去逛逛"):
        taskText = text(task).findOnce().parent().child(0).child(0).text();
        log("开始做 " + taskText);
        delay(0.5);

        click(task, 0);
        delay(1.5);
        if (
          !textContains("跟主播聊").exists() ||
          !textContains("赚金币").exists()
        ) {
          swipe(width / 2, height - 500, width / 2, 0, 800 * speed);
          delay(3.5);
          swipe(width / 2, height - 500, width / 2, 0, 800 * speed);
          delay(12);
          swipe(width / 2, height - 500, width / 2, 0, 800 * speed);
        } else {
          delay(15);
        }
        // textContains("任务完成").findOne(10000 * speed);
        log("已完成第" + i + "次任务！");
        back();
        break;

      case "去完成":
        //第一个任务是邀请好友，一直做到出现登陆淘宝特价版为止
        let selectTask = text("去完成").findOnce(1);

        taskText = selectTask.parent().child(0).child(0).text();
        let reg = /登录淘宝特价版送红包.*/g;
        if ((taskText.match(reg).length = 1)) {
          taobaoTaskFinish = true;
          break;
        }

        log("开始做" + taskText);

        click("去完成", 1);
        delay(1.5);

        swipe(width / 2, height - 500, width / 2, 0, 800 * speed);
        delay(15);
        swipe(width / 2, height - 500, width / 2, 0, 800 * speed);
        // textContains("任务完成").findOne(10000 * speed);

        log("已完成第" + i + "次任务！");
        back();
        break;
      default:
        break;
    }
    sleep(2000 * speed);
  }
});

// 最后签到
while (textContains("领取奖励").exists()) {
  log("领取奖励");
  click("领取奖励", 0);
  delay(1.5);
}

console.log("浏览任务已经完成");
indexInParent(0).text("关闭").findOne().click();
delay(1);
console.log("开始升级");
var merge = textContains("喂猫升级").findOne();
while (true) {
  merge.click();
  delay(1);
  var receive = textContains("开心收下").findOnce();
  if (receive) {
    receive.click();
  }
  var non_enough = text("哎哟，喵币不足啦").findOnce();
  if (non_enough) {
    indexInParent(3).text("关闭").findOne().click();
    break;
  }
  var decoration = text("领取成就勋章").findOnce();
  if (decoration) {
    indexInParent(4).text("关闭").findOne().click();
    break;
  }
}
console.log("执行完毕，开始拍猫");

while (patCatTimes--) {
  text("我的猫，点击撸猫").findOne().click();
  delay(0.2);
}

log("Done!");
exit();

let speed = 1.5;
let height = device.height;
let width = device.width;
let taskFinish = false;
let taskNum = 0;
let startCoins = 0;

autoStart();
selectTask();
autoEnd();

function autoStart() {
  console.show();
  auto.waitFor();
}

function selectTask() {
  // let taskList = ["淘宝","支付宝"]
  // let options = dialogs.multiChoice("执行的任务", taskList);
  // log(options);

  // if (options == '') {
  //   return;
  // }

  // options.forEach((option) => {
  //   switch (option) {
  //     case 0:
  //       taobaoAuto();
  //       break;
  //     case 1:
  //       // zhifubaoAuto();
  //       break;
  //     default:
  //       break;
  //   }
  // });

  jdAuto();
}

function autoEnd() {
  // delay(10);
  console.hide();
  exit();
}

function jdAuto() {
  launchApp("京东");

  text("去完成").waitFor();

  let task = text("去完成").findOnce(3);

  // if (task) {
  log(task.parent().childCount());

  for (let i = 0; i < task.parent().childCount(); i++) {
    if ((i + 1) % 4 == 0) {
      let taskStatus = task.parent().child(i).text();
      log(i + ": " + taskStatus);

      while (taskStatus == "去完成") {
        delay(3);

        let taskSubTitle = task
          .parent()
          .child(i - 2)
          .text();

        log(taskSubTitle);

        let taskTitle = task
          .parent()
          .child(i - 1)
          .text();

        log(taskTitle);

        switch (taskTitle) {
          case "逛店8秒并关注可得8000金币":
          case "浏览8秒可得5000金币":
          case "浏览8秒可得7000金币":
          case "浏览8秒可得10000金币":
            click(taskStatus, 0);
            delay(10);

            // textContains("获得").waitFor();
            back();

            break;

          // case "浏览可得2000金币":
          //   click(taskStatus, 0);
          //   delay(8);
          //   back();
          //   break;

          // case "每邀1个好友可得10000金币":
          // case "成功浏览5个商品可得8000金币":

          //   break;

          default:
            taskStatus = "已完成";
            break;
        }
      }
    }
  }
  // }

  // while (taskFinish) {
  //   delay(2);

  //   task = text("去完成").findOnce(k);
  //   if (!task) {
  //     taskFinish = true;
  //   }

  //   let taskTitle = task.parent().child(1);
  //   switch (taskTitle) {
  //     case "浏览8秒可得7000金币":
  //     case "浏览可得2000金币":
  //       click(taskTitle, 0);
  //       delay(8);
  //       back();

  //       break;

  //     case "每邀请1个好友可得10000金币":
  //     case "成功浏览5个商品可得8000金币":
  //       k++;
  //       break;

  //     default:
  //       break;
  //   }
  // }
}

function taobaoAuto() {
  launch("com.taobao.taobao");
  log("正在打开淘宝，等待进入吸猫活动页面");
  delay(3);

  taskFinish = false;
  taskNum = 0;
  startCoins = 0;

  checkTask();
  finishTask();

  log("浏览任务已经完成,执行完毕");
}

function getCoins() {
  textContains("我的喵币").waitFor();

  delay(4);
  let coinsText = textContains("我的喵币").findOnce().text();
  delay(2);

  let reg = /\d+/g;
  let coins = coinsText.match(reg)[0];
  return coins;
}

function checkTask() {
  log("检查获取喵币是否正常");
  startCoins = getCoins();
  log("当前喵币" + startCoins);

  clickTasksMenu();
  clickTasks();
  closeTaskMenu();
  let checkCoins = getCoins();

  if (taskNum != 0 && checkCoins - startCoins < 10000) {
    log("获取喵币异常");
    taskFinish = true;
  } else {
    log("获取喵币正常");
  }
}

function finishTask() {
  if (taskFinish == true) {
    return;
  }

  clickTasksMenu();

  while (taskFinish == false) {
    clickTasks();
  }

  closeTaskMenu();

  let endCoins = getCoins();
  log("当前喵币" + endCoins);

  endCoins = endCoins - startCoins;
  log("共执行" + taskNum + "次获得" + endCoins + "喵币");
}

function clickTasksMenu() {
  text("赚喵币").findOne().click();
  delay(2.5);
}

function closeTaskMenu() {
  indexInParent(0).text("关闭").findOne().click();
  delay(2);
}

function clickTasks() {
  let taskText = "string";
  let reg = "string";

  delay(2);

  if (textContains("去浏览").exists()) {
    taskText = text("去浏览").findOnce().parent().child(0).child(0).text();

    log(taskText);
    click("去浏览", 0);
    delay(3);

    reg = /观看.*/g;
    if (taskText.match(reg) != null) {
      log("跳过观看任务");
    } else {
      delay(2);
      swipeRandom();
      delay(14);
      swipeRandom();
      log("已完成");
      taskNum++;
    }

    back();

    return;
  }

  // 去完成，找其它任务的开始位置
  let k = 0;
  for (;;) {
    let selectTask = text("去完成").findOnce(k);
    if (selectTask) {
      taskText = selectTask.parent().child(0).child(0).text();

      reg = /(邀请好友一起撸猫|参与组队领红包|登录淘宝特价版送红包).*/g;
      if (taskText.match(reg) != null) {
        // log("跳过" + taskText);
        k++;
        continue;
      }

      log(taskText);
      break;
    } else {
      k = -1;
      break;
    }
  }

  if (k != -1) {
    click("去完成", k);
    delay(1.5);
    swipe(width / 2, height - 500, width / 2, 0, 800 * speed);
    delay(15);
    swipe(width / 2, height - 500, width / 2, 0, 800 * speed);

    log("已完成");

    back();
    taskNum++;
    return;
  } else {
    taskFinish = true;
  }
}

function swipeRandom() {
  swipe(width / 2, height - 500, width / 2, 0, 1000);
}

function delay(seconds) {
  let randomSeconds = seconds * speed * 1000 + random(100, 500);
  sleep(randomSeconds);
}

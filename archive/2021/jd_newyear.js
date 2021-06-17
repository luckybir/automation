let speed = 1.5;
let height = device.height;
let width = device.width;
let taskFinish = false;

autoStart();
selectTask();
autoEnd();

function autoStart() {
  auto.waitFor();
}

function selectTask() {
  console.show();
  log("github.com/luckybir/automation");
  log("特别声明");
  log("仅用于测试和学习研究，禁止用于商业用途，请匆转发并于下载后24小时内删除");
  delay(2);
  jdAuto();
}

function autoEnd() {
  log("job end");
  delay(5);
  console.hide();
  exit();
}

function jdAuto() {
  launchApp("京东");

  log("wait for clicking 集爆竹");
  textContains("邀请好友助力").waitFor();
  delay(2);

  let lastTaskSubTitle = "";
  let lastTaskProcess = "";
  let browse8sCumculateSeconds = 15;

  while (!taskFinish) {
    delay(2);

    let taskList = text("去完成").find();
    if (taskList.length == undefined || taskList.length == 0) {
      log("no valid task");
      taskFinish = true;
    } else {
      log("tasks no:" + taskList.length);
    }

    delay(1);

    for (let i = 0; i < taskList.length; i++) {
      let taskTriggle = false;

      let taskParent = taskList[i].parent();

      // get task title
      let childCount = taskParent.childCount();
      let taskTitle = taskParent.child(childCount - 3).text();
      let taskSubTitle = taskParent.child(childCount - 2).text();
      let button = taskParent.child(childCount - 1);

      let taskCategory = getTaskCategory(taskTitle, taskSubTitle);
      let taskProcess = getTasProcess(taskTitle);

      switch (taskCategory) {
        case "browse8s":
          log(taskTitle);
          log(taskSubTitle);

          taskTriggle = true;
          clickButton(button);

          if (
            lastTaskSubTitle != taskSubTitle ||
            taskProcess != lastTaskProcess
          ) {
            browse8sCumculateSeconds = 15;
          } else {
            browse8sCumculateSeconds = browse8sCumculateSeconds + 15;
          }

          log("wait " + browse8sCumculateSeconds + "s");

          delay(browse8sCumculateSeconds);

          log("back to task list");
          while (!textContains("邀请好友助力").exists()) {
            back();
            delay(2);

            //sometimes when click back popup a confirm dialog
            if (text("下次再来哦").exists()) {
              click("下次再来哦");
              delay(2);
            }
          }

          delay(4);

          lastTaskSubTitle = taskSubTitle;
          lastTaskProcess = getTasProcess(taskTitle);
          break;

        case "cartGoods":
          log(taskTitle);
          log(taskSubTitle);

          taskTriggle = true;
          clickButton(button);

          textContains("当前页").waitFor();
          console.hide();
          delay(2);

          coins = textContains("¥").find();
          // log(coins.length);

          let cartGoodsTimes = 0;

          for (let j = 0; j < coins.length; j++) {
            //向上划一下来点屏幕，再点回第一个元素的位置
            if (j % 2 == 0 && j > 1) {
              // 获取第一个和第三个元素的坐标
              let good1 = coins[j - 2].parent().parent().child(0);
              let good3 = coins[j].parent().parent().child(0);

              // log("swipe");

              swipe(
                width / 2,
                good3.bounds().top,
                width / 2,
                good1.bounds().top,
                1000
              );
              delay(2);

              // 刷新位置
              coins = textContains("¥").find();
            }

            if (coins[j].parent().parent().child(0).text() != "已加购") {
              // log(j);
              delay(2);

              cartGoodsTimes++;
              coins[j].parent().parent().child(4).click();

              delay(2);
              back();
              delay(2);

              if (cartGoodsTimes == 5) {
                break;
              }
            }
          }

          console.show();
          log("back to task list");
          back();
          delay(5);
          break;

        default:
      }

      if (taskTriggle) {
        break;
      } else {
        if (i == taskList.length - 1) {
          taskFinish = true;
        }
      }
    }
  }
}

function getTaskCategory(taskTitle, taskSubTitle) {
  let taskCategory = "";
  let regTaskTitle = /^去小程序领更多/g;
  let regTaskSubTitle = /^(浏览|逛店)(\d+秒)?(并关注)?(频道)?可得\d+/g;

  if (!regTaskTitle.test(taskTitle) && regTaskSubTitle.test(taskSubTitle)) {
    taskCategory = "browse8s";
    return taskCategory;
  }

  regTaskSubTitle = /^浏览(\d+秒)?可得\d+/g;
  if (regTaskSubTitle.test(taskSubTitle)) {
    taskCategory = "browse8s";
    return taskCategory;
  }

  regTaskSubTitle = /^成功浏览\d+个商品/g;
  if (regTaskSubTitle.test(taskSubTitle)) {
    taskCategory = "browseGoods";
    return taskCategory;
  }

  regTaskSubTitle = /^浏览并加购\d+个商品可得/g;
  if (regTaskSubTitle.test(taskSubTitle)) {
    taskCategory = "cartGoods";
    return taskCategory;
  }

  return taskCategory;
}

function getTasProcess(taskTitle) {
  let regTaskTitle = /\(\d+\/\d+\)$/g;
  let taskProcess = "";

  if (regTaskTitle.test(taskTitle)) {
    taskProcess = taskTitle.match(regTaskTitle)[0];
    return taskProcess;
  }
}

function clickButton(button) {
  let bounds = button.bounds();
  let width = bounds.right - bounds.left;
  let high = bounds.bottom - bounds.top;

  let x = random(bounds.left + width / 4, bounds.right - width / 4);
  let y = random(bounds.top + high / 3, bounds.bottom - high / 3);
  let t = random(50, 100);

  // log("b:" + bounds);
  // log("w:" + width);
  // log("h:" + high);
  // log("x:" + x);
  // log("y:" + y);
  // log("t:" + t);

  press(x, y, t);
}

function swipeRandom() {
  swipe(width / 2, height - 500, width / 2, 0, 1000);
}

function delay(seconds) {
  let randomSeconds = seconds * speed * 1000 + random(100, 500);
  sleep(randomSeconds);
}

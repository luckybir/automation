let speed = 1.25;
let height = device.height;
let width = device.width;
let taskFinish = false;
let checkCoinTrigger = 0;

autoStart();
selectTask();
autoEnd();

function autoStart() {
  auto.waitFor();
  // threads.start(registerKey);
}

function selectTask() {
  console.show();
  log("特别声明");
  log("仅用于测试和学习研究，禁止用于商业用途，请匆转发并于下载后24小时内删除");
  delay(2);
  jdAuto();
}

function autoEnd() {
  log("job end");
  // delay(5);
  // console.hide();
  // console.clear();
  exit();
}

function jdAuto() {
  launchApp("京东");

  goToTaskListMenu();

  log("start task in 4s");
  // textContains("邀请好友助力").waitFor();
  delay(4);

  let lastTaskSubTitle = "";
  let lastTaskProcess = "";
  let browse8sCumculateSeconds = 15;

  // check task
  while (!taskFinish) {
    delay(2);

    // 因为更新导致去完成的描述没有了，只有图片，所以根据任务描述）去找
    let taskList = textContains(")").find();

    if (taskList.length == undefined || taskList.length == 0) {
      log("no valid task");
      taskFinish = true;
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
      // log(taskCategory);

      if (checkCurrentTaskFinish(taskTitle) == false) {

        switch (taskCategory) {
          case "browse8s":
            log(taskTitle);
            // log(taskSubTitle);

            taskTriggle = true;
            clickButton(button);

            //if new task reset time, if not cumculate time
            if (
              lastTaskSubTitle != taskSubTitle ||
              taskProcess != lastTaskProcess
            ) {
              browse8sCumculateSeconds = 15;
            } else {
              browse8sCumculateSeconds = browse8sCumculateSeconds + 15;
            }

            // log("wait " + browse8sCumculateSeconds + "s");

            delay(browse8sCumculateSeconds);

            goToTaskListMenu();

            delay(4);

            lastTaskSubTitle = taskSubTitle;
            lastTaskProcess = getTasProcess(taskTitle);
            break;

          case "cartGoods":
            log(taskTitle);
            // log(taskSubTitle);

            taskTriggle = true;
            clickButton(button);

            textContains("当前页").waitFor();
            console.hide();
            delay(2);

            coins = textContains("¥").find();
            // log(coins.length);

            let cartGoodsTimes = 0;

            for (let j = 0; j < coins.length; j++) {
              // //向上划一下来点屏幕，再点回第一个元素的位置
              // if (j % 2 == 0 && j > 1) {
              //   // 获取第一个和第三个元素的坐标
              //   let good1 = coins[j - 2].parent().parent().child(0);
              //   let good3 = coins[j].parent().parent().child(0);

              //   log("swipe");

              //   swipe(
              //     width / 2,
              //     good3.bounds().top,
              //     width / 2,
              //     good1.bounds().top,
              //     1000
              //   );
              //   delay(2);

              //   // 刷新位置
              //   coins = textContains("¥").find();
              // }

              if (coins[j].parent().child(0).text() != "已完成") {
                // log(j);
                delay(2);

                cartGoodsTimes++;
                coins[j].parent().child(5).click();

                delay(2);
                back();
                delay(2);

                if (cartGoodsTimes == 5) {
                  break;
                }
              }
            }

            console.show();

            goToTaskListMenu();
            break;

          case "member":
            log(taskTitle);
            taskTriggle = true;
            clickButton(button);

            delay(4);

            if (textContains("确认授权即同意").exists()) {
              let agree = textContains("确认授权即同意").findOnce().parent().child(0).bounds();
              click(agree.centerX(), agree.centerY());

              delay(1);

              let confirm = textContains("确认授权并加入").findOnce().bounds();
              click(confirm.centerX(), confirm.centerY());
              delay(4);
            }


            goToTaskListMenu();

            break;

          case "wanderShop":
            log(taskTitle);

            taskTriggle = true;
            clickButton(button);

            delay(5);

            for (i = 0; i < 5; i++) {
              let shop = textContains('jpg!q70').findOnce();
              shop.parent().parent().click();
              delay(4);
              back();
              delay(4);
            }

            goToTaskListMenu();

            break;

          case "playCity":
            log(taskTitle);

            taskTriggle = true;
            clickButton(button);

            delay(5);

            // click confirm
            if (text("天天都能领").exists()) {
              text("天天都能领").findOnce().parent().child(3).click();
            }

            // click 
            if (text("邀请新朋友 更快赚现金").exists()) {
              text("邀请新朋友 更快赚现金").findOnce().parent().child(1).click();
            }

            // click 邀2人立领现金
            if (text("624393fabf2293cb").exists()) {
              text("624393fabf2293cb").findOnce().parent().click();
            }


            delay(2);

            goToTaskListMenu();

            break;

          case "clickOnce":
            log(taskTitle);
            clickButton(button);
            delay(5);
            goToTaskListMenu();

            break;

          case "bandWall":
            log(taskTitle);

            clickButton(button);
            delay(2);

            let wallList = text("到底了，没有更多了～").findOnce().parent().child(17).child(1);

            for (i = 0; i < 3; i++) {
              wallList.child(i).click();
              delay(5);
              back();
              delay(2);
            }

            // need to go to the first page
            back();
            back();
            delay(6);
            goToTaskListMenu();
            break;

          default:
        }
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

  // click 当前进度
  // finalHarvest();
}

function getTaskCategory(taskTitle, taskSubTitle) {
  let taskCategory = "";

  let regTaskTitle = /^initial/g;
  let regTaskSubTitle = /initial/g;

  // 去种草 is special, click and then click 5 shops
  regTaskTitle = /^去种草/g;
  if (regTaskTitle.test(taskTitle)) {
    taskCategory = "wanderShop";
    return taskCategory;
  }

  // 去玩城城分千元现金 is special, click special button
  regTaskTitle = /^去玩城城分千元现金/g;
  if (regTaskTitle.test(taskTitle)) {
    taskCategory = "playCity";
    return taskCategory;
  }

  // 去首页浮层进入活动 only click one time 
  regTaskTitle = /^去首页浮层进入活动/g;
  if (regTaskTitle.test(taskTitle)) {
    taskCategory = "clickOnce";
    return taskCategory;
  }

  //去首页品牌墙 only click one time
  regTaskTitle = /^去首页品牌墙/g;
  if (regTaskTitle.test(taskTitle)) {
    taskCategory = "bandWall";
    return taskCategory;
  }

  regTaskTitle = /^去组队竞猜赢大奖/g;
  if (regTaskTitle.test(taskTitle)) {
    taskCategory = "browse8s";
    return taskCategory;
  }

  regTaskTitle = /^去逛京东plus会员店/g;
  regTaskSubTitle = /^(浏览|参与|逛店)(并关注)?(\d+(秒|s))?可得\d+/g;
  if (regTaskSubTitle.test(taskSubTitle) && !regTaskTitle.test(taskTitle)) {
    taskCategory = "browse8s";
    return taskCategory;
  }

  regTaskSubTitle = /^累计浏览(并加购)?\d+个商品可得/g;
  if (regTaskSubTitle.test(taskSubTitle)) {
    taskCategory = "cartGoods";
    return taskCategory;
  }

  regTaskSubTitle = /^成功入会并浏览可得\d+/g;
  if (regTaskSubTitle.test(taskSubTitle)) {
    taskCategory = "member";
    return taskCategory;
  }


  return taskCategory;
}

// determine task is finished，if processed tasks number = total tasks number，return true
function checkCurrentTaskFinish(taskTitle) {
  let regexPattern = /(\d+)/g;
  let result = false
  if (regexPattern.test(taskTitle)) {

    let taskProcess = taskTitle.match(regexPattern);

    if (taskProcess[taskProcess.length - 2] == taskProcess[taskProcess.length - 1]) {
      result = true
    }

    return result
  }
}

// get task process
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
  if (x < bounds.left || x > bounds.right) {
    x = bounds.left + width / 2
  }

  let y = random(bounds.top + high / 3, bounds.bottom - high / 3);
  if (y < bounds.top || y > bounds.bottom) {
    y = bounds.top + high / 2
  }

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

function goToTaskListMenu() {

  checkCoinTrigger++;

  log("go to task list");

  while (true) {
    // if task return to main screen
    if (desc("浮层活动").exists()) {
      log("1");
      let activityButton = desc("浮层活动").findOnce();
      clickButton(activityButton);
      delay(3);
    }

    clickTaskListButton();


    // sometimejump to menber center need to back 2 times
    if (text("会员中心").exists()) {
      back();
      back();
      delay(3);
    }

    if (textContains("邀请好友助力").exists()) {
      log("2");
      if (checkCoinTrigger % 10 == 1) {

        console.clear();
        log("checkCoinTrigger:" + checkCoinTrigger);

        if (textContains("当前进度").exists()) {
          let closeButton = textContains("当前进度").findOnce().parent().parent().child(0);
          clickButton(closeButton);
        }

        delay(3);

        if (textMatches(/^(每次)?消耗\d+汪汪币/).exists()) {

          let needCoin = parseInt(textMatches(/(每次)?消耗\d+汪汪币/).findOnce().parent().child(1).text(), 10);

          let myCoinText = textMatches(/(每次)?消耗\d+汪汪币/).findOnce().parent().parent().parent().child(11).text();

          let myCoin = 0;
          if (myCoinText != "") {
            myCoin = parseInt(myCoinText, 10);
          } else {
            myCoin = parseInt(textMatches(/(每次)?消耗\d+汪汪币/).findOnce().parent().parent().parent().child(12).text(), 10);
          }

          log("当前我的汪汪币：" + myCoin + " 打卡汪汪币：" + needCoin);

          if (myCoin >= needCoin) {
            clickUpgradeButton();
          } else {
            clickTaskListButton();
            break;
          }
        }

      } else {
        delay(4);
        break;
      }
    }

    back();
    delay(2);
  }

}

function finalHarvest() {
  //check 当前进度 .parent().child(2).child(1-3).click()

  if (textContains("当前进度").exists()) {
    let treasures = textContains("当前进度").findOnce().parent().child(2);

    log("check 当前进度");
    for (i = 1; i < 4; i++) {
      clickButton(treasures.child(i));

      if (text("已放入我的＞我的优惠券").exists()) {
        let returnButton = text("已放入我的＞我的优惠券").findOnce().parent().parent().child(4);
        clickButton(returnButton);
        delay(2);
      }
    }

  }
}

// 任务列表返回按钮
function clickTaskListButton() {
  // this button is same level with ask for help, so ask for help is precess 
  if (textMatches(/(每次)?消耗\d+汪汪币/).exists() && !textContains("邀请好友助力").exists()) {
    let taskListButton = textMatches(/(每次)?消耗\d+汪汪币/).findOnce().parent().parent().parent().child(9);
    clickButton(taskListButton);
    delay(3);
  }
}

// 打卡领红包按钮
function clickUpgradeButton() {
  log("打卡领红包");

  if (textMatches(/^(每次)?消耗\d+汪汪币/).exists()) {
    let upgradeButton = textMatches(/^(每次)?消耗\d+汪汪币/).findOnce().parent().parent();
    clickButton(upgradeButton);
    delay(10);

    // let parentFrame = textMatches(/\+\d+/).findOnce().parent().parent();
    // let returnButton = parentFrame.child(parentFrame.childCount() - 1);
    // clickButton(returnButton);
    // delay(4);


  }
}

// function registerKey() {
//   events.observeKey()
//   events.onKeyDown('volume_down', function (event) {
//     console.log('force to stop!')
//     device.cancelKeepingAwake()
//     exit()
//   })
// }
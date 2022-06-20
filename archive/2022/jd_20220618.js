// version 06091542
let speed = 1;
let browserSecond = 15;
let height = device.height;
let width = device.width;
let taskFinish = false;
let autoUpgrade = true;

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

  delay(4);
  back();
  delay(2);

  goToTaskListMenu();

  let lastTaskSubTitle = "";
  let lastTaskProcess = "";
  let browse8sCumculateSeconds = 15;

log("check task");

  // check task
  while (!taskFinish) {
    delay(3);

    // 因为更新导致去完成的描述没有了，只有图片，所以根据任务描述）去找
    let taskList = textMatches(/.+\(\d\/\d\)/).find();
    if (taskList.length == undefined || taskList.length == 0) {
      log("no valid task");
      taskFinish = true;
    }

    delay(2);
    try {
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


        // log(taskTitle);
        // log(taskSubTitle);
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
                browse8sCumculateSeconds = browserSecond;
              } else {
                browse8sCumculateSeconds = browse8sCumculateSeconds + browserSecond;
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

              let price = textMatches(/¥.+/).find();
              for (let j = 0; j < 4; j++) {

                clickButton(price[j].parent().parent().child(4));
                delay(2);
                back();
                delay(2);
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

              let shop = text("喜欢").find();
              for (i = 0; i < 4; i++) {

                shop[i].click();
                delay(4);
                back();
                delay(4);
              }

              goToTaskListMenu();

              break;

            case "returnCash":
              log(taskTitle);
              clickButton(button);
              delay(10);

              if (text("您有可提现金额").exists()) {
                let returnCashReturn = text("您有可提现金额").findOnce();
                clickButton(returnCashReturn);
              }

              // go to main page again
              back();
              goToTaskListMenu();
              back();
              delay(2);
              back();
              delay(2);
              goToTaskListMenu();

              break;

            case "clickOnce":
              log(taskTitle);
              clickButton(button);
              delay(5);

              // go to main page again
              back();
              goToTaskListMenu();
              back();
              delay(2);
              back();
              delay(2);
              goToTaskListMenu();

              break;

            case "bandWall":
              log(taskTitle);

              clickButton(button);
              delay(2);

              // let wallList = textContains("到底了，没有更多了").findOnce().parent().child(3).child(1);
              let wallList = idContains("feedBottom").findOnce().child(0);

              for (i = 1; i < 6; i++) {
                wallList.child(i).click();
                delay(5);
                back();
                delay(5);
              }

              // go to main page again
              back();
              goToTaskListMenu();
              back();
              delay(2);
              back();
              delay(2);
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

    } catch (error) {
      log("error:" + error)
      goToTaskListMenu();
    }

  }

  // click 当前进度
  // finalHarvest();
}

function getTaskCategory(taskTitle, taskSubTitle) {
  let taskCategory = "";

  let regTaskTitle = /^initial/g;
  let regTaskSubTitle = /initial/g;

  // 去玩下单返现金
  regTaskTitle = /^去玩下单返现金/g;
  if (regTaskTitle.test(taskTitle)) {
    taskCategory = "returnCash";
    return taskCategory;
  }

  // 去种草 is special, click and then click 5 shops
  regTaskTitle = /^去种草/g;
  if (regTaskTitle.test(taskTitle)) {
    taskCategory = "wanderShop";
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

  regTaskTitle = /^去组队/g;
  if (regTaskTitle.test(taskTitle)) {
    taskCategory = "clickOnce";
    return taskCategory;
  }

  regTaskSubTitle = /^去参与小程序活动可得/g;
  if (regTaskSubTitle.test(taskSubTitle)) {
    taskCategory = "browse8s";
    return taskCategory;
  }

  regTaskTitle = /^去逛逛并下单/g;
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

  if (bounds == undefined || bounds == null) {
    log("null button");
    return
  }

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

function goToTaskList() {
delay(2);

  while (!textContains("邀请好友助力").exists()) {

    if (desc("浮层活动").exists()) {

      let floatActivity = desc("浮层活动").findOnce();
      clickButton(floatActivity);

      //click task list
      while (!text("分红+卡牌").exists()) {
        delay(2);
      }

    }

    //if (textMatches(/立即抽奖/"立即抽奖").exists() || textContains("继续环游").exists() || textContains("开心收下").exists()) {
      if (textMatches(/^(立即抽奖|继续环游|开心收下)+/).exists()) {
        let closeButton = textMatches(/^(立即抽奖|继续环游|开心收下)/).find();
      
        for(i=0;i<closeButton.length;i++){
          if(closeButton[i].clickable()){
            closeButton.click();
            log("click"+closeButton[i].text());
            break;
          }
        }
      
        back();
        delay(2);
      }
      

    if (text("分红+卡牌").exists()) {

      let taskList = text("分红+卡牌").findOnce().parent().parent().child(5).child(0);
      clickButton(taskList);

      break;

    }


    back();
    delay(4);
  }
}

function checkUpgrade() {

  //refresh task list text
  delay(2);

  // print current coin
  let currentCoins = textMatches(/\d+/).find();
  log("current coins:" + currentCoins[2].text())

  if (!textContains("做任务 赚金币做任务 赚金币").exists()) {
    back();
    delay(2);
    return
  }

  let closeTaskList = textContains("做任务 赚金币做任务 赚金币").findOnce().parent().child(1);
  clickButton(closeTaskList);
  delay(1);

  // compare current coin and upgrade coin
  if (autoUpgrade == true) {


    let upgradeNeedCoins = text("消耗").findOnce().parent().child(2);

    if (parseInt(upgradeNeedCoins.text()) <= parseInt(currentCoins[2].text())) {
      log("upgrade substract " + upgradeNeedCoins.text());

      clickButton(upgradeNeedCoins.parent());

      if (text("开心收下开心收下").exists()) {
        let closeButton = text("开心收下开心收下").findOnce();
        clickButton(closeButton);
      }

      delay(4);

      back();

      delay(3);


    }
  }

}

function goToTaskListMenu() {

  log("go to task list");

  goToTaskList();
  checkUpgrade();
  goToTaskList();

  return;

}

// function registerKey() {
//   events.observeKey()
//   events.onKeyDown('volume_down', function (event) {
//     console.log('force to stop!')
//     device.cancelKeepingAwake()
//     exit()
//   })
// }
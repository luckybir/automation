auto();

launch("手机天猫");
console.show();

task();

function task() {
  let result = false;

  // // click task center
  // let taskCenter = className("android.view.View").find();
  // result = taskCenter[66].click();
  // delay(3);

  // 浏览15秒得星星，排除优酷
  executeBrowseTasks();

  //去玩淘金币小镇(0/1)立即前往得50星星
  //逛一逛淘宝人生(0/1)立即前往得50星星
  //玩省钱消消消赢福利(0/1)立即前往得50星星
  //浏览U先，赢1分钱试用(0/1)立即前往得50星星
  // executeGotoAPPTasks();

  //提醒我明日领红包(0/1)开启提醒获得50星星
}

function delay(seconds) {
  let randomSeconds = seconds * 1000 + random(100, 500);
  sleep(randomSeconds);
}

function executeBrowseTasks() {
  tasks = textContains("浏览15秒").find();

  tasks.forEach((task) => {
    // let taskText = task.parent().child(0).text();
    let taskText = task.text();

    // youku task leave
    let reg = /优酷/g;
    if (taskText.search(reg) != -1) {
      return;
    }

    // get click time and already finish time
    reg = /\d+(?=\))/g;
    let clickTimes = taskText.match(reg)[0];

    reg = /\d+(?=\/\d+\))/g;
    let finishTimes = taskText.match(reg)[0];

    log(taskText);

    if (clickTimes - finishTimes > 0) {
      for (let i = 0; i < clickTimes - finishTimes; i++) {
        log("click " + i + " times");
        task.click();
        delay(5);
        scrollDown();
        delay(25);
        back();
        delay(3);
      }

      // get result
      taskText = taskText = task.text();
      log(taskText);
    }
  });

  delay(3);
}

function executeGotoAPPTasks() {
  tasks = textContains("立即前往得").find();

  tasks.forEach((task) => {
    let taskText = task.parent().child(0).text();

    // get click time
    reg = /\d+(?=\))/g;
    let clickTimes = taskText.match(reg)[0];

    reg = /\d+(?=\/\d+\))/g;
    let finishTimes = taskText.match(reg)[0];

    log(taskText);

    if (clickTimes - finishTimes > 0) {
      for (let i = 0; i < clickTimes - finishTimes; i++) {
        log("click " + i + " times");
        task.click();
        delay(30);
        back();
        delay(3);
      }

      // get result
      taskText = task.parent().child(0).text();
      log(taskText);
    }
  });

  delay(3);
}

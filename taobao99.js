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

  // executeTasks("浏览15秒");
  executeTasks("立即前往得");

  //提醒我明日领红包(0/1)开启提醒获得50星星
  //浏览U先，赢1分钱试用(0/1)立即前往得50星星
  //去玩淘金币小镇(0/1)立即前往得50星星
  //逛一逛淘宝人生(0/1)立即前往得50星星
  //玩省钱消消消赢福利(0/1)立即前往得50星星
}

function delay(seconds) {
  let randomSeconds = seconds * 1000 + random(100, 500);
  sleep(randomSeconds);
}

function executeTasks(tasksName) {
  tasks = textContains(tasksName).find();

  log(tasks.size());

  tasks.forEach((task) => {
    let taskText = task.parent().child(0).text();

log(task.parent().children())

    return 

    // youku task leave
    let reg = /优酷/g;
    if (taskText.test(reg)) {
      return;
    }

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

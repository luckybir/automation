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

  let task = text("去完成").findOnce(2);

  console.log("共有" + task.parent().childCount() + "节点");

  for (let i = 0; i < task.parent().childCount(); i++) {
    if ((i + 1) % 4 == 0) {
      let button = task.parent().child(i);
      let taskStatus = button.text();
      // log(i + ": " + taskStatus);

      let taskTitle = task
        .parent()
        .child(i - 1)
        .text();

      console.log(taskTitle);

      while (taskStatus == "去完成") {
        let taskSubTitle = task
          .parent()
          .child(i - 2)
          .text();

        log(taskSubTitle);

        let taskCategory = "";

        let regTaskTitle = /^(浏览|逛店)(\d+秒)?(并关注)?可得\d+金币/g;
        let regTaskSubTitle = /^去小程序领更多金币/g;
        if (
          regTaskTitle.test(taskTitle) &&
          !regTaskSubTitle.test(taskSubTitle)
        ) {
          taskCategory = "browse";
        }

        switch (taskCategory) {
          case "browse":
            clickButton(button);

            log("等待25秒");
            delay(25);
            log("浏览完成，返回任务清单");

            while(!textContains("去完成").exists()){
                back();
                delay(3);
            }
           
            delay(3);

            break;

          default:
            taskStatus = "已完成";
            break;
        }
      }
    }
  }

  log("任务结束");
}

function clickButton(button) {
  var bounds = button.bounds();
  var width = bounds.right - bounds.left;
  var high = bounds.top - bounds.bottom;
  press(
    random(bounds.left + width / 4, bounds.right - width / 4),
    random(bounds.top + high / 3, bounds.bottom - high / 3),
    random(50, 100)
  );
}

function swipeRandom() {
  swipe(width / 2, height - 500, width / 2, 0, 1000);
}

function delay(seconds) {
  let randomSeconds = seconds * speed * 1000 + random(100, 500);
  sleep(randomSeconds);
}

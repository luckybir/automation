let speed = 1.5;
let height = device.height;
let width = device.width;
let taskFinish = false;

autoStart();
selectTask();
autoEnd();

function autoStart() {
  console.show();
  console.hide();
  auto.waitFor();
}

function selectTask() {
  let taskList = ["领金币", "营业版图"];
  let options = dialogs.multiChoice("执行的任务", taskList);

  if (options == "") {
    return;
  }

  options.forEach((option) => {
    switch (option) {
      case 0:
        // 领金币
        jdAuto();
        break;

      case 1:
        // 营业版图
        jdAuto2();
        break;

      default:
        break;
    }
  });
}

function autoEnd() {
  delay(5);
  console.hide();
  exit();
}

function jdAuto() {
  launchApp("京东");

  text("宝箱随机藏在以下店铺内，去找找吧～").waitFor();
  text("领金币").findOnce().click();
  textContains("邀请好友助力").waitFor();
  delay(2);

  // 取最后一个列表的数据
  let taskPostion = textContains("完成").find().length - 1;
  let task = textContains("完成").findOnce(taskPostion);
  // console.log("共有" + task.parent().childCount() + "节点");

  while (!taskFinish) {
    // 重新刷新任务列表
    task = textContains("完成").findOnce(taskPostion);

    for (let i = 0; i < task.parent().childCount(); i++) {
      if ((i + 1) % 4 == 0) {
        // 取按钮
        button = task.parent().child(i);

        //  取按钮文本
        let taskStatus = button.text();

        if (taskStatus == "已完成") {
          if (i + 1 == task.parent().childCount()) {
            taskFinish = true;
            break;
          } else {
            continue;
          }
        }

        let taskTitle = task
          .parent()
          .child(i - 1)
          .text();

        let taskSubTitle = task
          .parent()
          .child(i - 2)
          .text();

        let taskTriggle = false;

        // 判断任务类型
        let taskCategory = getTaskCategory(taskTitle, taskSubTitle);

        if (taskCategory != "") {
          // log(taskCategory);
          console.log(taskTitle);
          log(taskSubTitle);
        }

        switch (taskCategory) {
          case "browse8s":
            taskTriggle = true;
            clickButton(button);

            log("等待15秒");
            delay(15);
            log("浏览完成，返回任务清单");

            while (!textContains("去完成").exists()) {
              back();
              delay(2);
            }

            delay(2);

            break;

          case "browseGoods":
            taskTriggle = true;
            clickButton(button);

            text("任意浏览以下5个商品").waitFor();
            console.hide();
            delay(2);

            let coins = textContains("¥").find();
            // log(coins.length);

            let browseGoodsTimes = 0;

            // 获取第一个和第二个元素的坐标
            let good1 = coins[0].parent().parent().child(0);
            let good3 = coins[2].parent().parent().child(0);

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

              if (coins[j].parent().parent().child(0).text() != "已浏览") {
                // log(j);
                delay(2);

                browseGoodsTimes++;
                clickButton(coins[j].parent().parent().child(0));

                delay(2);
                back();
                delay(2);

                // text("任意浏览以下5个商品").waitFor();

                if (browseGoodsTimes == 5) {
                  break;
                }
              }
            }

            console.show();
            back();
            delay(3);
            break;

          case "cartGoods":
            taskTriggle = true;
            clickButton(button);

            text("在当前页任意加购5个商品").waitFor();
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

                if (cartGoodsTimes == 5) {
                  break;
                }
              }
            }

            console.show();
            back();
            delay(3);
            break;

          default:
            break;
        }

        if (taskTriggle) {
          break;
        }
      }
    }
  }

  log("领金币任务结束");

  //关闭按钮
  textContains("邀请好友")
    .findOnce()
    .parent()
    .parent()
    .parent()
    .child(2)
    .click();
  delay(2);
}

function jdAuto2() {
  launchApp("京东");

  // 营业版图
  text("可领金币").clickable(true).find().click();
  delay(2);
  textContains("当前开店进度").waitFor();

  let shops = className("android.view.View").clickable(true).find();

  // log(shops.length);
  for (let i = 0; i < shops.length; i++) {
    textContains("当前开店进度").waitFor();
    log("点击第" + (i + 1) + "个商店");
    shops[i].click();

    delay(3);
    textContains("完成").waitFor();
    delay(4);

    let shopTask = text("去完成").clickable(true).find();

    for (let j = 0; j < shopTask.length; j++) {
      shopTask[j].click();
      delay(3);

      if (!text("去完成").exists()) {
        back();
      }

      delay(3);
    }

    back();
    delay(2);
  }

  back();
  delay(2);
  log("营业版图任务结束");
}

function getTaskCategory(taskTitle, taskSubTitle) {
  let taskCategory = "";
  let regTaskTitle = /^(浏览|逛店)(\d+秒)?(并关注)?可得\d+金币/g;
  let regTaskSubTitle = /^去小程序领更多金币/g;

  if (regTaskTitle.test(taskTitle) && !regTaskSubTitle.test(taskSubTitle)) {
    taskCategory = "browse8s";
    return taskCategory;
  }

  regTaskTitle = /^成功浏览\d+个商品/g;
  if (regTaskTitle.test(taskTitle)) {
    taskCategory = "browseGoods";
    return taskCategory;
  }

  regTaskTitle = /^成功加购\d+个商品/g;
  if (regTaskTitle.test(taskTitle)) {
    taskCategory = "cartGoods";
    return taskCategory;
  }

  return taskCategory;
}

function clickButton(button) {
  var bounds = button.bounds();
  var width = bounds.right - bounds.left;
  var high = bounds.bottom - bounds.top;
  // log("bounds:" + bounds + "w:" + width + "h:" + high);

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

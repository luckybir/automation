let tasksList = [
  "浏览商品详情",
  "直营时尚会场",
  "浏览双11主会场",
  "浏览双11预售会场",
];

init();
runScript();
end();

function init() {
  console.show();
  auto.waitFor();
}

function runScript() {
  text("做任务赢彩蛋").waitFor();
  log("进入活动");
  sleep(3);

  //   while (text("去浏览").findOnce()) {

  //   }

  tasksList.forEach((task) => {
    if (textContain(task).findOnce()) {
      log(task);
    }
  });
}

function end() {
  console.hide();
  exit();
}

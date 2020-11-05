getScript();
function getScript() {
    var 用户名 = "CarsonRyan696"  //需要更换用户名
    var 仓库名 = "JavaScript"     //需要更换仓库名
    var 脚本名 = "测试.js"       //需要更换github中需要运行的脚本名

    console.show()    //打开控制台
    var github下载的脚本 = 下载Github文件()//这个方法返回的就是要运行的代码
    console.info("下载完成的代码为:" + '\n' + github下载的脚本)
    engines.execScript('Github下载的脚本', github下载的脚本)  //运行脚本

}
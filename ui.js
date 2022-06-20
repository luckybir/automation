"ui";

ui.layout(
    <frame>
        <vertical>
            <button id="automationPermission" text="1. 授予无障碍权限" />
            <button id="consolePermission" text="2. 授予悬浮窗权限" />
            <button id="startTask" text="3. 开始任务" />
            <text text="使用脚本有机率导致任务收益减少！本脚本仅供学习参考，请勿用于非法用途，使用脚本导致的任何可能结果与本人无关。" textStyle="bold|italic" textColor="red" textSize="18sp" />
        </vertical>
    </frame>
);

ui.automationPermission.click(function () {
    threads.start(autoPerReq);
});

ui.consolePermission.click(function () {
    threads.start(conPerReq);
});

ui.startTask.click(function () {
    // alert('淘宝活动尚未开始，敬请期待！')
    engines.execScriptFile('./jd_20211111.js');
});

function autoPerReq() {
    if (!auto.service) {
        alert('找到双十一任务助手，勾选授予权限', '部分机型在“已安装服务”中');
    }
    auto.waitFor();
    toast('无障碍权限授予成功');
};

function conPerReq() {
    toast('打开悬浮窗权限');
    console.show();
    console.log('悬浮窗权限授予成功！');
    sleep(1000);
    console.hide();
};

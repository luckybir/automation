console.show();
auto.waitFor();

launchApp("京东");
text("去完成").waitFor();
// log(text("去完成").find());

let find = text("去完成").find();
for(let i=0;i<find.length;i++){

    // log(find[i].bounds());

    let childCount = find[i].parent().childCount();

    for (let j=0;j<childCount;j++){
        log(i+":"+ find[i].parent().child(j));
    }
   
}

// for (let i = 0; i < task.parent().childCount(); i++) {

// }

exit();
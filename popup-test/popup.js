var title = document.getElementById("notifications-title");
var description = document.getElementById("notifications-p");
var thumbnail = document.getElementById("notifications-img");
var link = document.getElementById("notifications-link");
var Feed = [];
var currentID = 0;

document.getElementById("left-arrow").addEventListener("click", left);
document.getElementById("right-arrow").addEventListener("click", right);
thumbnail.addEventListener("click", function(a){
    chrome.tabs.create({ url: Feed[currentID].link});
});
link.addEventListener("click", function(a){
    chrome.tabs.create({ url: Feed[currentID].link});
});
chrome.runtime.sendMessage({get: 1}, function(r){
    Feed = r.feed;
    currentID = 0;
    loadPost();
});

function loadPost(){
    var cFeed = Feed[currentID];
    title.innerHTML = cFeed.title;
    description.innerHTML = cFeed.description;
    thumbnail.setAttribute("src", cFeed.thumbnail);
    link.setAttribute("href", cFeed.link);
}
function left(){
    nav(0);
}
function right(){
    nav(1);
}
function nav(a){
    if( a == 0){
        currentID -= 1;
        if(currentID < 0){
            currentID = Feed.length - 1;
        }
    }else{
        currentID += 1;
        if( currentID+1 > Feed.length){
            currentID = 0;
        }
    }
    loadPost();
}


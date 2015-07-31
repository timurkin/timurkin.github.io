var people = [];
var curr_id = 1;
var curr_users = [];
var uPhotos = [];
var girls = 0;
var authInfo;


$(document).ready(function () {

    $.get("./templates/card.handlebars", function(templateHTML){


        var cardTemplate = Handlebars.compile(templateHTML);

        var k = -1;
        var appInfo = {};
        if(document.domain == "timurkin.github.io")
            appInfo.apiId = 4981357;
        else if(document.domain == "localhost")
            appInfo.apiId = 3476779;

        VK.init(appInfo);

        VK.Auth.getLoginStatus(function (response) {
            if (response.session) {
                GO(response.session);
            } else {
                VK.Auth.getLoginStatus(authInfo);

            }
        });

        authInfo = function (response) {
            if (response.session) {
                GO(response.session);
            } else {
                VK.UI.button('login_button');
            }
        };

        function appendPhoto(photo) {
           $("#items-content").append(cardTemplate(photo));
        }

        function GO(sessions) {


            var s = document.querySelector(".s1");
            VK.Api.call('polls.getVoters', {
                owner_id: '-67272468',
                poll_id: 189812804,
                answer_ids: 627812949,
                count: 1000
            }, function (Voters) {
                if (Voters.response == undefined) {
                    return;
                }
                people = Voters.response[0].users;
                people.shift();
                ids = people.join(',');
                var params = {user_ids: ids, fields: 'sex'};



                VK.Api.call('users.get', params, function (s) {
                    people = s.response;
                    setTimeout(searchNext, 350);
                });




            });
            function log(text) {
                $(".status > span").html(text);
            }

            function searchNext() {

                if (curr_id <= people.length - 1) {
                    curr_users = [];
                    for (var i = 0; i < 25; ++i) {
                        if (people[i + curr_id])
                            curr_users.push("u" + i + "=" + people[i + curr_id].uid);
                    }
                    url = curr_users.join("&");
                    var queryString = {};
                    url.replace(
                        new RegExp("([^?=&]+)(=([^&]*))?", "g"),
                        function ($0, $1, $2, $3) {
                            queryString[$1] = $3;
                        }
                    );

                    VK.Api.call("execute.getAllPhotos", queryString, function (p) {
                        p.response.forEach(function (s) {
                            k += 1;
                            photos = [];
                            //console.log(p);

                            if (s == undefined) {
                                return;
                            }
                            if (s[0] != 0 && s.length > 0) {
                                s.forEach(function (photo) {

                                    if (typeof photo == "number") return;
                                    if (photo.created < 1388516400)  return;

                                    photos.push(
                                        {
                                            src:  photo.src_big || photo.src,
                                            likes: photo.likes.count,
                                            owner: photo.owner_id
                                        })
                                });
                                if (photos.length < 1)
                                    return;
                                photos.sort(function (a, b) {
                                    if (a.likes > b.likes)
                                        return -1;
                                    if (a.likes < b.likes)
                                        return 1;
                                    return 0;
                                });
                                var bestPhoto = photos[0];
                                href = photos[0].user;
                                var getUserByID = function(element){
                                    if(element.uid == bestPhoto.owner)
                                        return true;
                                };
                                var current_user = people.filter(getUserByID)[0];

                                var userObject = {
                                    id: bestPhoto.owner,
                                    fName: current_user.first_name,
                                    sName: current_user.last_name
                                };
                                var photo = {
                                    photos: photos,
                                    user: userObject
                                };
                                uPhotos.push(photo);
                                appendPhoto(photo);
                                girls += 1;
                            }
                        });


                    });

                    setTimeout(searchNext, 350);
                } else {
                    log("Количество людей:" + people.length);
                    curr_users = [];
                    $(".lazy-image").lazyload();
                }
                curr_id += 25;
            }

        }
    });

});
function go(e){
    var win = window.open("http://vk.com/id" +e.getAttribute("data-url"), '_blank');
}

function loadImages(e){

    $(e).find("img").each(function(){
        $(this).attr("src", $(this).attr("data-original"));
    });
}
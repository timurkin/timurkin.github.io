var people = [];
var curr_id = 1;
var curr_users = [];
var uPhotos = [];
var girls = 0;
var authInfo;
$(document).ready(() => {
    console.log("test");

    $.get("./templates/card.handlebars", (templateHTML) => {


        var cardTemplate = Handlebars.compile(templateHTML);

        var k = -1;
        var appInfo = {};
        console.log(document.domain);
        if (document.domain == "timurkin.github.io")
            appInfo.apiId = 4981357;
        else if (document.domain == "localhost")
            appInfo.apiId = 3476779;

        VK.init(appInfo);

        VK.Auth.getLoginStatus((response) => {
            if (response.session) {
                GO(response.session);
            } else {
                VK.Auth.getLoginStatus(authInfo);

            }
        });

        authInfo = (response) => {
            console.log(response.session);
            if (response.session) {
                GO(response.session);

            } else {
                VK.UI.button('login_button');
            }
        };

        function appendPhoto(photo) {
            if ($.localStorage.get(photo.user.id) != null)
                return;
            var grid = $("#items-content")[0];
            var item = document.createElement('div');
            salvattore['append_elements'](grid, [item]);
            item.outerHTML = cardTemplate(photo);
        }

        function GO() {
            VK.Api.call('polls.getVoters', {
                owner_id: '-67272468',
                poll_id: 236879892,
                answer_ids: '789935561',
                count: 1000,
                fields: 'sex',
                v: '5.53'
            }, (Voters) => {
                if (Voters.response == undefined) {
                    return;
                }
                people = Voters.response[0].users.items;

                var filtredPeople = [];
                people.forEach(function (item) {
                    if (item.sex != 1 || $.localStorage.get(item) != null) return;
                    filtredPeople.push(item.id);

                });
                ids = filtredPeople.join(',');
                var params = {user_ids: ids, fields: 'sex,online,photo_100'};


                VK.Api.call('users.get', params, (s) => {
                    people = s.response;
                    setTimeout(searchNext, 350);
                });


            });
            function log(text) {
                console.log(text);
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

                    VK.Api.call("execute.getAllPhotos", queryString, (p) => {
                        p.response.forEach(function (s) {
                            k += 1;
                            photos = [];


                            if (s == undefined) {
                                return;
                            }
                            if (s[0] != 0 && s.length > 0) {
                                s.forEach( (photo)  =>{

                                    if (typeof photo == "number") return;
                                    if (photo.created < 1388516400)  return;

                                    photos.push(
                                        {
                                            src: photo.src_big || photo.src,
                                            likes: photo.likes.count,
                                            owner: photo.owner_id
                                        })
                                });
                                if (photos.length < 1)
                                    return;


                                photos.sort((a,b) => a.likes > b.likes ? -1 : a.likes < b.likes ? 1 : 0);
                                var bestPhoto = photos[0];
                                href = photos[0].user;


                                var current_user = people.filter(element => element.uid == bestPhoto.owner)[0];

                                var userObject = {
                                    id: bestPhoto.owner,
                                    fName: current_user.first_name,
                                    sName: current_user.last_name,
                                    isOnline: current_user.online,
                                    avatar: current_user.photo_100
                                };
                                var photo = {
                                    photos: photos,
                                    user: userObject,
                                    likes: bestPhoto['likes']
                                };
                                uPhotos.push(photo);
                                appendPhoto(photo);

                                girls += 1;
                                log("Getting info about " + userObject.id);
                            }
                        });
                        setTimeout(searchNext, 350);
                    });

                } else {
                    log("Number of people:" + people.length);
                    curr_users = [];
                }
                curr_id += 25;
            }

        }
    });
    $('.dropdown-menu > li > a').on('click', () => {
        alert($(this).data("id"));
    })

});
function go(e) {
    window.open("http://vk.com/id" + e, '_blank');
}

function loadImages(e) {

    $(e).find("img").each(function () {
        $(this).attr("src", $(this).attr("data-original"));
    });
}
function blockUser(id, e) {
    $.localStorage.set(id, 0);
    $(e).parent().parent().parent().parent().remove();
}


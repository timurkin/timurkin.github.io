

function GO(sessions){

    var people = [];
     var curr_id = -1;
    var s = document.querySelector(".s1");


    VK.Api.call('polls.getVoters', {owner_id: '-67272468', poll_id:186926805, answer_ids:617947271, count:1000}, function(Voters){

        if( Voters.response == undefined)
            return;
        people = Voters.response[0].users;
        searchNext();

    });
    function searchNext(){
        curr_id += 1;
        if(curr_id <= people.length-1)
            VK.Api.call("photos.getAll", {count:100, extended:1, owner_id:people[curr_id]}, function(p){
                photos = [];
                console.log(p);
                if(p.response == undefined) {
                    setTimeout(searchNext, 350);
                    return;
                }
                if(p.response[0] != 0 && p.response.length > 0) {
                    p.response.forEach(function (photo) {
                        if (typeof photo == "number") return;
                        if (photo.created < 1388516400)  return;
                        photos.push(
                            {
                                src: photo.src_xxxbig || photo.src_xxbig || photo.src_xbig || photo.src_big || photo.src,
                                likes: photo.likes.count
                            })
                    });

                    photos.sort(function (a, b) {
                        if (a.likes > b.likes)
                            return -1;
                        if (a.likes < b.likes)
                            return 1;
                        return 0;
                    });
                    var link = document.createElement("a");
                    link.href = "https://vk.com/id" + people[curr_id];

                    var node = document.createElement("img");
                    node.src = photos[0].src;
                    link.appendChild(node);
                    s.appendChild(link);
                }
                setTimeout(searchNext, 350);
            });
    }

}



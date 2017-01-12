var current_mbid = "",
    inited = false;

function getTrackID(track){
    return track['name'] + track['artist']['#text'];
}

function update() {
    $.getJSON("http://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=kazerxxx&api_key=24f6b03517ad9984de417be5d10e150b&limit=1&format=json&callback=?", function(data) {
        var track = data['recenttracks']['track'][0],
            albumImages = track['image'],
            extraAlbumImage = albumImages[albumImages.length - 1]['#text'].replace('300x300', '900x900'),
            trackID = getTrackID(track),
            title = track['name'],
            artist = track['artist']['#text'];

        if(trackID == current_mbid)
            return;

        current_mbid = trackID;


        $('<img/>').attr('src', extraAlbumImage).on("load", (function(e) {
            $(this).remove();
            $(".current").fadeOut(500, function () {
                $(".current-thumbnail").css('background-image', "url(" + extraAlbumImage + ")");
                $("body").css('background-image', "url(" + extraAlbumImage + ")");
                $(".artist-name").html(artist);
                $(".track-name").html(title);
                $(this).fadeIn(500);

                if(!inited){
                    inited = true;
                    $(".loading-screen").fadeOut(300);
                }
            });
        }));


    });

    setTimeout(update, 5000);
}
$(document).ready(function() {
    update();
});
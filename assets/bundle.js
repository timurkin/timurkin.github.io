/* PURE CSS */


let fadeIn = (el) => {
    return new Promise((resolve, reject) => {
        el.style.opacity = 0;

        let last = +new Date();
        let tick = function() {
            el.style.opacity = +el.style.opacity + (new Date() - last) / 400;
            last = +new Date();

            if (+el.style.opacity < 1) {
                (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
            }else{
                resolve(el)
            }
        };

        tick();
    })
}
let fadeOut = (el) => {
    return new Promise((resolve, reject) => {
        el.style.opacity = 1;

        let last = +new Date();
        let tick = function() {
            el.style.opacity = +el.style.opacity - (new Date() - last) / 400;
            last = +new Date();

            if (+el.style.opacity > 0) {
                (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
            }else{
                resolve(el)
            }
        };

        tick();
    })
}


let currentID = '',
    __INITIALIZED__ = false

let getTrackID = track => track.artist['#text'] + ' - ' + track.name

let request = url =>
    new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                resolve(xhr.responseText)
            }
        };
        xhr.open('GET', url, true)
        xhr.send()
    })


let fetch = () => {
    return new Promise((resolve) =>
    {
        request('http://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=kazerxxx&api_key=24f6b03517ad9984de417be5d10e150b&limit=1&format=json')
            .then((response) => {
                let data = JSON.parse(response),
                    currentTrack = data.recenttracks.track[0],
                    albumCovers = currentTrack.image,
                    largeCover = albumCovers[albumCovers.length - 1]['#text'].replace('300x300', '900x900') || './assets/no-cover.png',
                    currentTrackID = getTrackID(currentTrack),
                    trackName = currentTrack.name,
                    artistName = currentTrack.artist['#text']

                if (currentTrackID === currentID) return

                currentID = currentTrackID

                let preloadImage = new Image()
                preloadImage.onload = () => {
                    let el = document.querySelector('.current')

                    fadeOut(el).then(() => {
                        document.querySelector('.current-thumbnail').style['background-image'] = `url(${largeCover})`
                        document.querySelector('body').style['background-image'] = `url(${largeCover})`
                        document.querySelector('.artist-name').innerText = artistName
                        document.querySelector('.track-name').innerText = trackName
                        fadeIn(el)
                        if (!__INITIALIZED__) {
                            __INITIALIZED__ = true
                            fadeOut(document.querySelector('.loading-screen')).then((el) => el.style.display = 'none')
                        }
                        resolve()
                    })

                }
                preloadImage.src = largeCover

            })
    })
}

let startWatcher = (delay) => {
    fetch().then(() => setInterval(fetch, delay))
}

startWatcher(5000)
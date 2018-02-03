const UPDATE_TIMEOUT = 5000;
const FEED_URL = 'http://ec2-18-218-82-4.us-east-2.compute.amazonaws.com:3000/now-playing';

const request = url =>
    new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                resolve(xhr.responseText)
            }
        };
        xhr.open('GET', url, true);
        xhr.send()
    });

window.addEventListener('load', () => {
    const app = new Vue({
        el: '#app',
        data: {
            currentTrack: null,
        },
        computed: {
            coverStyle: function () {
                return {
                    'background-image': `url(${this.currentTrack.largeCover})`
                }
            },
            progressBarStyle: function () {
                return {
                    width: (this.currentTrack.progress$ / this.currentTrack.duration * 100).toString() + '%'
                }
            }
        },
        created: function () {
            const getLastTrack = () => {
                request(FEED_URL).then((res) => {
                    const response = JSON.parse(res);
                    const item = response.item;

                    this.currentTrack = {
                        largeCover: item.album.images[0].url,
                        artist: item.artists.map(artist => artist.name).join(' & '),
                        name: item.name,
                        progress: response.progress_ms,
                        progress$: response.progress_ms,
                        duration: item.duration_ms,
                        timestamp: new Date().valueOf(),
                        isPlaying: response.is_playing
                    };

                    setTimeout(getLastTrack, UPDATE_TIMEOUT);
                });
            };
            getLastTrack();

            setInterval(() => {
                if (this.currentTrack && this.currentTrack.isPlaying)
                    this.currentTrack = {
                        ...this.currentTrack,
                        progress$: this.currentTrack.progress + (new Date().valueOf() - this.currentTrack.timestamp)
                    }
            }, 500);
        },
    });


});




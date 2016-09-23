angular.module('spotify').
    controller('spotifyArtistPage', ['$route', '$scope', '$http',
    function ($routeParams, $scope, $http) {
        this.artist = {
            'name': $routeParams.current.params.name
        };
        this.albums = [];
        this.ID = $routeParams.current.params.id;
        this.error = {
            exists: false,
            text: ''
        };

        var self = this;

        var getArtistAlbums = function (api_url) {
            if(!api_url){
                api_url = "https://api.spotify.com/v1/artists/" + self.ID + "/albums?limit=50&";
            }
            $http.get(api_url).
                then(successCallback, errorCallback);


        };
        var successCallback = function (response) {
            if(Object.keys(response.data).length > 0){
                response.data.items.forEach(function (item) {
                    item.thumbnail = item.images[0].url;
                    /* Приводим объекты к общему виду*/
                    self.albums.push(item);

                });
                if(response.data.next != null) {
                    getArtistAlbums(response.data.next);
                    /* Если альбомов большье 50, выполняем запрос еще раз с помощью автоматически сформированной ссылки */
                    /* Очень удобная особенность API*/
                }
            }

        };
        var errorCallback = function (e) {
            self.error.exists = true;
            self.error.text = "Что-то пошло не так. Попробуйте выполнить запрос позднее"
        };


        getArtistAlbums();
    }
]);
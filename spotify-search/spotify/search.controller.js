angular.module('spotify').controller('spotifySearchResults',
    ['$scope', '$http', function ($scope, $http) {
        this.artists = [];
        this.query = '';
        this.error = {
            exists: false,
            text: ''
        };
        var self = this;

        $scope.startSearch = function () {
            self.artists = [];
            search();
        };

        var search = function(api_url){
            if(!api_url)
                api_url = 'https://api.spotify.com/v1/search?type=artist&limit=50&q=' + encodeURIComponent(self.query);

            $http.get(api_url).then(successCallback, errorCallback);
        };
        var successCallback = function (response) {
            if(response.data.artists.total > 0) {
                self.error.exists = false;
                self.artists = self.artists.concat(response.data.artists.items);

                
                if(response.data.artists.next != null) {
                    search(response.data.artists.next);
                    /* если есть еще артисты, выполняет запрос */
                }
            }else{
                self.error.exists = true;
                self.error.text = 'Ни одного исполнителя не найдено!';
            }

        };
        var errorCallback = function (e) {
                self.error.exists = true;
                self.error.text = "Что-то пошло не так. Попробуйте выполнить запрос позднее"
            };
    }]
);
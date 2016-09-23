angular.module('searchMusicApp', ['ngRoute', 'musicSearch', 'artistPage', 'spotify']);

angular.module('searchMusicApp')
    .config(function ($routeProvider) {
        $routeProvider.
            when('/search', {
                templateUrl: 'views/search.html',
                controller: 'spotifySearchResults as searchController'
            })
            .when('/artist/:id/:name', {
                templateUrl: 'views/artist.html',
                controller: 'spotifyArtistPage as artistPageController'
            })
            .otherwise('/search');
    });
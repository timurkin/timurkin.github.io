
angular.module('musicSearch').component('searchResults', {
    templateUrl: './artist-search/results-list.template.html',
    bindings: {
        artists: '<'
    }
});
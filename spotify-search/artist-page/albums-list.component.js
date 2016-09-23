angular.module('artistPage')
    .component('albumsList', {
        templateUrl: './artist-page/albums-list.template.html',
        bindings:{
            albums: '<',
            text: '<'
        }
    });
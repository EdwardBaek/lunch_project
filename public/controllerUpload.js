'use strict';
angular.module('app', ['angularFileUpload'])
.controller('AppController', ['$scope', 'FileUploader', function($scope, FileUploader, $http) {
    $scope.newRestaurant = {
        name : "",
    };
    $scope.log = function log(){
        console.log( "restaurantName---:",$scope.newRestaurant.name );
        console.log( "restaurantName///:",uploader.formData[0].restaurantName );
    }
    function setFormData(item){
        item.formData = [{
            restaurantName: $scope.newRestaurant.name
        }];
    }

    var uploader = $scope.uploader = new FileUploader({
        url: '/api/add_new_restaurant'
    });

    // FILTERS
    uploader.filters.push({
        name: 'imageFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });
    // limit upload file number
    uploader.queueLimit = 1;

    // CALLBACKS
    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
        console.warn("TypeError - ", "Not supported file format");
    };
    uploader.onAfterAddingFile = function(fileItem) {
        // $scope.log();
        // console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function(addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function(item) {
        // console.info('onBeforeUploadItem', item);
        // insert name value before upload by item
        setFormData(item);
    };
    uploader.onProgressItem = function(fileItem, progress) {
        // console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function(progress) {
        // console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        // console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
        // console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function(fileItem, response, status, headers) {
        // console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
        // console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function() {
        // console.info('onCompleteAll');
    };
}]);
/* global $ noteful api store */
'use strict';

$(document).ready(function () {
  noteful.bindEventListeners();

  api.search({searchTerm:''}).then(response => {
    store.notes = response;
    console.log(response);
    noteful.render();
  });

});

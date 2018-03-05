/* global $ noteful api store */
'use strict';

$(document).ready(function () {
  noteful.bindEventListeners();

  api.search({searchTerm:''}, response => {
    store.notes = response;
    noteful.render();
  });

});

'use strict';

(function () {

  var PRICE = {
    BUNGALO: 0,
    FLAT: 1000,
    HOUSE: 5000,
    PALACE: 10000
  };

  var adForm = document.querySelector('.ad-form');
  var adFieldset = adForm.querySelectorAll('.fieldset');
  var mapFiltersForm = document.querySelector('.map__filters');
  var mapSelect = mapFiltersForm.querySelectorAll('.select');
  var mapFieldset = mapFiltersForm.querySelectorAll('.fieldset');

  var adTypeSelect = document.getElementById('type');
  var adPrice = document.getElementById('price');

  var setDisabledAttribute = function (array) {
    for (var i = 0; i < array.length; i++) {
      array[i].disabled = true;
    }
  };

  window.removeDisabledAttribute = function (array) {
    for (var i = 0; i < array.length; i++) {
      array[i].disabled = false;
    }
  };

  var setPrice = function (value) {
    adPrice.min = value;
    adPrice.placeholder = value;
  };

  window.onTypeSelect = function () {
    if (adTypeSelect.value === 'bungalo') {
      setPrice(PRICE.BUNGALO);
    } else if (adTypeSelect.value === 'flat') {
      setPrice(PRICE.FLAT);
    } else if (adTypeSelect.value === 'house') {
      setPrice(PRICE.HOUSE);
    } else if (adTypeSelect.value === 'palace') {
      setPrice(PRICE.PALACE);
    }
  };

  window.onTimeSelect = function (timeIn, timeOut) {
    if (timeIn.value === '12:00') {
      timeOut.options[0].selected = true;
    } else if (timeIn.value === '13:00') {
      timeOut.options[1].selected = true;
    } else if (timeIn.value === '14:00') {
      timeOut.options[2].selected = true;
    }
  };

  setDisabledAttribute(adFieldset);
  setDisabledAttribute(mapFieldset);
  setDisabledAttribute(mapSelect);

})();

'use strict';

(function () {
  var urlPost = 'https://js.dump.academy/keksobooking';

  window.dialogForm = {
    adForm: document.querySelector('.ad-form'),
    addressInput: document.querySelector('input[name="address"]'),
    activateForm: function () {
      setDisabledAttribute(adFieldset, false);
      setDisabledAttribute(mapFieldset, false);
      setDisabledAttribute(mapSelect, false);
    },
    onTypeSelect: function () {
      setPrice(window.constants.PRICE[adTypeSelect.value]);
    },
    onTimeSelect: function (timeIn, timeOut) {
      var timeInSelectedIndex = timeIn.options.selectedIndex;
      timeOut.value = timeOut.options[timeInSelectedIndex].value;
    },
    onRoomsGuestsSelect: function (adGuests, roomsValue) {
      var countGuests = window.constants.GUESRS_BY_ROOM[roomsValue];
      var optionsGuests = adGuests.querySelectorAll('option');

      optionsGuests.forEach(function (option) {
        option.disabled = countGuests.indexOf(option.value) === -1;
      });

      if (countGuests.indexOf(adGuests.value) === -1) {
        adGuests.setCustomValidity('Укажите другое количество гостей');
      }

      adGuests.addEventListener('change', function () {
        if (countGuests.indexOf(adGuests.value) !== -1) {
          adGuests.setCustomValidity('');
        }
      });
    },
    deactivatePage: function () {
      window.dialogForm.adForm.reset();
      mapFiltersForm.reset();
      window.card.remove();

      window.map.deactiveMap();
      window.map.removeAdresses();
      window.photos.deletePhotos();
      window.map.setMapMainPinPosition();
      window.map.isActive = false;
    }
  };

  var adFieldset = window.dialogForm.adForm.querySelectorAll('fieldset');
  var mapFiltersForm = document.querySelector('.map__filters');
  var mapSelect = mapFiltersForm.querySelectorAll('select');
  var mapFieldset = mapFiltersForm.querySelectorAll('fieldset');

  var adTypeSelect = document.querySelector('select[name="type"]');
  var adPrice = document.querySelector('input[name="price"]');

  var setDisabledAttribute = function (array, value) {
    for (var i = 0; i < array.length; i++) {
      array[i].disabled = value;
    }
  };

  var setPrice = function (value) {
    adPrice.min = value;
    adPrice.placeholder = value;
  };

  var disableForm = function () {
    setDisabledAttribute(adFieldset, true);
    setDisabledAttribute(mapFieldset, true);
    setDisabledAttribute(mapSelect, true);
  };

  disableForm();

  var resetButton = document.querySelector('.ad-form__reset');
  resetButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    window.dialogForm.adForm.reset();
    window.photos.deletePhotos();
    window.map.setMapMainPinPosition();
  });

  var onLoadHandler = function () {
    disableForm();
    window.dialogForm.deactivatePage();

    window.message.showSuccess();
  };

  var onErrorHandler = function () {
    window.message.showError();
  };

  window.dialogForm.adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.upload(urlPost, new FormData(window.dialogForm.adForm), onLoadHandler, onErrorHandler);
  });
})();

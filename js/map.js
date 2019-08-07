'use strict';

(function () {
  var mainPinX = (window.constants.DEFAULT_MAP_WIDTH - window.constants.MIN_X) / 2 + window.constants.MIN_X;
  var mainPinY = (window.constants.MAX_Y - window.constants.MIN_Y) / 2 + window.constants.MIN_Y;

  var similarPinTemplate = document.querySelector('#pin')
      .content
      .querySelector('.map__pin');
  var similarListElement = document.querySelector('.map__pins');

  var adTypeSelect = window.dialogForm.adForm.querySelector('select[name="type"]');
  var adTimeIn = window.dialogForm.adForm.querySelector('select[name="timein"]');
  var adTimeOut = window.dialogForm.adForm.querySelector('select[name="timeout"]');
  var adRooms = window.dialogForm.adForm.querySelector('select[name="rooms"]');
  var adGuests = window.dialogForm.adForm.querySelector('select[name="capacity"]');

  var mapFilters = document.querySelector('.map__filters');

  var adresses = [];

  window.map = {
    isActive: false,
    map: document.querySelector('.map'),
    mapMainPin: document.querySelector('.map__pin--main'),
    activeMap: function () {
      window.utils.showElement(window.map.map, 'map--faded');
      window.utils.showElement(window.dialogForm.adForm, 'ad-form--disabled');
      window.dialogForm.activateForm();
    },
    deactiveMap: function () {
      window.utils.hideElement(window.map.map, 'map--faded');
      window.utils.hideElement(window.dialogForm.adForm, 'ad-form--disabled');

      adTypeSelect.removeEventListener('change', window.dialogForm.onTypeSelect);
      adTimeIn.removeEventListener('change', function () {
        window.dialogForm.onTimeSelect(adTimeIn, adTimeOut);
      });
      adTimeOut.removeEventListener('change', function () {
        window.dialogForm.onTimeSelect(adTimeOut, adTimeIn);
      });
      adRooms.removeEventListener('change', function () {
        window.dialogForm.onRoomsGuestsSelect(adGuests, adRooms.value);
      });
      mapFilters.removeEventListener('change', onRenderPinsMapDebounced);
    },
    removeAdresses: function () {
      var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
      for (var i = 0; i < pins.length; i++) {
        var pin = pins[i];
        pin.remove();
      }
    },
    setTopCoords: function (position) {
      var coodsY;
      var coodsMinY = window.constants.MIN_Y - window.constants.MAIN_PIN_SIZE;
      var coodsMaxY = window.constants.MAX_Y - window.constants.MAIN_PIN_SIZE - window.constants.MAIN_PIN_TAIL;

      if (position >= coodsMinY && position <= coodsMaxY) {
        coodsY = position + 'px';
      } else if (position < window.constants.MIN_Y) {
        coodsY = (window.constants.MIN_Y - window.constants.MAIN_PIN_SIZE - window.constants.MAIN_PIN_TAIL) + 'px';
      } else if (position > (window.constants.MAX_Y)) {
        coodsY = (window.constants.MAX_Y - window.constants.MAIN_PIN_SIZE) + 'px';
      }
      return coodsY;
    },
    setLeftCoords: function (position) {
      var coodsX;
      var coodsMinX = window.constants.MIN_X;
      var coodsMaxX = maxWidth - window.constants.MAIN_PIN_SIZE;

      if (position >= coodsMinX && position <= coodsMaxX) {
        coodsX = position + 'px';
      } else if (position < window.constants.MIN_X) {
        coodsX = window.constants.MIN_X + 'px';
      } else if (position > coodsMaxX) {
        coodsX = coodsMaxX + 'px';
      }
      return coodsX;
    },
    getElementCoords: function (item, width, height) {
      return Math.round((item.offsetLeft + width / 2)) +
      ', ' + Math.round((item.offsetTop + height));
    },
    setMapMainPinPosition: function (x, y) {
      window.map.mapMainPin.style.left = window.map.setLeftCoords(x);
      window.map.mapMainPin.style.top = window.map.setTopCoords(y);
      window.dialogForm.addressInput.value = window.map.getElementCoords(window.map.mapMainPin, window.constants.MAIN_PIN_SIZE, window.constants.MAIN_PIN_FULL_SIZE);
    },
    resetCountGuests: function () {
      window.dialogForm.onTypeSelect();
      window.dialogForm.onRoomsGuestsSelect(adGuests, adRooms.value);
      var selectGuests = adGuests.options[adGuests.selectedIndex];
      if (selectGuests.disabled) {
        for (var i = 0; i < adGuests.length; i++) {
          var elGuests = adGuests.options[i];
          if (!elGuests.disabled) {
            adGuests.options[i].selected = true;
            adGuests.setCustomValidity('');
            break;
          }
        }
      }
    },
    onLoadHandler: function (array) {
      adresses = array;
      renderPins(array);
    }
  };

  var addPinListener = function (item, adress) {
    item.addEventListener('click', function () {
      window.card.remove();
      item.classList.add('map__pin--active');
      window.card.showCard(adress);
    });
  };

  var setPin = function (adress) {
    var pinItem = similarPinTemplate.cloneNode(true);

    pinItem.style.left = (adress.location.x - window.constants.PIN_WIDTH / 2) + 'px';
    pinItem.style.top = (adress.location.y - window.constants.PIN_HEIGHT) + 'px';
    pinItem.querySelector('img').src = adress.author.avatar;
    pinItem.querySelector('img').alt = adress.offer.type;

    addPinListener(pinItem, adress);

    return pinItem;
  };

  var renderPins = function (adress) {
    var fragment = document.createDocumentFragment();

    var count = adress.length > window.constants.ADRESS_COUNT ? window.constants.ADRESS_COUNT : adress.length;
    for (var i = 0; i < count; i++) {
      fragment.appendChild(setPin(adress[i]));
    }

    similarListElement.appendChild(fragment);
  };

  var maxWidth = window.map.map ? window.map.map.offsetWidth : window.constants.DEFAULT_MAP_WIDTH;

  var clearMapPins = function () {
    var pins = similarListElement.querySelectorAll('.map__pin');
    pins.forEach(function (pinElement) {
      if (pinElement !== window.map.mapMainPin) {
        similarListElement.removeChild(pinElement);
      }
    });
  };

  var onChangeFilter = function () {
    var filteredAdresses = window.filters.getFilteredData(adresses);
    filteredAdresses = filteredAdresses.slice(0, window.constants.ADRESS_COUNT);
    clearMapPins();
    window.card.remove();
    renderPins(filteredAdresses);
  };

  adTypeSelect.addEventListener('change', window.dialogForm.onTypeSelect);
  adTimeIn.addEventListener('change', function () {
    window.dialogForm.onTimeSelect(adTimeIn, adTimeOut);
  });
  adTimeOut.addEventListener('change', function () {
    window.dialogForm.onTimeSelect(adTimeOut, adTimeIn);
  });
  adRooms.addEventListener('change', function () {
    window.dialogForm.onRoomsGuestsSelect(adGuests, adRooms.value);
  });

  var onRenderPinsMapDebounced = window.debounce(onChangeFilter);
  mapFilters.addEventListener('change', onRenderPinsMapDebounced);

  window.map.setMapMainPinPosition(mainPinX, mainPinY);
  window.map.resetCountGuests();

})();

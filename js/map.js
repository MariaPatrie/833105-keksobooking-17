'use strict';

(function () {
  var mainPinX = (window.constants.DEFAULT_MAP_WIDTH - window.constants.MIN_X) / 2 + window.constants.MIN_X;
  var mainPinY = (window.constants.MAX_Y - window.constants.MIN_Y) / 2 + window.constants.MIN_Y;

  var similarPinTemplate = document.querySelector('#pin')
      .content
      .querySelector('.map__pin');
  var similarListElement = document.querySelector('.map__pins');

  var adTypeSelect = document.querySelector('select[name="type"]');
  var adTimeIn = document.querySelector('select[name="timein"]');
  var adTimeOut = document.querySelector('select[name="timeout"]');
  var adHousingTypeSelector = document.querySelector('select[name="housing-type"]');
  var adRooms = document.querySelector('select[name="rooms"]');
  var adGuests = document.querySelector('select[name="capacity"]');

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
      adHousingTypeSelector.removeEventListener('change', onChangeHousingTypeFilter);
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
      if (position >= (window.constants.MIN_Y - window.constants.MAIN_PIN_SIZE) && position <= (window.constants.MAX_Y - window.constants.MAIN_PIN_SIZE - window.constants.MAIN_PIN_TAIL)) {
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
      if (position >= window.constants.MIN_X && position <= (maxWidth - window.constants.MAIN_PIN_SIZE)) {
        coodsX = position + 'px';
      } else if (position < window.constants.MIN_X) {
        coodsX = window.constants.MIN_X + 'px';
      } else if (position > (maxWidth - window.constants.MAIN_PIN_SIZE)) {
        coodsX = (maxWidth - window.constants.MAIN_PIN_SIZE) + 'px';
      }
      return coodsX;
    },
    getElementCoords: function (item, width, height) {
      return Math.round((item.offsetLeft + width / 2)) +
      ', ' + Math.round((item.offsetTop + height));
    },
    setMapMainPinPosition: function () {
      window.map.mapMainPin.style.top = window.map.setTopCoords(mainPinY);
      window.map.mapMainPin.style.left = window.map.setLeftCoords(mainPinX);
      window.dialogForm.addressInput.value = window.map.getElementCoords(window.map.mapMainPin, window.constants.MAIN_PIN_SIZE, (window.constants.MAIN_PIN_SIZE + window.constants.MAIN_PIN_TAIL));
      resetCountGuests();
    },
    onLoadHandler: function (array) {
      adresses = array;
      renderPins(array);
    }
  };

  var resetCountGuests = function () {
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

  var onChangeHousingTypeFilter = function () {
    var filteredAdresses = window.dialogForm.onHousingTypeSelect(adresses, adHousingTypeSelector.value, window.constants.ADRESS_COUNT);
    clearMapPins();
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
  adHousingTypeSelector.addEventListener('change', onChangeHousingTypeFilter);

  window.map.setMapMainPinPosition();

})();

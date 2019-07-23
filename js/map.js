'use strict';

(function () {
  var ADRESS_COUNT = 5;

  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  var MAIN_PIN_SIZE = 65;
  var MAIN_PIN_TAIL = 22;

  var DEFAULT_MAP_WIDTH = 1200;
  var MIN_X = 0;
  var MIN_Y = 130;
  var MAX_Y = 630;

  var urlGet = 'https://js.dump.academy/keksobooking/data';

  var map = document.querySelector('.map');
  var maxWidth = map ? map.offsetWidth : DEFAULT_MAP_WIDTH;
  var similarPinTemplate = document.querySelector('#pin')
      .content
      .querySelector('.map__pin');
  var similarListElement = document.querySelector('.map__pins');
  var mapMainPin = document.querySelector('.map__pin--main');
  var adTypeSelect = document.querySelector('#type');
  var adTimeIn = document.querySelector('#timein');
  var adTimeOut = document.querySelector('#timeout');
  var adHousingTypeSelector = document.querySelector('#housing-type');
  var adRooms = document.querySelector('#room_number');
  var adGuests = document.querySelector('#capacity');

  var adForm = document.querySelector('.ad-form');
  var adFieldset = adForm.querySelectorAll('.fieldset');
  var mapFiltersForm = document.querySelector('.map__filters');
  var mapSelect = mapFiltersForm.querySelectorAll('.select');
  var mapFieldset = mapFiltersForm.querySelectorAll('.fieldset');
  var addressInput = adForm.querySelector('#address');

  var isActive = false;
  var adresses = [];

  var activeMap = function () {
    window.utils.showElement(map, 'map--faded');
    window.utils.showElement(adForm, 'ad-form--disabled');
    window.dialogForm.onTypeSelect();
    window.dialogForm.onRoomsGuestsSelect(adGuests, adRooms.value);
    var selectGuests = adGuests.options[adGuests.selectedIndex];
    if (selectGuests.disabled = true) {
      for (var i = 0; i < adGuests.length; i++){
        var elGuests = adGuests.options[i];
        if (elGuests.disabled != true) {
         // adGuests.selectedIndex = i;
          adGuests.options[i].selected = true;
          break;
        }
      }
    };
  };

  var pinListener = function (item, adress) {
    item.addEventListener('click', function () {
      window.card.remove();
      item.classList.add('map__pin--active');
      window.card.showCard(adress);
    });
  };

  var setPin = function (adress) {
    var pinItem = similarPinTemplate.cloneNode(true);

    pinItem.style.left = (adress.location.x - PIN_WIDTH / 2) + 'px';
    pinItem.style.top = (adress.location.y - PIN_HEIGHT) + 'px';
    pinItem.querySelector('img').src = adress.author.avatar;
    pinItem.querySelector('img').alt = adress.offer.type;

    pinListener(pinItem, adress);

    return pinItem;
  };

  var renderPins = function (adress) {
    var fragment = document.createDocumentFragment();

    var count = adress.length > ADRESS_COUNT ? ADRESS_COUNT : adress.length;
    for (var i = 0; i < count; i++) {
      fragment.appendChild(setPin(adress[i]));
    }

    similarListElement.appendChild(fragment);
  };

  var getElementCoords = function (item, width, height) {

    return Math.round((item.offsetLeft + width / 2)) +
    ', ' + Math.round((item.offsetTop + height));
  };

  var setTopCoords = function (position) {
    var coodsY;
    if (position >= (MIN_Y - MAIN_PIN_SIZE) && position <= (MAX_Y - MAIN_PIN_SIZE - MAIN_PIN_TAIL)) {
      coodsY = position + 'px';
    } else if (position < MIN_Y) {
      coodsY = (MIN_Y - MAIN_PIN_SIZE - MAIN_PIN_TAIL) + 'px';
    } else if (position > (MAX_Y)) {
      coodsY = (MAX_Y - MAIN_PIN_SIZE) + 'px';
    }
    return coodsY;
  };

  var setLeftCoords = function (position) {
    var coodsX;
    if (position >= MIN_X && position <= (maxWidth - MAIN_PIN_SIZE)) {
      coodsX = position + 'px';
    } else if (position < MIN_X) {
      coodsX = MIN_X + 'px';
    } else if (position > (maxWidth - MAIN_PIN_SIZE)) {
      coodsX = (maxWidth - MAIN_PIN_SIZE) + 'px';
    }
    return coodsX;
  };

  var clearMapPins = function () {
    var pins = similarListElement.querySelectorAll('.map__pin');
    pins.forEach(function (pinElement) {
      if (pinElement !== mapMainPin) {
        similarListElement.removeChild(pinElement);
      }
    });
  };

  var onChangeHousingTypeFilter = function () {
    var filteredAdresses = window.dialogForm.onHousingTypeSelect(adresses, adHousingTypeSelector.value, ADRESS_COUNT);
    clearMapPins();
    renderPins(filteredAdresses);
  };

  var onLoadHandler = function (array) {
    adresses = array;
    renderPins(array);
  };

  mapMainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    if (!isActive) {
      activeMap();
      window.backend.load(urlGet, onLoadHandler, window.message.showError);
      isActive = true;
    }

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var mapMainPinTop = (mapMainPin.offsetTop - shift.y);
      var mapMainPinLeft = (mapMainPin.offsetLeft - shift.x);

      mapMainPin.style.top = setTopCoords(mapMainPinTop);
      mapMainPin.style.left = setLeftCoords(mapMainPinLeft);

      addressInput.value = getElementCoords(mapMainPin, MAIN_PIN_SIZE, (MAIN_PIN_SIZE + MAIN_PIN_TAIL));
    };

    var onMouseUp = function () {
      window.dialogForm.removeDisabledAttribute(adFieldset);
      window.dialogForm.removeDisabledAttribute(mapFieldset);
      window.dialogForm.removeDisabledAttribute(mapSelect);
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
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      addressInput.value = getElementCoords(mapMainPin, MAIN_PIN_SIZE, (MAIN_PIN_SIZE + MAIN_PIN_TAIL));
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  window.map = {
    deactiveMap: function () {
      window.utils.hideElement(map, 'map--faded');
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
      adresses.forEach(function (adress) {
        adress.remove();
      });
    }
  };
})();

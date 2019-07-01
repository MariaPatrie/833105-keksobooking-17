'use strict';

(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  var MAIN_PIN_SIZE = 65;
  var MAIN_PIN_TAIL = 22;

  var TYPES = ['palace', 'flat', 'house', 'bungalo'];
  var map = document.querySelector('.map');
  var DEFAULT_MAP_WIDTH = 1200;
  var MAX_X = map ? map.offsetWidth : DEFAULT_MAP_WIDTH;
  var MIN_X = 0;
  var MIN_Y = 130;
  var MAX_Y = 630;

  var similarPinTemplate = document.querySelector('#pin')
      .content
      .querySelector('.map__pin');
  var similarListElement = document.querySelector('.map__pins');
  var mapMainPin = document.querySelector('.map__pin--main');
  var adTypeSelect = document.getElementById('type');
  var adTimeIn = document.getElementById('timein');
  var adTimeOut = document.getElementById('timeout');

  var adForm = document.querySelector('.ad-form');
  var adFieldset = adForm.querySelectorAll('.fieldset');
  var mapFiltersForm = document.querySelector('.map__filters');
  var mapSelect = mapFiltersForm.querySelectorAll('.select');
  var mapFieldset = mapFiltersForm.querySelectorAll('.fieldset');
  var addressInput = adForm.querySelector('#address');

  var isActive = false;

  window.showElement = function (item, className) {
    item.classList.remove(className);
  };

  var activeMap = function () {
    window.showElement(map, 'map--faded');
    window.showElement(adForm, 'ad-form--disabled');
  };

  var setPin = function (adress) {
    var pinItem = similarPinTemplate.cloneNode(true);

    pinItem.style.left = (adress.location.x - PIN_WIDTH / 2) + 'px';
    pinItem.style.top = (adress.location.y - PIN_HEIGHT) + 'px';
    pinItem.querySelector('img').src = adress.author.avatar;
    pinItem.querySelector('img').alt = adress.offer.type;

    return pinItem;
  };

  var renderPins = function (adress) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < adress.length; i++) {
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
    if (position >= MIN_X && position <= (MAX_X - MAIN_PIN_SIZE)) {
      coodsX = position + 'px';
    } else if (position < MIN_X) {
      coodsX = MIN_X + 'px';
    } else if (position > (MAX_X - MAIN_PIN_SIZE)) {
      coodsX = (MAX_X - MAIN_PIN_SIZE) + 'px';
    }
    return coodsX;
  };

  mapMainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    if (!isActive) {
      var adressArray = window.getAdresses(TYPES, MIN_X, MAX_X, MIN_Y, MAX_Y);
      activeMap();
      renderPins(adressArray);
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
      window.removeDisabledAttribute(adFieldset);
      window.removeDisabledAttribute(mapFieldset);
      window.removeDisabledAttribute(mapSelect);
      adTypeSelect.addEventListener('change', window.onTypeSelect);
      adTimeIn.addEventListener('change', function () {
        window.onTimeSelect(adTimeIn, adTimeOut);
      });
      adTimeOut.addEventListener('change', function () {
        window.onTimeSelect(adTimeOut, adTimeIn);
      });

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      addressInput.value = getElementCoords(mapMainPin, MAIN_PIN_SIZE, (MAIN_PIN_SIZE + MAIN_PIN_TAIL));
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

})();

'use strict';

var ADRESS_COUNT = 8;
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var map = document.querySelector('.map');
var DEFAULT_MAP_WIDTH = 1200;
var MAX_X = map ? map.offsetWidth : DEFAULT_MAP_WIDTH;
var MIN_X = 0;
var MIN_Y = 130;
var MAX_Y = 630;

var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

var MAIN_PIN_SIZE = 65;
var MAIN_PIN_TAIL = 22;

var PRICE = {
  BUNGALO: 0,
  FLAT: 1000,
  HOUSE: 5000,
  PALACE: 10000
};

var map = document.querySelector('.map');
var similarPinTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');
var similarListElement = document.querySelector('.map__pins');

var adForm = document.querySelector('.ad-form');
var adFieldset = adForm.querySelectorAll('.fieldset');
var addressInput = adForm.querySelector('#address');
var adTypeSelect = document.getElementById('type');
var adPrice = document.getElementById('price');
var adTimeIn = document.getElementById('timein');
var adTimeOut = document.getElementById('timeout');
var mapFiltersForm = document.querySelector('.map__filters');
var mapSelect = mapFiltersForm.querySelectorAll('.select');
var mapFieldset = mapFiltersForm.querySelectorAll('.fieldset');
var mapMainPin = document.querySelector('.map__pin--main');
var adressArray = [];

var showElement = function (item, className) {
  item.classList.remove(className);
};

var activeMap = function () {
  showElement(map, 'map--faded');
  showElement(adForm, 'ad-form--disabled');
};

var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

var getRandomItem = function (array) {
  return array[getRandomInt(0, array.length - 1)];
};

var getAdresses = function (types, minX, maxX, minY, maxY) {
  var adresses = [];

  for (var i = 0; i < ADRESS_COUNT; i++) {
    adresses[i] = {
      author: {avatar: 'img/avatars/user' + '0' + (i + 1) + '.png'},
      offer: {type: getRandomItem(types)},
      location: {x: getRandomInt(minX, maxX), y: getRandomInt(minY, maxY)}
    };
  }

  return adresses;
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

adressArray = getAdresses(TYPES, MIN_X, MAX_X, MIN_Y, MAX_Y);

var setDisabledAttribute = function (array) {
  for (var i = 0; i < array.length; i++) {
    array[i].disabled = true;
  }
};

var removeDisabledAttribute = function (array) {
  for (var i = 0; i < array.length; i++) {
    array[i].disabled = false;
  }
};

var setPrice = function (value) {
  adPrice.min = value;
  adPrice.placeholder = value;
};

var onTypeSelect = function () {
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

var onTimeSelect = function (timeIn, timeOut) {
  if (timeIn.value === '12:00') {
    timeOut.options[0].selected = true;
  } else if (timeIn.value === '13:00') {
    timeOut.options[1].selected = true;
  } else if (timeIn.value === '14:00') {
    timeOut.options[2].selected = true;
  }
};

var getElementCoords = function (item, width, height) {

  return Math.round((item.offsetLeft + width / 2)) +
  ', ' + Math.round((item.offsetTop + height));
};

var setTopCoords = function (position) {
  if (position >= (MIN_Y - MAIN_PIN_SIZE) && position <= (MAX_Y - MAIN_PIN_SIZE - MAIN_PIN_TAIL)) {
    return position + 'px';
  } else if (position < MIN_Y) {
    return (MIN_Y - MAIN_PIN_SIZE - MAIN_PIN_TAIL) + 'px';
  } else if (position > (MAX_Y)) {
    return (MAX_Y - MAIN_PIN_SIZE) + 'px';
  }
}

var setLeftCoords = function (position) {
  if (position >= MIN_X && position <= (MAX_X - MAIN_PIN_SIZE)) {
    return position + 'px';
  } else if (position < MIN_X) {
    return MIN_X + 'px';
  } else if (position > (MAX_X - MAIN_PIN_SIZE)) {
    return (MAX_X - MAIN_PIN_SIZE) + 'px';
  }
}

var onMouseDown = function (evt) {
  evt.preventDefault();

  activeMap();

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
    removeDisabledAttribute(adFieldset);
    removeDisabledAttribute(mapFieldset);
    removeDisabledAttribute(mapSelect);
    renderPins(adressArray);
    adTypeSelect.addEventListener('change', onTypeSelect);
    adTimeIn.addEventListener('change', function () {
      onTimeSelect(adTimeIn, adTimeOut);
    });
    adTimeOut.addEventListener('change', function () {
      onTimeSelect(adTimeOut, adTimeIn);
    });

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);

    addressInput.value = getElementCoords(mapMainPin, MAIN_PIN_SIZE, (MAIN_PIN_SIZE + MAIN_PIN_TAIL));
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};

setDisabledAttribute(adFieldset);
setDisabledAttribute(mapFieldset);
setDisabledAttribute(mapSelect);
mapMainPin.addEventListener('mousedown', onMouseDown);

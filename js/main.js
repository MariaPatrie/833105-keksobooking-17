'use strict';

var ADRESS_COUNT = 8;
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var MIN_X = 0;
var MAX_X = document.querySelector('.map').offsetWidth; //1200;
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

/*var onPinClick = function () {
  removeDisabledAttribute(adFieldset);
  removeDisabledAttribute(mapFieldset);
  removeDisabledAttribute(mapSelect);
  activeMap();
  renderPins(adressArray);
  adTypeSelect.addEventListener('change', onTypeSelect);
  adTimeIn.addEventListener('change', function () {
    onTimeSelect(adTimeIn, adTimeOut);
  });
  adTimeOut.addEventListener('change', function () {
    onTimeSelect(adTimeOut, adTimeIn);
  });
  mainMapPin.removeEventListener('click', onPinClick);
};*/

var getElementCoords = function (item, width, height) {

  return Math.round((item.offsetLeft + width / 2)) +
  ', ' + Math.round((item.offsetTop + height));
};

var onMouseDown = function (evt) {
  evt.preventDefault();

  activeMap();

  var startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };

  var onMouseMove = function (evt) {
    evt.preventDefault();

    var shift = {
      x: startCoords.x - evt.clientX,
      y: startCoords.y - evt.clientY
    };

    startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var mapMainPinTop = (mapMainPin.offsetTop - shift.y);
    var mapMainPinLeft = (mapMainPin.offsetLeft - shift.x);

/*    mapMainPin.style.top = (mapMainPin.offsetTop - shift.y) + 'px';
    mapMainPin.style.left = (mapMainPin.offsetLeft - shift.x) + 'px';*/
    if (mapMainPinTop >= MIN_Y && mapMainPinTop <= (MAX_Y - MAIN_PIN_SIZE)) {
      mapMainPin.style.top = mapMainPinTop + 'px';
    } else if (mapMainPinTop < MIN_Y) {
      mapMainPin.style.top = MIN_Y + 'px';
    } else if (mapMainPinTop > (MAX_Y - MAIN_PIN_SIZE)) {
      mapMainPin.style.top = (MAX_Y - MAIN_PIN_SIZE) + 'px';
    }

    if (mapMainPinLeft >= MIN_X && mapMainPinLeft <= (MAX_X - MAIN_PIN_SIZE)) {
      mapMainPin.style.left = mapMainPinLeft + 'px';
    } else if (mapMainPinLeft < MIN_X) {
      mapMainPin.style.left = MIN_X + 'px';
    } else if (mapMainPinLeft > (MAX_X - MAIN_PIN_SIZE)) {
      mapMainPin.style.left = (MAX_X - MAIN_PIN_SIZE) + 'px';
    }

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
//mapMainPin.addEventListener('click', onPinClick);
mapMainPin.addEventListener('mousedown', onMouseDown);

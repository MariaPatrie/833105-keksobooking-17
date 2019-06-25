'use strict';

var ADRESS_COUNT = 8;
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var MIN_X = 0;
var MAX_X = 1200;
var MIN_Y = 130;
var MAX_Y = 630;

var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

var map = document.querySelector('.map');
var similarPinTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');
var similarListElement = document.querySelector('.map__pins');

var adForm = document.querySelector('.ad-form');
var adFieldset = adForm.querySelectorAll('fieldset');
var mapFiltersForm = document.querySelector('.map__filters');
var mapSelect = mapFiltersForm.querySelectorAll('select');
var mapFieldset = mapFiltersForm.querySelectorAll('fieldset');
var mainMapPin = document.querySelector(' .map__pin--main');
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

var onPinClick = function () {
  removeDisabledAttribute(adFieldset);
  removeDisabledAttribute(mapFieldset);
  removeDisabledAttribute(mapSelect);
  activeMap();
  renderPins(adressArray);
  mainMapPin.removeEventListener('click', onPinClick);
};

setDisabledAttribute(adFieldset);
setDisabledAttribute(mapFieldset);
setDisabledAttribute(mapSelect);
mainMapPin.addEventListener('click', onPinClick);
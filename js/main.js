'use strict';

var ADRESS_COUNT = 8;
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var MIN_X = 0;
var MAX_X = 1200;
var MIN_Y = 130;
var MAX_Y = 630;

var PIN_WIDTH = 60;
var PIN_HEIGHT = 60;

var map = document.querySelector('.map');
var similarPinTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');
var similarListElement = document.querySelector('.map__pins');

// --------------------------- 1 ----------------------------
var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

var getRandomItem = function (array) {
  return array[getRandomInt(0, array.length - 1)];
};

var getAdress = function (types, minX, maxX, minY, maxY) {
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

// --------------------------- 2 ----------------------------
var mapActive = function () {
  map.classList.remove('map--faded');
};

// --------------------------- 3 ----------------------------
var adressArray = getAdress(TYPES, MIN_X, MAX_X, MIN_Y, MAX_Y);

var renderPin = function (adress) {
  var pinItem = similarPinTemplate.cloneNode(true);

  pinItem.style.left = (adress.location.x - PIN_WIDTH / 2) + 'px';
  pinItem.style.top = (adress.location.y - PIN_HEIGHT) + 'px';
  pinItem.querySelector('img').src = adress.author.avatar;
  pinItem.querySelector('img').alt = adress.offer.type;

  return pinItem;
};

// --------------------------- 4 ----------------------------
var renderPins = function (adress) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < adress.length; i++) {
    fragment.appendChild(renderPin(adress[i]));
  }

  similarListElement.appendChild(fragment);
};

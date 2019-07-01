'use strict';

(function () {

  var ADRESS_COUNT = 8;

  var getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  var getRandomItem = function (array) {
    return array[getRandomInt(0, array.length - 1)];
  };

  window.getAdresses = function (types, minX, maxX, minY, maxY) {
    var adresses = [];

    for (var i = 0; i < ADRESS_COUNT; i++) {
      adresses[i] = {
        author: {
          avatar: 'img/avatars/user' + '0' + (i + 1) + '.png'
        },
        offer: {
          type: getRandomItem(types)
        },
        location: {
          x: getRandomInt(minX, maxX),
          y: getRandomInt(minY, maxY)
        }
      };
    }

    return adresses;
  };

})();

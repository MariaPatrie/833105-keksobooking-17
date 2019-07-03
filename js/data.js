'use strict';

(function () {

  var ADRESS_COUNT = 8;

  window.getAdresses = function (types, minX, maxX, minY, maxY) {
    var adresses = [];

    for (var i = 0; i < ADRESS_COUNT; i++) {
      adresses[i] = {
        author: {
          avatar: 'img/avatars/user' + '0' + (i + 1) + '.png'
        },
        offer: {
          type: window.utils.getRandomItem(types)
        },
        location: {
          x: window.utils.getRandomInt(minX, maxX),
          y: window.utils.getRandomInt(minY, maxY)
        }
      };
    }

    return adresses;
  };

})();

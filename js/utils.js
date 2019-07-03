'use strict';

(function () {

  window.utils = {
    showElement: function (item, className) {
      item.classList.remove(className);
    },
    getRandomInt: function (min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },
    getRandomItem: function (array) {
      return array[this.getRandomInt(0, array.length - 1)];
    }
  };
  
})();

'use strict';

(function () {

  window.utils = {
    showElement: function (item, className) {
      item.classList.remove(className);
    },
    hideElement: function (item, className) {
      item.classList.add(className);
    }
  };

})();

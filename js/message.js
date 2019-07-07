'use strict';

(function () {
  var main = document.querySelector('.main');
  var successPageTemplate = document.querySelector('#success')
      .content
      .querySelector('.success');
  var errorPageTemplate = document.querySelector('#error')
      .content
      .querySelector('.error');

  window.message = {
    showSuccess: function () {
      var successPage = successPageTemplate.cloneNode(true);
      main.appendChild(successPage);
    },

    showError: function () {
      var errorPage = errorPageTemplate.cloneNode(true);
      main.appendChild(errorPage);
    }
  };
})();

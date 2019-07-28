'use strict';

(function () {

  var main = document.querySelector('main');
  var successPageTemplate = document.querySelector('#success')
      .content
      .querySelector('.success');
  var errorPageTemplate = document.querySelector('#error')
      .content
      .querySelector('.error');

  var closeModal = function () {
    var modal = main.querySelector('.modal');
    modal.remove();
    document.removeEventListener('keydown', onEscPress);
    document.removeEventListener('click', closeModal);
  };

  var onEscPress = function (evt) {
    if (evt.keyCode === window.constants.ESC_KEYCODE) {
      closeModal();
    }
  };

  window.message = {
    showSuccess: function () {
      var successPage = successPageTemplate.cloneNode(true);
      main.appendChild(successPage);
      document.addEventListener('keydown', onEscPress);
      document.addEventListener('click', closeModal);
    },

    showError: function () {
      var errorPage = errorPageTemplate.cloneNode(true);
      main.appendChild(errorPage);
      document.addEventListener('keydown', onEscPress);
      document.addEventListener('click', closeModal);
    }
  };
})();

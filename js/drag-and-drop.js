'use strict';
(function () {

  var urlGet = 'https://js.dump.academy/keksobooking/data';

  window.map.mapMainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    if (!window.map.isActive) {
      window.map.activeMap();
      window.backend.load(urlGet, window.map.onLoadHandler, window.message.showError);
      window.map.isActive = true;
    }

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

      var mapMainPinTop = (window.map.mapMainPin.offsetTop - shift.y);
      var mapMainPinLeft = (window.map.mapMainPin.offsetLeft - shift.x);

      window.map.mapMainPin.style.top = window.map.setTopCoords(mapMainPinTop);
      window.map.mapMainPin.style.left = window.map.setLeftCoords(mapMainPinLeft);

      window.dialogForm.addressInput.value = window.map.getElementCoords(window.map.mapMainPin, window.constants.MAIN_PIN_SIZE, (window.constants.MAIN_PIN_SIZE + window.constants.MAIN_PIN_TAIL));
    };

    var onMouseUp = function () {
      window.dialogForm.activateForm();

      window.dialogForm.addressInput.value = window.map.getElementCoords(window.map.mapMainPin, window.constants.MAIN_PIN_SIZE, (window.constants.MAIN_PIN_SIZE + window.constants.MAIN_PIN_TAIL));

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();

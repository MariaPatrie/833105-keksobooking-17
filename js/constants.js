'use strict';
(function () {

  window.constants = {

    ADRESS_COUNT: 10,
    PIN_WIDTH: 50,
    PIN_HEIGHT: 70,
    DEFAULT_MAP_WIDTH: 1200,
    MIN_X: 0,
    MIN_Y: 130,
    MAX_Y: 630,
    MAIN_PIN_SIZE: 65,
    MAIN_PIN_TAIL: 22,

    PRICE: {
      bungalo: 0,
      flat: 1000,
      house: 5000,
      palace: 10000
    },
    GUESRS_BY_ROOM: {
      1: ['1'],
      2: ['1', '2'],
      3: ['1', '2', '3'],
      100: ['0']
    },
    PLACEMENT_TYPE: {
      BUNGALO: 'Бунгало',
      FLAT: 'Квартира',
      HOUSE: 'Дом',
      PALACE: 'Дворец'
    }
  };

})();

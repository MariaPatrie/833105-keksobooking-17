'use strict';

(function () {

  var PLACEMENT_TYPE = {
    BUNGALO: 'Бунгало',
    FLAT: 'Квартира',
    HOUSE: 'Дом',
    PALACE: 'Дворец'
  };

  var similarCardTemplate = document.querySelector('#card')
    .content
    .querySelector('.map__card');

  window.card = {
    render: function (item) {
      var card = similarCardTemplate.cloneNode(true);

      var cardTitle = card.querySelector('.popup__title');
      cardTitle.textContent = item.offer.title;

      var cardAddress = card.querySelector('.popup__text--address');
      cardAddress.textContent = item.offer.address;

      var cardPrice = card.querySelector('.popup__text--price');
      cardPrice.textContent = item.offer.price + ' ₽/ночь';

      var cardType = card.querySelector('.popup__type');
      cardType.textContent = PLACEMENT_TYPE[item.offer.type.toUpperCase()];

      var cardGuest = card.querySelector('.popup__text--capacity');
      cardGuest.textContent = item.offer.rooms + ' комнаты для ' + item.offer.guests + ' гостей';

      var cardTime = card.querySelector('.popup__text--time');
      cardTime.textContent = 'Заезд после ' + item.offer.checkin + ', выезд до ' + item.offer.checkout;

      var cardFeatures = card.querySelector('.popup__features');
      cardFeatures.textContent = item.offer.features;

      var cardDescription = card.querySelector('.popup__description');
      cardDescription.textContent = item.offer.description;

      var cardPhotos = card.querySelector('.popup__photos');
      cardPhotos.textContent = item.offer.photos;

      var cardAvatar = card.querySelector('.popup__avatar');
      cardAvatar.src = item.author.avatar;

      return card;
    }
  };

})();

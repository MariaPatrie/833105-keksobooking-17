'use strict';

(function () {

  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var similarCardTemplate = document.querySelector('#card')
    .content
    .querySelector('.map__card');

  var setFeatures = function (array) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < array.lenght; i++) {
      var feature = document.createElement('li');
      feature.classList.add('popup__feature');
      var dopClass = 'popup__feature--' + array[i];
      feature.classList.add(dopClass);
      fragment.appendChild(feature);
    }

    return fragment;
  };

  var setPhotos = function (array) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < array.length; i++) {
      var photo = document.createElement('img');
      photo.classList.add('popup__photo');
      photo.src = array[i];
      photo.width = '40';
      photo.height = '40';
      fragment.appendChild(photo);
    }

    return fragment;
  };

  var closeCard = function () {
    window.card.remove();
    document.removeEventListener('keydown', onEscPress);
  };

  var onEscPress = function (evt) {
    if (evt.keyCode === window.constants.ESC_KEYCODE) {
      closeCard();
    }
  };

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
      cardType.textContent = window.constants.PLACEMENT_TYPE[item.offer.type.toUpperCase()];

      var cardGuest = card.querySelector('.popup__text--capacity');
      cardGuest.textContent = item.offer.rooms + ' комнаты для ' + item.offer.guests + ' гостей';

      var cardTime = card.querySelector('.popup__text--time');
      cardTime.textContent = 'Заезд после ' + item.offer.checkin + ', выезд до ' + item.offer.checkout;

      var cardFeatures = card.querySelector('.popup__features');
      cardFeatures.appendChild(setFeatures(item.offer.features));

      var cardDescription = card.querySelector('.popup__description');
      cardDescription.textContent = item.offer.description;

      var cardPhotos = card.querySelector('.popup__photos');
      cardPhotos.appendChild(setPhotos(item.offer.photos));

      var cardAvatar = card.querySelector('.popup__avatar');
      cardAvatar.src = item.author.avatar;

      return card;
    },

    remove: function () {
      var card = document.querySelector('.map__card');
      if (card) {
        card.remove();
      }
      var mapPinActive = document.querySelector('.map__pin--active');
      if (mapPinActive) {
        mapPinActive.classList.remove('map__pin--active');
      }
    },

    showCard: function (item) {
      var cardItem = window.card.render(item);
      window.map.map.insertBefore(cardItem, mapFiltersContainer);
      document.addEventListener('keydown', onEscPress);
      var popupClose = document.querySelector('.popup__close');
      popupClose.addEventListener('click', function () {
        closeCard();
      });
    }
  };

})();

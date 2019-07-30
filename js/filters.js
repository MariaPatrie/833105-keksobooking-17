'use strict';

(function () {

  var housingTypeSelector = document.querySelector('select[name="housing-type"]');
  var housingRoomsSelector = document.querySelector('select[name="housing-rooms"]');
  var housingGuestsSelector = document.querySelector('select[name="housing-guests"]');
  var housingPriceSelector = document.querySelector('select[name="housing-price"]');
  var mapFeatures = document.querySelector('.map__features');

  var housingType;
  var housingRooms;
  var housingPrice;
  var housingGuests;

  var housingFeaturesCheckedValue;
  var housingFeatures;

  var onHousingTypeSelect = function (it) {
    return housingType === 'any' || it.offer.type === housingType;
  };

  var onHousingRoomsSelect = function (it) {
    return isNaN(housingRooms) || it.offer.rooms === housingRooms;
  };

  var onHousingGuestsSelect = function (it) {
    return isNaN(housingGuests) || it.offer.guests === housingGuests;
  };

  var onHousingPriceSelect = function (it) {
    switch (housingPrice) {
      case 'middle':
        return it.offer.price >= 10000 && it.offer.price <= 50000;
      case 'low':
        return it.offer.price < 10000;
      case 'high':
        return it.offer.price > 50000;
      default:
        return true;
    }
  };

  var onHousingFeaturesSelect = function (it) {
    return housingFeatures.every(function (feature) {
      return it.offer.features.includes(feature);
    });
  };

  window.filters = {
    getFilteredData: function (adresses) {
      housingType = housingTypeSelector.value;
      housingRooms = parseInt(housingRoomsSelector.value, 0);
      housingGuests = parseInt(housingGuestsSelector.value, 0);
      housingPrice = housingPriceSelector.value;

      housingFeaturesCheckedValue = Array.from(mapFeatures.querySelectorAll('input:checked'));
      housingFeatures = housingFeaturesCheckedValue.map(function (it) {
        return it.value;
      });

      return adresses
        .filter(onHousingTypeSelect)
        .filter(onHousingRoomsSelect)
        .filter(onHousingGuestsSelect)
        .filter(onHousingPriceSelect)
        .filter(onHousingFeaturesSelect);
    }
  };

})();

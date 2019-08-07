'use strict';

(function () {

  var mapFiltersForm = document.querySelector('.map__filters');
  var housingTypeSelector = mapFiltersForm.querySelector('select[name="housing-type"]');
  var housingRoomsSelector = mapFiltersForm.querySelector('select[name="housing-rooms"]');
  var housingGuestsSelector = mapFiltersForm.querySelector('select[name="housing-guests"]');
  var housingPriceSelector = mapFiltersForm.querySelector('select[name="housing-price"]');
  var mapFeatures = mapFiltersForm.querySelector('.map__features');

  var filterWifi = mapFeatures.querySelector('#filter-wifi');
  var filterDishwasher = mapFeatures.querySelector('#filter-dishwasher');
  var filterParking = mapFeatures.querySelector('#filter-parking');
  var filterWasher = mapFeatures.querySelector('#filter-washer');
  var filterElevator = mapFeatures.querySelector('#filter-elevator');
  var filterConditioner = mapFeatures.querySelector('#filter-conditioner');

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
        return it.offer.price >= window.constants.LOW && it.offer.price <= window.constants.HIGH;
      case 'low':
        return it.offer.price < window.constants.LOW;
      case 'high':
        return it.offer.price > window.constants.HIGH;
      default:
        return true;
    }
  };

  var checkFeatures = function (input, it) {
    return (!input.checked) || (it.offer.features.indexOf(input.value) !== -1);
  };

  var onHousingFeaturesSelect = function (it) {
    return checkFeatures(filterWifi, it) &&
           checkFeatures(filterDishwasher, it) &&
           checkFeatures(filterParking, it) &&
           checkFeatures(filterWasher, it) &&
           checkFeatures(filterElevator, it) &&
           checkFeatures(filterConditioner, it);
  };

  window.filters = {
    getFilteredData: function (adresses) {
      housingType = housingTypeSelector.value;
      housingRooms = parseInt(housingRoomsSelector.value, 0);
      housingGuests = parseInt(housingGuestsSelector.value, 0);
      housingPrice = housingPriceSelector.value;

      return adresses
        .filter(onHousingTypeSelect)
        .filter(onHousingRoomsSelect)
        .filter(onHousingGuestsSelect)
        .filter(onHousingPriceSelect)
        .filter(onHousingFeaturesSelect);
    }
  };

})();

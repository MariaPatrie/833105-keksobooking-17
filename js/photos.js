'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var PHOTO_WIDTH = '70';
  var PHOTO_HEIGHT = '70';
  var PHOTO_ALT = 'Фото жилья';
  var AVATAR_SRC = 'img/muffin-grey.svg';

  var avatarChooser = window.dialogForm.adForm.querySelector('.ad-form__field input[type=file]');
  var previewAvatar = window.dialogForm.adForm.querySelector('.ad-form-header__preview');

  var photoChooser = window.dialogForm.adForm.querySelector('.ad-form__upload input[type=file]');
  var previewPhoto = window.dialogForm.adForm.querySelector('.ad-form__photo');

  var checkedFileType = function (file) {
    return FILE_TYPES.some(function (it) {
      return file.name.toLowerCase().endsWith(it);
    });
  };

  avatarChooser.addEventListener('change', function () {
    var file = avatarChooser.files[0];

    if (checkedFileType) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        previewAvatar.querySelector('img').src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  });

  var loadPhoto = function (file) {
    var reader = new FileReader();

    reader.addEventListener('load', function () {
      var element = document.createElement('img');
      previewPhoto.appendChild(element);

      element.src = reader.result;
      element.width = PHOTO_WIDTH;
      element.height = PHOTO_HEIGHT;
      element.alt = PHOTO_ALT;
    });

    reader.readAsDataURL(file);
  };

  photoChooser.addEventListener('change', function () {
    var file = photoChooser.files[0];
    loadPhoto(file);
  });

  window.photos = {
    deletePhotos: function () {
      previewAvatar.src = AVATAR_SRC;
      while (previewPhoto.firstChild) {
        previewPhoto.firstChild.remove();
      }
    }
  };
})();

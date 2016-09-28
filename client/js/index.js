var dataURItoBlob;

dataURItoBlob = function(dataURI) {
  console.log(dataURI)
  const _dataURI = dataURI._result;
  console.log(_dataURI)
  var byteString, i, ia, mimeString;
  byteString = void 0;
  if (_dataURI.split(',')[0].indexOf('base64') >= 0) {
    byteString = atob(_dataURI.split(',')[1]);
  } else {
    byteString = unescape(_dataURI.split(',')[1]);
  }
  mimeString = _dataURI.split(',')[0].split(':')[1].split(';')[0];
  ia = new Uint8Array(byteString.length);
  i = 0;
  while (i < byteString.length) {
    ia[i] = byteString.charCodeAt(i);
    i++;
  }
  return new Blob([ia], {
    type: mimeString
  });
};

 var toDataUrl = function(cover, callback) {
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  xhr.onload = function() {
    var reader = new FileReader();
    reader.onloadend = function() {
      callback(reader.result);
    }
    reader.readAsDataURL(xhr.response);
  };
  xhr.open('GET', cover);
  xhr.send();
}

var imgToData = function toDataUrl(src, callback, outputFormat) {
  var img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = function() {
    var canvas = document.createElement('CANVAS');
    var ctx = canvas.getContext('2d');
    var dataURL;
    canvas.height = this.height;
    canvas.width = this.width;
    ctx.drawImage(this, 0, 0);
    dataURL = canvas.toDataURL(outputFormat);
    callback(dataURL);
  };
  img.src = src;
  if (img.complete || img.complete === undefined) {
    img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
    img.src = src;
  }
}

var uploader = new Slingshot.Upload("floorPlanUploader");
var imageUpload = new Slingshot.Upload("bookImages");

Template.index.events({
  "change #floorPlanFileInput": function(event) {
    var file = event.currentTarget.files[0];
    uploader.send(file, function(err, url) {
      if (err) {
        console.log("Error uploading", err);
      }
      else {
        console.log(url)
        const book = ePub(url);
        console.log(book.getMetadata())
        const cover = book.coverUrl().then(dataURItoBlob(this), failCallbacks)
        console.log(cover)
        // const blob = dataURItoBlob(cover)

          imageUpload.send(blob, function(err, data) {
            if (err) {
              console.log("Error uploading", err);
            }
            else {
              console.log(data)
            }
          })

        // toDataUrl(cover._result, function(base64Img) {
        //   console.log(base64Img);

        //   imageUpload.send(base64Img, function(err, data) {
        //     if (err) {
        //       console.log("Error uploading", err);
        //     }
        //     else {
        //       console.log(data)
        //     }
        //   })
        // });



        Meteor.call("saveUpload", url);
      }
    });
  },
});

Template.index.helpers({
  uploading: function() {
    return Math.round(uploader.progress() * 100) > 0;
  },
  progress: function() {
    return Math.round(uploader.progress() * 100);
  },
});

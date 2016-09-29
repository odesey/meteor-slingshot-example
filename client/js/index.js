var convertURIToImageData = function(URI) {
  return new Promise(function(resolve, reject) {
    if (URI == null) return reject();
    var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d'),
        image = new Image();
    image.addEventListener('load', function() {
      canvas.width = image.width;
      canvas.height = image.height;
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(context.getImageData(0, 0, canvas.width, canvas.height));
    }, false);
    image.src = URI;
  });
}

var dataUriToFile = function(dataUri, fileName) {
  // https://en.wikipedia.org/wiki/Data_URI_scheme
  // create a pattern to match the data uri
  var patt = /^data:([^\/]+\/[^;]+)?(;charset=([^;]+))?(;base64)?,/i,
    matches = dataUri.match(patt);
  if (matches == null){
    throw new Error("data: uri did not match scheme")
  }
  var 
    prefix = matches[0],
    contentType = matches[1],
    // var charset = matches[3]; -- not used.
    isBase64 = matches[4] != null,
    // remove the prefix
    encodedBytes = dataUri.slice(prefix.length),
    // decode the bytes
    decodedBytes = isBase64 ? atob(encodedBytes) : encodedBytes,
    // return the file object
    props = {};
  if (contentType) {
    props.type = contentType;
  }
  return new File([decodedBytes], fileName, props);
}

var dataURItoBlob = function(dataURI) {
  console.log(dataURI)

  var byteString, i, ia, mimeString;
  byteString = void 0;
  if (dataURI.split(',')[0].indexOf('base64') >= 0) {
    byteString = atob(dataURI.split(',')[1]);
  } else {
    byteString = unescape(dataURI.split(',')[1]);
  }
  mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
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
        const cover = book.coverUrl();
        console.log(cover)

        cover.then(function () {
          console.log('cover loaded')
          console.log(cover)
          // Cloudinary._upload_file("base64", {}, callback)

          toDataUrl(cover._result, function(base64Img) {

            Cloudinary._upload_file( base64Img,{
              folder: 'Books',
              quality: 'jpegmini',
              // resource_type: 'raw',
              // data: "image/jpeg;base64..."
            },function(err, res){ 
              if (err){ 
                console.log(err); 
              } else { 
                console.log(res);
                 } 
               });
          });


        })


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

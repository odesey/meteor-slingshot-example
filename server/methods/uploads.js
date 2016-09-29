Meteor.methods({
  deleteUpload: function(id) {
    if (!this.userId) {
      throw new Meteor.Error("unauthorized", "Unauthorized");
    }

    var upload = Uploads.findOne({_id: id, owner: this.userId});

    if (!upload) {
      throw new Meteor.Error("missing-data", "Upload not found");
    }

    const _key = 'Books/' + upload.key
    // Delete from s3
    var resp = S3.deleteObjectSync({
      Bucket: Meteor.settings.S3Bucket,
      Key: _key,
    });

    // Delete from collection
    Uploads.remove({_id: id});
  },

  saveUpload: function(url) {
    if (!this.userId) {
      throw new Meteor.Error("unauthorized", "Unauthorized");
    }

    var split = url.split("/");

    Uploads.insert({
      owner: this.userId,
      url: url,
      key: split[split.length - 1],
    });
  },
  cloudsave() {
    Cloudinary.upload( "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==",{
      folder: 'Books',
      // quality: 'jpegmini',
      // resource_type: 'raw',
      // data: "image/jpeg;base64..."
    },function(err, res){ 
      if (err){ 
        console.log(err); 
      } else { 
        console.log(res);
         } 
       });
  }
});

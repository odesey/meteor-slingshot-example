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
});

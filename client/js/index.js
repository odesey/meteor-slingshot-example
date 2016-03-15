var uploader = new Slingshot.Upload("floorPlanUploader");

Template.index.events({
  "change #floorPlanFileInput": function(event) {
    var file = event.currentTarget.files[0];
    uploader.send(file, function(err, url) {
      if (err) {
        console.log("Error uploading", err);
      }
      else {
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

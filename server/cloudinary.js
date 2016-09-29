Cloudinary.config({
  cloud_name: Meteor.settings.CloudinaryCloudName,
  api_key: Meteor.settings.CloudinaryKey,
  api_secret: Meteor.settings.CloudinarySecret
});

Cloudinary.rules['delete'] = function() {
  // this.userId === 'my_user_id';
  return this.public_id;
};

Cloudinary.rules.signature = function() {
  // return this.userId === 'my_user_id';
  return true
};

Cloudinary.rules.private_resource = function() {
  return this.userId === 'my_user_id';
};

Cloudinary.rules.download_url = function() {
  return this.userId === 'my_user_id';
};



Slingshot.fileRestrictions('bookImages', {
  allowedFileTypes: null,
  maxSize: 5000000,
});

Slingshot.createDirective('bookImages', Slingshot.Cloudinary, {
  authorize() {
    if (!this.userId) {
      const message = 'Please login before posting files';
      throw new Meteor.Error('Login Required', message);
    }

    return true;
  },

  key() {
    return Meteor.uuid();
  },
  folder: 'Books',
});
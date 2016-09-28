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
  folder: 'Books'
});
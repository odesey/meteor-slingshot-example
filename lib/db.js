Schemas = {};

Schemas.Upload = new SimpleSchema({
  owner: {
    type: String,
  },
  url: {
    type: String,
  },
  key: {
    type: String,
  },
});

Uploads = new Mongo.Collection("uploads");

Uploads.attachSchema(Schemas.Upload);

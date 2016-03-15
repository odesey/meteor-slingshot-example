Router.route("/", {
  name: "index",
  layoutTemplate: "layout",
  waitOn: function() {
    return Meteor.subscribe("uploads");
  },
  action: function() {
    if (Meteor.user()) {
      this.render("index");
    }
    else {
      this.render("loginPrompt");
    }
  },
});

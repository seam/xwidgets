package("org.jboss.seam.xwidgets");

org.jboss.seam.xwidgets.Identity = function() {
  xw.NonVisual.call(this);
 
  // The remote identity bean  
  this.identityBean = null;
  
  this.loggedIn = false;
};

org.jboss.seam.xwidgets.Identity.prototype = new xw.NonVisual();
    
org.jboss.seam.xwidgets.Identity.prototype.open = function() {
  if (this.identityBean === null) {
    this.identityBean = Seam.createBean("org.jboss.seam.xwidgets.action.IdentityAction");
  }
  xw.EL.registerResolver(this);
};

org.jboss.seam.xwidgets.Identity.prototype.openIdLogin = function(provider, url) {
  var that = this;
  var cb = function(url) { that.openIdCallback(url); };
  this.identityBean.openIdLogin(provider, url, cb);
};

org.jboss.seam.xwidgets.Identity.prototype.openIdCallback = function(url) {
  alert("OpenID url to authenticate: " + url);
};

org.jboss.seam.xwidgets.Identity.prototype.login = function(username, password) {
  var that = this;
  var cb = function(r) { that.loginCallback(r); };
  this.identityBean.login(username, password, cb);
};

org.jboss.seam.xwidgets.Identity.prototype.logout = function() {
  var that = this;
  var cb = function() { 
    that.loggedIn = false;
    xw.EL.notify("identity");
  };
  this.identityBean.logout(cb);
};

org.jboss.seam.xwidgets.Identity.prototype.loginCallback = function(result) {
  if (result === "success") {
    this.loggedIn = true;
    xw.EL.notify("identity");
    xw.Event.fire("org.jboss.seam.identity.loggedIn");
  }
};

org.jboss.seam.xwidgets.Identity.prototype.canResolve = function(rootName) {
  return rootName === "identity";
};

org.jboss.seam.xwidgets.Identity.prototype.resolve = function(rootName) {
  if (rootName === "identity") {
    return this;
  }
};

org.jboss.seam.xwidgets.Identity.prototype.toString = function() {
  return "org.jboss.seam.xwidgets.Identity[]";
};


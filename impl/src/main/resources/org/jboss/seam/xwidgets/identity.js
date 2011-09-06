package("org.jboss.seam.xwidgets");

org.jboss.seam.xwidgets.Identity = function() {
  xw.NonVisual.call(this);
 
  // The remote identity bean  
  this.identityBean = null;
  
  this.loggedIn = false;
  this.attribs = {};
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
  var cb = function(redirectUrl) { that.openIdLoginCallback(redirectUrl); };
  this.identityBean.openIdLogin(provider, url, cb);
};

org.jboss.seam.xwidgets.Identity.prototype.openIdLoginCallback = function(url) {
  window.xwIdentityWidget = this;
  
  window.xwHandleOpenIdResponse = function(params) {
    window.xwIdentityWidget.openIdResponseCallback(params);
  };

  window.open(url, 'openid_popup', 'width=450,height=500');
};

org.jboss.seam.xwidgets.Identity.prototype.openIdResponseCallback = function(params) {
  window.xwIdentityWidget = null;
  window.xwHandleOpenIdResponse = null;

  var that = this;
  var cb = function(r) { that.loginCallback(r); };
  this.identityBean.processOpenIdResponse(unescape(params), cb);
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
  if (result.success) {
    this.loggedIn = true;
    
    this.attribs.firstname = result.getAttributes().get("firstName");
    this.attribs.lastname = result.getAttributes().get("lastName");
    this.attribs.email = result.getAttributes().get("email");
    
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


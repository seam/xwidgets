package("org.jboss.seam.xwidgets");

org.jboss.seam.xwidgets.Identity = function() {
  xw.NonVisual.call(this);
 
  // The remote identity bean  
  this.identityBean = null;
};

org.jboss.seam.xwidgets.Identity.prototype = new xw.NonVisual();
    
org.jboss.seam.xwidgets.Identity.prototype.open = function() {

};

org.jboss.seam.xwidgets.Identity.prototype.login = function(username, password) {
  alert("identity.login() called");
};

org.jboss.seam.xwidgets.Identity.prototype.toString = function() {
  return "org.jboss.seam.xwidgets.Identity[]";
};



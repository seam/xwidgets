package("org.jboss.seam.xwidgets");

org.jboss.seam.xwidgets.RemoteMethodELResolver = function() {
  xw.NonVisual.call(this);
  this.registerProperty("remoteClass");
  this.registerProperty("remoteMethod");
  this.registerProperty("qualifiers");
  this.registerProperty("refresh", 0);
  
  // The EL variable name that this resolver will bind to
  this.registerProperty("elVariableName");
  
  // The remote bean  
  this.bean = null;
  
  // The returned value from the remote bean method
  this.value = null;
};

org.jboss.seam.xwidgets.RemoteMethodELResolver.prototype = new xw.NonVisual();
    
org.jboss.seam.xwidgets.RemoteMethodELResolver.prototype.open = function() {
  xw.EL.registerResolver(this);

  // TODO add qualifier support
  if (this.bean === null) {
    this.bean = Seam.createBean(this.remoteClass);
  }

  var that = this;
  var cb = function(result) { that.callback(result); };
  this.bean[this.remoteMethod](cb);
};

org.jboss.seam.xwidgets.RemoteMethodELResolver.prototype.canResolve = function(rootName) {
  return rootName == this.elVariableName;
};

org.jboss.seam.xwidgets.RemoteMethodELResolver.prototype.resolve = function(rootName) {
  return rootName == this.elVariableName ? this.value : undefined;
};

org.jboss.seam.xwidgets.RemoteMethodELResolver.prototype.callback = function(result) {
  this.value = result;
  xw.EL.notify(this.elVariableName);
};

org.jboss.seam.xwidgets.RemoteMethodELResolver.prototype.destroy = function() {
  xw.EL.unregisterResolver(this);
};

org.jboss.seam.xwidgets.RemoteMethodELResolver.prototype.toString = function() {
  return "org.jboss.seam.xwidgets.RemoteMethodELResolver[" + this.remoteClass + "." + this.remoteMethod + "]";
};



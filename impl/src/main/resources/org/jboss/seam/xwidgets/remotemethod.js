package("org.jboss.seam.xwidgets");

org.jboss.seam.xwidgets.RemoteMethod = function() {
  xw.NonVisual.call(this);
  this._className = "org.jboss.seam.xwidgets.RemoteMethod";
  this.registerProperty("remoteClass");
  this.registerProperty("remoteMethod");
  this.registerProperty("qualifiers");
  this.registerProperty("refresh", 0);
  
  // The EL variable name that this resolver will bind to
  this.registerProperty("elVariableName");
  this.registerProperty("enabled", true);
  
  // The remote bean  
  this.bean = null;
  
  // The returned value from the remote bean method
  this.value = null;
  
  this.invokeTimestamp = null;
};

org.jboss.seam.xwidgets.RemoteMethod.prototype = new xw.NonVisual();
    
org.jboss.seam.xwidgets.RemoteMethod.prototype.open = function() {
  // TODO add qualifier support
  if (this.bean === null) {
    this.bean = Seam.createBean(this.remoteClass);
  }

  if (xw.Sys.isDefined(this.elVariableName)) {
    xw.EL.registerResolver(this);
  }
    
  this.invoke();
};

org.jboss.seam.xwidgets.RemoteMethod.prototype.invoke = function() {
  if (!this.enabled) return;

  var that = this;
  var cb = function(result) { that.callback(result); };
  this.invokeTimestamp = new Date().getTime();  

  if (arguments.length == 0) {
    this.bean[this.remoteMethod](cb);
  } else {
    Seam.execute(this.bean, this.remoteMethod, arguments, cb);
  }
};

org.jboss.seam.xwidgets.RemoteMethod.prototype.callback = function(result) {
  this.value = result;
  
  if (xw.Sys.isDefined(this.elVariableName)) {
    xw.EL.notify(this.elVariableName);
  }
};

org.jboss.seam.xwidgets.RemoteMethod.prototype.setElVariableName = function(varName) {
  xw.EL.unregisterResolver(this);
  
  if (xw.Sys.isDefined(this.elVariableName)) {
    xw.EL.registerResolver(this);
  }
  
  this.elVariableName = varName;
};

org.jboss.seam.xwidgets.RemoteMethod.prototype.canResolve = function(rootName) {
  return rootName == this.elVariableName;
};

org.jboss.seam.xwidgets.RemoteMethod.prototype.resolve = function(rootName) {
  if (this.refresh === 0) {
    this.invoke();
    return undefined;
  } else {
    if (this.invokeTimestamp === null || new Date().getTime() > this.invokeTimestamp + (this.refresh * 1000)) {
      // The refresh period has expired, requery the method
      this.invoke();
      return undefined;
    } else {
      return rootName == this.elVariableName ? this.value : undefined;
    }
  }
};

org.jboss.seam.xwidgets.RemoteMethod.prototype.destroy = function() {
  xw.EL.unregisterResolver(this);
};

org.jboss.seam.xwidgets.RemoteMethod.prototype.toString = function() {
  return "org.jboss.seam.xwidgets.RemoteMethod[" + this.remoteClass + "." + this.remoteMethod + "]";
};



package("org.jboss.seam.xwidgets");

org.jboss.seam.xwidgets.RemoteMethodDataSet = function() {
  xw.Widget.call(this);
  this.registerProperty("remoteClass");
  this.registerProperty("remoteMethod");
  this.registerProperty("qualifiers");
  this.registerProperty("dataSource");
  this.bean = null;
  this.values = null;
};

org.jboss.seam.xwidgets.RemoteMethodDataSet.prototype = new xw.Widget();
  
org.jboss.seam.xwidgets.RemoteMethodDataSet.prototype.render = function(container) { /* NOOP */};
  
org.jboss.seam.xwidgets.RemoteMethodDataSet.prototype.open = function() {
  // TODO add qualifier support
  if (this.bean === null) {
    this.bean = Seam.createBean(this.remoteClass);
  }

  var that = this;
  var cb = function(result) { that.callback(result); };
  this.bean[this.remoteMethod](cb);
};

org.jboss.seam.xwidgets.RemoteMethodDataSet.prototype.callback = function(result) {
  this.values = result;
  if (this.dataSource != null) {
    this.dataSource.notify();
  }
};

org.jboss.seam.xwidgets.RemoteMethodDataSet.prototype.isActive = function() {
  return this.values !== null;
};

org.jboss.seam.xwidgets.RemoteMethodDataSet.prototype.toString = function() {
  return "RemoteMethodDataSet[" + this.remoteClass + "." + this.remoteMethod + "]";
};



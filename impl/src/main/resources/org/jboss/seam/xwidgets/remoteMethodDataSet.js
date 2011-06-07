package("org.jboss.seam.xwidgets");

org.jboss.seam.xwidgets.RemoteMethodDataSet = function() {
  xw.Widget.call(this);
  this.registerProperty("remoteClass");
  this.registerProperty("remoteMethod");
  this.registerProperty("qualifiers");
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

  this.bean[this.remoteMethod](this.callback);
};

org.jboss.seam.xwidgets.RemoteMethodDataSet.prototype.callback = function(result) {
  alert("Got results: " + result);
};

org.jboss.seam.xwidgets.RemoteMethodDataSet.prototype.toString = function() {
  return "RemoteMethodDataSet[" + this.remoteClass + "." + this.remoteMethod + "]";
};

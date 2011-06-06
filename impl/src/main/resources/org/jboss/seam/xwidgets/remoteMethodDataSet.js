package("org.jboss.seam.xwidgets");

org.jboss.seam.xwidgets.RemoteMethodDataSet = function() {
  xw.Widget.call(this);
  this.registerProperty("remoteClass");
  this.registerProperty("remoteMethod");
  this.registerProperty("qualifiers");
};

org.jboss.seam.xwidgets.RemoteMethodDataSet.prototype = new xw.Widget();
  
org.jboss.seam.xwidgets.RemoteMethodDataSet.prototype.render = function(container) { /* NOOP */};
  

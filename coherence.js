(function (){
  'use strict';

  module.exports = {
    DefaultCacheServer: Java.type('com.tangosol.net.DefaultCacheServer'),
    CacheFactory: Java.type('com.tangosol.net.CacheFactory'),
    HealthMBeanFactory: Java.type('com.oracle.coherence.k8s.HealthMBeanFactory'),
  };
}());

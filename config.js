(function (){
  'use strict';

  var session        = require("express-session"),
      CacheFactory   = require('./coherence').CacheFactory,
      CoherenceStore = require('./connect-coherence')(session),
      RedisStore     = require('connect-redis')(session);

  module.exports = {
    session: {
      name: 'md.sid',
      secret: 'sooper secret',
      resave: false,
      saveUninitialized: true
    },

    session_coherence: {
      store: new CoherenceStore({cache: 'sessions'}),
      name: 'md.sid',
      secret: 'sooper secret',
      resave: false,
      saveUninitialized: true
    },

    session_redis: {
      store: new RedisStore({host: "session-db"}),
      name: 'md.sid',
      secret: 'sooper secret',
      resave: false,
      saveUninitialized: true
    }
  };
}());

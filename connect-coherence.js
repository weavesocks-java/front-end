/*!
 * Connect - Coherence
 * Copyright(c) 2019 Aleks Seovic <aleks@seovic.com>
 * MIT Licensed
 */

var CacheFactory = require("./coherence").CacheFactory

module.exports = function(session) {
  const Store = session.Store

  const noop = () => {}

  class CoherenceStore extends Store {
    constructor(options = {}) {
      super(options)
      this.serializer = options.serializer || JSON
      this.cache = CacheFactory.getCache(options.cache || 'sessions')
      this.ttl = options.ttl || 86400 // One day in seconds.
      this.disableTouch = options.disableTouch || false
    }

    get(sid, cb = noop) {
      debugger;
      let future = this.cache.async().get(sid).whenCompleteAsync(function(data, err) {
        debugger;
        console.log("CoherenceStore.get: " + sid + " => " + data + ", " + err)
        if (!data) return cb(err)

        let result
        try {
          result = this.serializer.parse(data)
        } catch (err) {
          return cb(err)
        }
        return cb(null, result)
      });
      console.log("CoherenceStore.get: future = " + future)
    }

    set(sid, sess, cb = noop) {
      let data
      try {
        data = this.serializer.stringify(sess)
        console.log("CoherenceStore.set: " + sid + " <= " + data)
      } catch (er) {
        return cb(er)
      }

      debugger;
      let future = this.cache.async().put(sid, data, this.ttl).whenCompleteAsync(function(data, err) {
        console.log("CoherenceStore.set: " + data + ", " + err)
      });
      console.log("CoherenceStore.set: future = " + future)
    }

    touch(sid, sess, cb = noop) {
      console.log("CoherenceStore.touch: " + sid)
      if (this.disableTouch) return cb()

      // Since we need to update the expires value on the cookie,
      // we update the whole session object.
      this.set(sid, sess, cb)
    }

    destroy(sid, cb = noop) {
      console.log("CoherenceStore.destroy: " + sid)
      this.cache.remove(sid)
      cb()
    }

    clear(cb = noop) {
      console.log("CoherenceStore.clear")
      this.cache.clear()
      cb()
    }

    length(cb = noop) {
      console.log("CoherenceStore.length")
      return cb(null, this.cache.size())
    }

    ids(cb = noop) {
      console.log("CoherenceStore.ids")
      return cb(null, this.cache.keySet())
    }

    all(cb = noop) {
      console.log("CoherenceStore.all")
    }
  }

  return CoherenceStore
}
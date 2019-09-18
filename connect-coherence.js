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
      let data = this.cache.get(sid);
      console.log("CoherenceStore.get: " + sid + " => " + data)
      if (!data) return cb()

      let result
      try {
        result = this.serializer.parse(data)
      } catch (err) {
        return cb(err)
      }
      return cb(null, result)
    }

    set(sid, sess, cb = noop) {
      let data
      try {
        data = this.serializer.stringify(sess)
        console.log("CoherenceStore.set: " + sid + " <= " + data)
      } catch (er) {
        return cb(er)
      }

      this.cache.put(sid, data, this.ttl)
    }

    touch(sid, sess, cb = noop) {
      if (this.disableTouch) return cb()

      // Since we need to update the expires value on the cookie,
      // we update the whole session object.
      this.set(sid, sess, cb)
    }

    destroy(sid, cb = noop) {
      this.cache.remove(sid)
      cb()
    }

    clear(cb = noop) {
      this.cache.clear()
      cb()
    }

    length(cb = noop) {
      return cb(null, this.cache.size())
    }

    ids(cb = noop) {
      return cb(null, this.cache.keySet())
    }

    all(cb = noop) {
    }
  }

  return CoherenceStore
}
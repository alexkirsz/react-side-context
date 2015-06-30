export default class Context {
  constructor(keys, parent) {
    this._keys = keys;
    this._parent = parent;

    this._subscriptions = {};
    this._values = {};
    keys.forEach(key => {
      this._subscriptions[key] = [];
    });
  }

  broadcastsKey(key) {
    return this._keys.indexOf(key) !== -1;
  }

  getValue(key) {
    if (this.broadcastsKey(key)) {
      return this._values[key];
    } else {
      return this._parent.getValue(key);
    }
  }

  subscribe(key, callback) {
    if (this.broadcastsKey(key)) {
      this._subscriptions[key].push(callback);
      return () => {
        const idx = this._subscriptions[key].indexOf(callback);
        if (idx !== -1) {
          this._subscriptions[key].splice(idx, 1);
          return true;
        }
        return false;
      };
    } else {
      return this._parent.subscribe(key, callback);
    }
  }

  broadcast(map) {
    for (let key in map) {
      if (!this.broadcastsKey(key)) {
        throw new Error(
          `Cannot broadcast \`${key}\`: key not present in keys.`
        );
      }
      this._values[key] = map[key];
      this._subscriptions[key].forEach(callback => callback(map[key]));
    }
  }
}

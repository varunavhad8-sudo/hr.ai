const mongoose = require('mongoose');

// Global in-memory storage for mock database
const memoryStore = {
  User: [],
  Candidate: [],
  Subscription: [],
  UsageLog: []
};

// Custom query wrapper compatible with Mongoose chainable APIs
class MockQuery {
  constructor(promise) {
    this.promise = promise;
  }
  sort() {
    return this;
  }
  select() {
    return this;
  }
  populate() {
    return this;
  }
  then(onFulfilled, onRejected) {
    return this.promise.then(onFulfilled, onRejected);
  }
  catch(onRejected) {
    return this.promise.catch(onRejected);
  }
}

// Map helper to generate model instance with toObject() capability
const makeModelInstance = (modelName, data) => {
  if (!data) return null;
  const instance = { ...data };
  if (!instance._id) {
    instance._id = 'mock-id-' + Math.random().toString(36).substr(2, 9);
  }
  instance.createdAt = instance.createdAt || new Date();
  instance.updatedAt = instance.updatedAt || new Date();
  
  // Custom mock toObject function
  instance.toObject = function() {
    const copy = { ...this };
    delete copy.toObject;
    return copy;
  };
  
  // Custom save function
  instance.save = async function() {
    const idx = memoryStore[modelName].findIndex(x => String(x._id) === String(this._id));
    if (idx !== -1) {
      memoryStore[modelName][idx] = { ...this };
    } else {
      memoryStore[modelName].push({ ...this });
    }
    return this;
  };

  return instance;
};

const enableMockDB = () => {
  console.log('[mockDb] Injecting High-Fidelity Mongoose In-Memory Database Fallback...');

  // Override mongoose.connect
  mongoose.connect = async () => {
    console.log('[mockDb] Simulated successful MongoDB connection to in-memory store.');
    return { connection: { host: 'localhost-in-memory' } };
  };

  // 1. Model.find
  mongoose.Model.find = function(query) {
    const modelName = this.modelName;
    if (!memoryStore[modelName]) memoryStore[modelName] = [];
    
    let results = [...memoryStore[modelName]];
    if (query) {
      results = results.filter(item => {
        for (const key in query) {
          if (key === 'userId' || key === 'firebaseUid' || key === '_id') {
            if (String(item[key]) !== String(query[key])) return false;
          } else if (item[key] !== query[key]) {
            return false;
          }
        }
        return true;
      });
    }
    return new MockQuery(Promise.resolve(results.map(x => makeModelInstance(modelName, x))));
  };

  // 2. Model.findOne
  mongoose.Model.findOne = function(query) {
    const modelName = this.modelName;
    if (!memoryStore[modelName]) memoryStore[modelName] = [];

    // Default return for Subscriptions in E2E tests
    if (modelName === 'Subscription' && memoryStore[modelName].length === 0) {
      const defaultSub = makeModelInstance(modelName, { userId: query.userId, plan: 'free' });
      memoryStore[modelName].push(defaultSub);
    }

    let results = [...memoryStore[modelName]];
    if (query) {
      results = results.filter(item => {
        for (const key in query) {
          if (query[key] && typeof query[key] === 'object' && query[key]._id) {
            if (String(item[key]) !== String(query[key]._id)) return false;
          } else if (key === 'userId' || key === 'firebaseUid' || key === '_id') {
            if (String(item[key]) !== String(query[key])) return false;
          } else if (item[key] !== query[key]) {
            return false;
          }
        }
        return true;
      });
    }
    const found = results[0] ? makeModelInstance(modelName, results[0]) : null;
    return new MockQuery(Promise.resolve(found));
  };

  // 3. Model.create
  mongoose.Model.create = function(data) {
    const modelName = this.modelName;
    if (!memoryStore[modelName]) memoryStore[modelName] = [];
    
    const instance = makeModelInstance(modelName, data);
    memoryStore[modelName].push(instance);
    return Promise.resolve(instance);
  };

  // 4. Model.findOneAndUpdate
  mongoose.Model.findOneAndUpdate = function(query, update, options = {}) {
    const modelName = this.modelName;
    if (!memoryStore[modelName]) memoryStore[modelName] = [];

    let results = [...memoryStore[modelName]];
    results = results.filter(item => {
      for (const key in query) {
        if (key === 'userId' || key === 'firebaseUid' || key === '_id' || key === 'month') {
          if (String(item[key]) !== String(query[key])) return false;
        } else if (item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    });

    let item = results[0];
    if (!item) {
      if (options.upsert) {
        const newItemData = { ...query };
        if (update.$inc) {
          for (const key in update.$inc) {
            newItemData[key] = (newItemData[key] || 0) + update.$inc[key];
          }
        }
        if (update.$set) {
          for (const key in update.$set) {
            newItemData[key] = update.$set[key];
          }
        }
        for (const key in update) {
          if (key !== '$inc' && key !== '$set') {
            newItemData[key] = update[key];
          }
        }
        const instance = makeModelInstance(modelName, newItemData);
        memoryStore[modelName].push(instance);
        return new MockQuery(Promise.resolve(instance));
      }
      return new MockQuery(Promise.resolve(null));
    }

    if (update.$inc) {
      for (const key in update.$inc) {
        item[key] = (item[key] || 0) + update.$inc[key];
      }
    }
    if (update.$set) {
      for (const key in update.$set) {
        item[key] = update.$set[key];
      }
    }
    for (const key in update) {
      if (key !== '$inc' && key !== '$set') {
        item[key] = update[key];
      }
    }
    item.updatedAt = new Date();
    const updatedInstance = makeModelInstance(modelName, item);
    const idx = memoryStore[modelName].findIndex(x => String(x._id) === String(item._id));
    if (idx !== -1) {
      memoryStore[modelName][idx] = updatedInstance;
    }
    return new MockQuery(Promise.resolve(updatedInstance));
  };

  // 5. Model.deleteOne
  mongoose.Model.deleteOne = function(query) {
    const modelName = this.modelName;
    if (!memoryStore[modelName]) memoryStore[modelName] = [];

    const initialLength = memoryStore[modelName].length;
    memoryStore[modelName] = memoryStore[modelName].filter(item => {
      for (const key in query) {
        if (key === '_id' || key === 'userId') {
          if (String(item[key]) !== String(query[key])) return true;
        } else if (item[key] !== query[key]) {
          return true;
        }
      }
      return false;
    });
    return new MockQuery(Promise.resolve({ deletedCount: initialLength - memoryStore[modelName].length }));
  };

  // 6. Model.deleteMany
  mongoose.Model.deleteMany = function(query) {
    const modelName = this.modelName;
    if (!memoryStore[modelName]) memoryStore[modelName] = [];
    
    const initialLength = memoryStore[modelName].length;
    memoryStore[modelName] = [];
    return new MockQuery(Promise.resolve({ deletedCount: initialLength }));
  };
};

module.exports = { enableMockDB };

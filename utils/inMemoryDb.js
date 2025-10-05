// In-memory database implementation for containerized deployment
class InMemoryDB {
  constructor() {
    this.collections = {};
    this.initializeData();
  }

  initializeData() {
    // Initialize with sample data
    this.collections.tours = [
      {
        _id: '1',
        name: 'The Forest Hiker',
        duration: 5,
        maxGroupSize: 25,
        difficulty: 'easy',
        ratingsAverage: 4.7,
        ratingsQuantity: 37,
        price: 397,
        summary: 'Breathtaking hike through the Canadian Banff National Park',
        description: 'Experience the beauty of the Canadian wilderness',
        imageCover: 'tour-1-cover.jpg',
        images: ['tour-1-1.jpg', 'tour-1-2.jpg', 'tour-1-3.jpg'],
        startDates: ['2024-04-25', '2024-07-20', '2024-10-05'],
        startLocation: {
          description: 'Banff, Canada',
          coordinates: [-115.570154, 51.178456]
        },
        locations: []
      },
      {
        _id: '2',
        name: 'The Sea Explorer',
        duration: 7,
        maxGroupSize: 15,
        difficulty: 'medium',
        ratingsAverage: 4.8,
        ratingsQuantity: 23,
        price: 497,
        summary: 'Exploring the jaw-dropping US west coast by foot and by boat',
        description: 'Amazing coastal adventure',
        imageCover: 'tour-2-cover.jpg',
        images: ['tour-2-1.jpg', 'tour-2-2.jpg', 'tour-2-3.jpg'],
        startDates: ['2024-06-19', '2024-07-20', '2024-08-18'],
        startLocation: {
          description: 'Miami, USA',
          coordinates: [-80.185942, 25.774772]
        },
        locations: []
      },
      {
        _id: '3',
        name: 'The Snow Adventurer',
        duration: 4,
        maxGroupSize: 10,
        difficulty: 'difficult',
        ratingsAverage: 4.5,
        ratingsQuantity: 13,
        price: 997,
        summary: 'Exciting adventure in the snow with snowboarding and skiing',
        description: 'Winter sports paradise',
        imageCover: 'tour-3-cover.jpg',
        images: ['tour-3-1.jpg', 'tour-3-2.jpg', 'tour-3-3.jpg'],
        startDates: ['2024-01-05', '2024-02-12', '2024-01-06'],
        startLocation: {
          description: 'Aspen, USA',
          coordinates: [-106.822318, 39.190872]
        },
        locations: []
      }
    ];

    this.collections.users = [
      {
        _id: '1',
        name: 'Admin User',
        email: 'admin@natours.io',
        role: 'admin',
        password: '$2a$12$Q0grHjH9PXc6SxivC8m12Oe2wZS/UQn1mUPdZZtUp.rIwVGniGpFq', // password: test1234
        active: true
      }
    ];

    this.collections.reviews = [];
    this.collections.bookings = [];
  }

  collection(name) {
    if (!this.collections[name]) {
      this.collections[name] = [];
    }

    const self = this;
    const createChainableQuery = (data) => {
      return {
        data: data,
        find: function(query) { return createChainableQuery(this.data); },
        select: function() { return createChainableQuery(this.data); },
        populate: function() { return createChainableQuery(this.data); },
        sort: function() { return createChainableQuery(this.data); },
        limit: function() { return createChainableQuery(this.data); },
        skip: function() { return createChainableQuery(this.data); },
        lean: function() { return createChainableQuery(this.data); },
        exec: async function() { return this.data; },
        then: function(resolve) { resolve(this.data); }
      };
    };

    return {
      find: (query = {}) => {
        return createChainableQuery(self.collections[name]);
      },
      findById: (id) => {
        const item = this.collections[name].find(item => item._id === id);
        return {
          data: item,
          populate: () => ({ data: item }),
          select: () => ({ data: item })
        };
      },
      findOne: (query) => {
        const item = this.collections[name].find(item => {
          return Object.keys(query).every(key => item[key] === query[key]);
        });
        return {
          data: item,
          select: () => ({ data: item })
        };
      },
      create: (data) => {
        const newItem = { ...data, _id: Date.now().toString() };
        this.collections[name].push(newItem);
        return { data: newItem };
      },
      findByIdAndUpdate: (id, update) => {
        const index = this.collections[name].findIndex(item => item._id === id);
        if (index !== -1) {
          this.collections[name][index] = { ...this.collections[name][index], ...update };
          return { data: this.collections[name][index] };
        }
        return { data: null };
      },
      findByIdAndDelete: (id) => {
        const index = this.collections[name].findIndex(item => item._id === id);
        if (index !== -1) {
          const deleted = this.collections[name].splice(index, 1);
          return { data: deleted[0] };
        }
        return { data: null };
      },
      countDocuments: () => {
        return { data: this.collections[name].length };
      },
      aggregate: () => {
        return { data: [] };
      }
    };
  }

  model(name) {
    const collectionName = name.toLowerCase() + 's';
    const self = this;

    const createChainableQuery = (data) => {
      return {
        data: data,
        find: function(query) { return createChainableQuery(this.data); },
        select: function() { return createChainableQuery(this.data); },
        populate: function() { return createChainableQuery(this.data); },
        sort: function() { return createChainableQuery(this.data); },
        limit: function() { return createChainableQuery(this.data); },
        skip: function() { return createChainableQuery(this.data); },
        lean: function() { return createChainableQuery(this.data); },
        exec: async function() { return this.data; },
        then: function(resolve) { resolve(this.data); }
      };
    };

    const collection = this.collection(collectionName);

    return {
      find: (query) => createChainableQuery(self.collections[collectionName] || []),
      findById: collection.findById,
      findOne: collection.findOne,
      create: collection.create,
      findByIdAndUpdate: collection.findByIdAndUpdate,
      findByIdAndDelete: collection.findByIdAndDelete,
      countDocuments: collection.countDocuments,
      aggregate: collection.aggregate,
      collection: () => collection
    };
  }
}

// Create singleton instance
const db = new InMemoryDB();

// Mock mongoose interface
const inMemoryDb = {
  connect: () => Promise.resolve(),
  connection: {
    on: () => {},
    once: () => {}
  },
  Schema: class Schema {
    constructor() {}
    pre() {}
    post() {}
    methods = {}
    statics = {}
    virtual() { return { get: () => {} }; }
    index() {}
  },
  model: (name) => db.model(name),
  models: {}
};

module.exports = inMemoryDb;
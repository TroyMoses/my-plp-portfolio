const mongoose = require('mongoose');

// Define the schema outside the class
const subscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

// Create the model once
const SubscriberModel = mongoose.model('Subscriber', subscriberSchema);

class Subscriber {
  constructor(db) {
    this.db = db;
  }

  async create(email) {
    if (this.db.constructor.name === 'Pool') {
      // MySQL
      const [result] = await this.db.execute(
        'INSERT INTO newsletter_subscribers (email) VALUES (?)',
        [email]
      );
      return { id: result.insertId };
    } else {
      // MongoDB
      try {
        const subscriber = new SubscriberModel({ email });
        await subscriber.save();
        return subscriber;
      } catch (error) {
        // Handle duplicate key error specifically
        if (error.code === 11000) {
          throw new Error('This email is already subscribed');
        }
        throw error;
      }
    }
  }

  async count() {
    if (this.db.constructor.name === 'Pool') {
      const [result] = await this.db.execute(
        'SELECT COUNT(*) as count FROM newsletter_subscribers'
      );
      return result[0].count;
    } else {
      return SubscriberModel.countDocuments();
    }
  }
}

module.exports = Subscriber;
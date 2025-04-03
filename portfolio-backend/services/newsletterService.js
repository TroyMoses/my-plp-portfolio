const Subscriber = require('../models/subscriber');
const db = require('../config/db');

class NewsletterService {
  constructor() {
    this.dbConnection = db.getConnection();
    this.subscriberModel = new Subscriber(this.dbConnection);
  }

  async subscribe(email) {
    try {
      return await this.subscriberModel.create(email);
    } catch (error) {
      console.error('Subscription error:', error);
      throw error;
    }
  }

  async getSubscriberCount() {
    try {
      return await this.subscriberModel.count();
    } catch (error) {
      console.error('Error getting subscriber count:', error);
      throw error;
    }
  }
}

module.exports = new NewsletterService();
const Contact = require('../models/contact');
const db = require('../config/db');

class ContactService {
  constructor() {
    this.dbConnection = db.getConnection();
    this.contactModel = new Contact(this.dbConnection);
  }

  async submitContactForm({ name, email, subject, message }) {
    try {
      return await this.contactModel.create({ name, email, subject, message });
    } catch (error) {
      console.error('Contact form submission error:', error);
      throw error;
    }
  }
}

module.exports = new ContactService();
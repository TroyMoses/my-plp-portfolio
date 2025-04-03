const mongoose = require('mongoose');

// Define the schema outside the class
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: String,
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Create the model once
const ContactModel = mongoose.model('Contact', contactSchema);

class Contact {
  constructor(db) {
    this.db = db;
  }

  async create({ name, email, subject, message }) {
    if (this.db.constructor.name === 'Pool') {
      // MySQL
      const [result] = await this.db.execute(
        'INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)',
        [name, email, subject, message]
      );
      return { id: result.insertId };
    } else {
      // MongoDB
      try {
        const contact = new ContactModel({ name, email, subject, message });
        await contact.save();
        return contact;
      } catch (error) {
        // Handle duplicate key error specifically
        if (error.code === 11000) {
          throw new Error('Duplicate contact submission');
        }
        throw error;
      }
    }
  }
}

module.exports = Contact;
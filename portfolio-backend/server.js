require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const db = require('./config/db');
const contactService = require('./services/contactService');
const newsletterService = require('./services/newsletterService');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize database
(async () => {
  try {
    await db.connect();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
})();

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Function to send contact confirmation to user
async function sendContactConfirmation(name, email) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Troy Moses Mugabi <noreply@troylegacy.com>',
      to: email,
      subject: 'Thank you for contacting me!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2d3748;">Hi ${name},</h2>
          <p style="color: #4a5568;">Thank you for reaching out through my portfolio website. I've received your message and will get back to you as soon as possible.</p>
          
          <div style="background: #f7fafc; border-left: 4px solid #4299e1; padding: 12px; margin: 20px 0;">
            <p style="margin: 0; color: #2d3748;">This is an automated confirmation that your message has been received.</p>
          </div>
          
          <p style="color: #4a5568;">If you have any urgent inquiries, you can reply directly to this email.</p>
          
          <p style="color: #4a5568;">Best regards,</p>
          <p style="color: #2d3748; font-weight: 600;">Troy Moses Mugabi</p>
          <p style="color: #4a5568;">Full-Stack Developer & UI Designer</p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
          
          <p style="font-size: 12px; color: #718096;">
            This is an automated message. Please do not reply directly to this email.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Contact confirmation sent to ${email}`);
  } catch (error) {
    console.error('Error sending contact confirmation:', error);
  }
}

// Function to notify admin about new contact
async function notifyAdminContact(name, email, subject, message) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Troy Moses Mugabi <noreply@troylegacy.com>',
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact: ${subject || 'No Subject'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2d3748;">New Contact Form Submission</h2>
          
          <div style="background: #f7fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin: 20px 0;">
            <p style="margin: 8px 0; color: #4a5568;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 8px 0; color: #4a5568;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #3182ce;">${email}</a></p>
            <p style="margin: 8px 0; color: #4a5568;"><strong>Subject:</strong> ${subject || 'Not specified'}</p>
            <p style="margin: 8px 0; color: #4a5568;"><strong>Message:</strong></p>
            <div style="background: white; padding: 12px; border-radius: 4px; margin-top: 8px;">
              <p style="margin: 0; color: #4a5568;">${message.replace(/\n/g, '<br>')}</p>
            </div>
          </div>
          
          <div style="margin-top: 24px;">
            <a href="mailto:${email}" style="background: #4299e1; color: white; padding: 10px 16px; border-radius: 4px; text-decoration: none; display: inline-block;">
              Reply to ${name}
            </a>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Admin notified about contact from ${email}`);
  } catch (error) {
    console.error('Error notifying admin about contact:', error);
  }
}

// Function to send newsletter confirmation to subscriber
async function sendNewsletterConfirmation(email) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Troy Moses Mugabi <noreply@troylegacy.com>',
      to: email,
      subject: 'Thanks for subscribing to my newsletter!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2d3748;">Welcome to my newsletter!</h2>
          
          <p style="color: #4a5568;">Thank you for subscribing to my newsletter. You'll now receive updates about:</p>
          
          <ul style="color: #4a5568; padding-left: 20px;">
            <li>My latest projects and portfolio updates</li>
            <li>Web development tips and tutorials</li>
            <li>UI/UX design insights</li>
            <li>Industry news and trends</li>
          </ul>
          
          <div style="background: #f7fafc; border-left: 4px solid #48bb78; padding: 12px; margin: 20px 0;">
            <p style="margin: 0; color: #2d3748;">Your subscription email: ${email}</p>
          </div>
          
          <p style="color: #4a5568;">If you didn't request this subscription, please ignore this email.</p>
          
          <p style="color: #4a5568;">Best regards,</p>
          <p style="color: #2d3748; font-weight: 600;">Troy Moses Mugabi</p>
          <p style="color: #4a5568;">Full-Stack Developer & UI Designer</p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
          
          <p style="font-size: 12px; color: #718096;">
            <a href="${process.env.BASE_URL}/unsubscribe?email=${encodeURIComponent(email)}" style="color: #3182ce;">Unsubscribe</a> | 
            This is an automated message.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Newsletter confirmation sent to ${email}`);
  } catch (error) {
    console.error('Error sending newsletter confirmation:', error);
  }
}

// Function to notify admin about new subscriber
async function notifyAdminNewsletter(email) {
  try {
    const totalSubscribers = await newsletterService.getSubscriberCount();

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Troy Moses Mugabi <noreply@troylegacy.com>',
      to: process.env.ADMIN_EMAIL,
      subject: 'New Newsletter Subscriber',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2d3748;">New Newsletter Subscription</h2>
          
          <div style="background: #f7fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin: 20px 0;">
            <p style="margin: 8px 0; color: #4a5568;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #3182ce;">${email}</a></p>
            <p style="margin: 8px 0; color: #4a5568;"><strong>Total Subscribers:</strong> ${totalSubscribers}</p>
          </div>
          
          <p style="color: #4a5568;">This subscriber has received a confirmation email.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Admin notified about new subscriber ${email}`);
  } catch (error) {
    console.error('Error notifying admin about subscriber:', error);
  }
}

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false,
        error: 'Name, email, and message are required' 
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ 
        success: false,
        error: 'Please enter a valid email address' 
      });
    }
    
    const result = await contactService.submitContactForm({ name, email, subject, message });
    
    // Send emails (don't await to make response faster)
    Promise.all([
      sendContactConfirmation(name, email),
      notifyAdminContact(name, email, subject, message)
    ]).catch(err => console.error('Email sending error:', err));
    
    res.status(201).json({ 
      success: true,
      message: 'Message sent successfully! You should receive a confirmation email shortly.',
      id: result.id 
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ 
      success: false,
      error: error.code === 'ER_DUP_ENTRY' || error.code === 11000 
        ? 'You have already submitted a message with this email' 
        : 'Failed to submit message. Please try again later.' 
    });
  }
});

// Newsletter subscription endpoint
app.post('/api/newsletter', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Validation
    if (!email) {
      return res.status(400).json({ 
        success: false,
        error: 'Email is required' 
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ 
        success: false,
        error: 'Please enter a valid email address' 
      });
    }
    
    const result = await newsletterService.subscribe(email);
    
    // Send emails (don't await to make response faster)
    Promise.all([
      sendNewsletterConfirmation(email),
      notifyAdminNewsletter(email)
    ]).catch(err => console.error('Email sending error:', err));
    
    res.status(201).json({ 
      success: true,
      message: 'Subscribed successfully! Please check your email for confirmation.',
      id: result.id 
    });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    res.status(500).json({ 
      success: false,
      error: error.code === 'ER_DUP_ENTRY' || error.code === 11000
        ? 'This email is already subscribed'
        : 'Failed to subscribe. Please try again later.'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    database: process.env.NODE_ENV === 'production' ? 'MongoDB' : 'MySQL',
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
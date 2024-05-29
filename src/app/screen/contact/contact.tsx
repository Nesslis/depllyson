import React from 'react';
import './contact.css';
function Contact() {
  return (
    <div className='contactPage'>
    <div className="contact-container">
      <div className="overlay"></div>
      <div className="contact-content">
        <h2>Let's talk with us !</h2>
        <p>If you have any questions feel free to ask</p>
        <form>
          <div className="contact-form-group">
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div className="contact-form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="contact-form-group">
            <label htmlFor="topic">Topic:</label>
            <input type="text" id="topic" name="topic" required />
          </div>
          <div className="contact-form-group">
            <label htmlFor="message">How can we help you:</label>
            <textarea id="message" name="message" rows={4} required></textarea>
          </div>
          <div className='contact-button-container'>
          <button type="contact-submit">Send Message</button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
}

export default Contact;

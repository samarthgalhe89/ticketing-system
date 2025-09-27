// server/utils/emailService.js
const nodemailer = require('nodemailer');

// 1. Create a transporter object using your service email credentials
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use 'smtp.office365.com' for Outlook/Office365
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * Sends an email notification to the recipient.
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject line
 * @param {string} text - Plain text body
 * @param {string} html - HTML formatted body
 */
const sendNotification = async (to, subject, text, html) => {
    try {
        const mailOptions = {
            from: `POWERGRID Helpdesk <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            text: text,
            html: html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Notification sent: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

module.exports = sendNotification;
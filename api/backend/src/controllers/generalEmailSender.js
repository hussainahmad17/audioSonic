const nodemailer = require('nodemailer');

const sendEmailWithAudio = async ({ email, audioTitle, audioDescription, audioUrl }) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });
        const prettyFileName = `${audioTitle.replace(/\s+/g, "_")}.mp3`;
        const htmlContent = `
        <div style="font-family: Arial, sans-serif; background-color: #f8f9fa; padding: 20px; color: #333;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; padding: 20px; border: 1px solid #e0e0e0;">
                <h2 style="color: #2c3e50; margin-bottom: 10px;">🎵 ${audioTitle}</h2>
                <p style="margin-bottom: 20px;">${audioDescription || "Enjoy your premium audio file!"}</p>
                <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
                <p>Your premium audio is ready! Click below to <strong>download</strong> your file:</p>
                <p>
                    <a href="${audioUrl}" style="display: inline-block; background-color: #0066cc; color: #ffffff; padding: 10px 16px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                        ⬇️ Open Audio
                    </a>
                </p>
                <p style="color: #777; font-size: 14px;">If the button doesn’t work, copy and paste this link into your browser:</p>
                <p style="word-break: break-all; font-size: 14px;">
                    <a href="${audioUrl}" style="color: #0066cc;">${audioUrl}</a>
                </p>
                <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
                <p style="font-size: 14px; color: #777;">Thank you for your purchase and trust in our service.</p>
            </div>
        </div>
        `;
        const mailOptions = { from: `"Premium Audio Store" <${process.env.EMAIL_USER}>`, to: email, subject: `Your Premium Audio: ${audioTitle}`, html: htmlContent, attachments: [{ filename: prettyFileName, path: audioUrl, contentType: "audio/mpeg" }] };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error(`❌ Failed to send email to ${email}:`, error);
        throw new Error('Email sending failed. Please try again later.');
    }
};

module.exports = { sendEmailWithAudio };

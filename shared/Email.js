const nodemailer = require('nodemailer');

const smtpEmail = process.env.SMTP_EMAIL
const smtpPassword = process.env.SMTP_PASSWORD
const smtpServer = process.env.SMTP_SERVER
const smtpPort = process.env.SMTP_PORT


const transporter = nodemailer.createTransport({
    host: smtpServer,
    port: parseInt(smtpPort),
    auth: {
        user: smtpEmail,
        pass: smtpPassword
    }
});


async function send_email(to, code) {
    let info = await transporter.sendMail({
        from: `"Log Tracker" <${smtpEmail}>`,
        to: to.toString(),
        subject: "Log Tracker Verification Code",
        text: `Your code is: ${code}`,
        html: `Your code is: <b>${code}</b>`,
    });
    console.log("Message sent: %s", info.messageId);
}

function createCode() {
    const length = 7
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

module.exports.SendCodeToUser = function (email) {
    const code = createCode()
    send_email(email.toString(), code).catch(console.error);
    return code
}
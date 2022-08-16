const nodemailer = require('nodemailer');

const smtp_email = process.env.SMTP_EMAIL
const smtp_password = process.env.SMTP_PASSWORD

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: smtp_email,
        pass: smtp_password
    }
});


async function send_email(to, code) {
    let info = await transporter.sendMail({
        from: '"James Swanson" <foo@example.com>',
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
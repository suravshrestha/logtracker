const config = require("../utils/config");
const nodemailer = require("nodemailer");

const SMTP_SERVER = config.SMTP_SERVER;
const SMTP_PORT = config.SMTP_PORT;
const SMTP_EMAIL = config.SMTP_EMAIL;
const SMTP_PASSWORD = config.SMTP_PASSWORD;


const transporter = nodemailer.createTransport({
    host: SMTP_SERVER,
    port: parseInt(SMTP_PORT),
    auth: {
        user: SMTP_EMAIL,
        pass: SMTP_PASSWORD
    }
});


async function send_email(to, code) {
    await transporter.sendMail({
        from: `"Log Tracker" <${SMTP_EMAIL}>`,
        to: to.toString(),
        subject: "Log Tracker Verification Code",
        text: `Your code is: ${code}`,
        html: `Your code is: <b>${code}</b>`,
    });
}

function createCode() {
    const length = 7;
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

module.exports.SendCodeToUser = function (email) {
    const code = createCode();
    send_email(email.toString(), code).catch(console.error);
    return code;
};

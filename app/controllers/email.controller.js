const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
require('dotenv').config();

const config = {
    service: 'gmail', // your email domain
    auth: {
        user: process.env.APP_EMAIL, // your email address
        pass: process.env.APP_PASSWORD // your password
     }
}

const transporter = nodemailer.createTransport(config);

// Send a registration email
exports.sendEmailRegistration = (req, res) => {
    const username = req.params.username;
    const email = req.params.email;
    const code = req.params.code;
    const token = req.params.token;

    if(!username || !email || !code || !token){
        res.status(400).send({
            message: "Username and month cannot be empty!"
          });
          return;
    }

    let MailGenerator = new Mailgen({
        theme: 'default',
        product: {
            name: 'Digital Art Portfolio',
            link: 'http://localhost:8081'
        }
    });

    let response = {
        body: {
            name: username,
            intro: 'Welcome to the Digital Art Portfolio! We\'re very excited to have you on board.',
            action: {
                instructions: `To get started, please click here and input the code <b>${code}</b> on the page to verify your email and complete registration:`,
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Confirm your account',
                    link: `http://localhost:8081/confirmAccount/${token}`
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.',
            signature: 'Regards'
        }
    };

    let mail = MailGenerator.generate(response);

    let message = {
        from: config.auth.user, // sender address
        to: email, // list of receivers
        subject: 'Welcome to Digital Art Portfolio!', // Subject line
        html: mail, // html body
    };

    transporter.sendMail(message).then((info) => {
        return res.status(201).json(
            {
                msg: "Email sent",
                info: info.messageId,
                preview: nodemailer.getTestMessageUrl(info)
            }
        )
    }).catch((err) => {
        return res.status(500).json({ msg: err });
    }
    );
}

// Send a password reset email
exports.sendEmailReset = (req, res) => {
    const username = req.params.username;
    const email = req.params.email;
    const code = req.params.code;
    const token = req.params.token;

    if(!username || !email || !code || !token){
        res.status(400).send({
            message: "Username and month cannot be empty!"
          });
          return;
    }

    let MailGenerator = new Mailgen({
        theme: 'default',
        product: {
            name: 'Digital Art Portfolio',
            link: 'http://localhost:8081'
        }
    });

    let response = {
        body: {
            name: username,
            intro: 'You have received this email since you have requested to change your password. ' +
                   'The link below will be active for 20 minutes and you must access and change your password within that time. Otherwise, you will have to send another request.<br/><br/>' +
                   'If you have received this email but made no request, please ensure your email has not been compromised.',
            action: {
                instructions: `To get started, please click here and input the code <b>${code}</b> on the page to verify your email before resetting your password:`,
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Reset Your Password',
                    link: `http://localhost:8081/reset/${token}`
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.',
            signature: 'Regards'
        }
    };

    let mail = MailGenerator.generate(response);

    let message = {
        from: config.auth.user, // sender address
        to: email, // list of receivers
        subject: 'Password Reset', // Subject line
        html: mail, // html body
    };

    transporter.sendMail(message).then((info) => {
        return res.status(201).json(
            {
                msg: "Email sent",
                info: info.messageId,
                preview: nodemailer.getTestMessageUrl(info)
            }
        )
    }).catch((err) => {
        return res.status(500).json({ msg: err });
    }
    );

}
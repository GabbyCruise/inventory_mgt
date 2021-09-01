const nodemailer = require('nodemailer');
const mailConfig = require('../middleware/mailConfig');

const transport = nodemailer.createTransport({
    service: 'Mailgun',//check this out
    auth: {
        user: mailConfig.MAILGUN_USER,
        pass: mailConfig.MAILGUN_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});


//using the above to send the mail
module.exports = {
    sendMail(from, to, subject, html){
        return new Promise((resolve, reject) => {
            transport.sendMail({from, subject, to, html }, (err, info) => {
               if(err) reject(err);
               resolve(info) ;
            });
        });
    }
};
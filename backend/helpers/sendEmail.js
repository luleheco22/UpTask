import nodemailer from 'nodemailer'

export const emailRegister = async (data) => {
    const { name, email, token } = data
    const transport = nodemailer.createTransport({
        // service: "hotmail",
        host: process.env.EMAIL_HOST,
        port: process.env.PORT,
        //secure: false,
        secureConnection: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            ciphers: "SSLv3", //for outlook
            rejectUnauthorized: false, // do not fail on invalid certs
          },
        //   logger: true,
        //   // transactionLog: true, // include SMTP traffic in the logs
        //   allowInternalNetworkInterfaces: false,
    });


    await transport.sendMail({
        from: '"UpTask - Project Manager" <uptaskmanager@outlook.com>',
        to: email,
        subject: "UpTask - Check your account",
        text: "Check your account on UpTask",
        html: `<p>Hola: ${name} Check your account on UpTask</p>
         <p>Your account is almost ready, you just have to check it in the following link: </p>
        <a href="${process.env.FRONTEND_URL}/confirm/${token}">Verify account</a>

        <p>If you did not create this account, you can ignore this message</p>
    
    `
    })
}


export const emailForgetPassword = async (data) => {
    const { name, email, token } = data
    const transport = nodemailer.createTransport({
       // service: "hotmail",
        host: process.env.EMAIL_HOST,
        port: process.env.PORT,
        //secure: false,
        secureConnection: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            ciphers: "SSLv3", //for outlook
            rejectUnauthorized: false, // do not fail on invalid certs
          },
        //   logger: true,
        //   // transactionLog: true, // include SMTP traffic in the logs
        //   allowInternalNetworkInterfaces: false,
    });

    transport.verify().then(() => {
        console.log('Ready')
    })



    await transport.sendMail({
        from: '"UpTask - Project Manager" <uptaskmanager@outlook.com>',
        to: email,
        subject: "UpTask - Reset your password",
        text: "Reset your password",
        html: `<p>Hola: ${name} You have requested to reset your password</p>
         <p>Follow the following link to generate a new password: </p>
        <a href="${process.env.FRONTEND_URL}/forget-password/${token}">Reset your password</a>

        <p>If you did not request this email, you can ignore this message</p>
    
    `
    })
}
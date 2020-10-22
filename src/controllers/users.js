const usersModel = require('../models/users')
const { success, failed, tokenStatus } = require('../helpers/response')
const { JWT_KEY, myemail, mypassword, url, urlforgot } = require('../helpers/env')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mailer = require('nodemailer')
const response = require('../helpers/response')

const users = {
    register: async (req, res) => {
        try {
            const body = req.body

            const salt = await bcrypt.genSalt(10)
            const hashWord = await bcrypt.hash(body.password, salt)

            const data = {
                name : body.name,
                email : body.email,
                password : hashWord
            }

            usersModel.register(data)
            .then(() => {
                const hashWord = jwt.sign({
                    email: data.email,
                    name: data.name
                }, JWT_KEY)

                let transporter = mailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false,
                    requireTLS: true,
                    auth: {
                        user: myemail,
                        pass: mypassword
                    }
                })

                let mailOptions = {
                    from: `FOOD POS ${myemail}`,
                    to: data.email,
                    subject: `HELLO ${data.name}`,
                    html:
                    `
                    <!doctype html>
                    <html lang="en">
                    <head>
                        <!-- Required meta tags -->
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"> 
                        <style>
                        @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400&display=swap');
                        * {
                            font-family: 'Rubik', sans-serif;
                        }
                        body {
                            padding: 0;
                            margin: 0;
                        }
                        .footer{
                        background-color: #7E98DF !important;
                        color: white;
                        padding: 25px;
                        }
                        .jumbotron {
                            border-radius: 0% !important;
                            padding: 25px;
                            background-color: #E5E5E5;
                            color: black;
                        }
                        .btn {
                            padding: 5px;
                            border: 1px solid #7E98DF;
                            border-radius: 25px;
                            background-color: #7E98DF;
                            color: white;
                            text-align: center;
                            width: 200px;
                            margin: 10px auto;
                        }
                        .btn:hover{
                            transform: scale(1.02);
                        }
                        </style>
                        <title>Account Activation</title>
                    </head>
                    <body>
                        <div>
                            <div class="jumbotron">
                                <h1>Account Activation</h1>
                                <p>Hi ${data.name}!</p>
                                <p>Your account is registered with this data </p>
                                <p>Email: <span style="text-decoration: none;">${data.email}</span></p>
                                <p>Please click this button to activate your account</p>
                                <button class="btn"><a role="button" href="${url}users/verify/${hashWord}" style="text-decoration: none; color: white;">Activate</a></button>
                            </div>
                            <div class="footer">
                                <img src="http://drive.google.com/uc?export=view&id=1LoR-CMdRYLd_K1hWxZeupB01Htqg1wJO" alt="" style="width: 70px;">
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br>In euismod ipsum et dui rhoncus auctor.</p>
                                <hr style="background-color: white;">
                                <p>2020 Telegram. All right reserved</p>
                            </div>
                        </div
                        
                       
                    </body>
                    </html>
                    `
                }

                transporter.sendMail(mailOptions, (err, result) => {
                    if (err) {
                        res.status(505)
                        failed(res, [], err.message)
                    } else {
                        success(res, [result], `Success Registration, Please activate your email`)
                        // success(res, [result], `Send Mail Success`)
                    }
                })

                res.json({
                    message: `Success Registration, Please activate your email`
                })
            })
            .catch((err) => {
                failed(res, [], err.message)
            })
        } catch (error) {
            failed(res, [], 'Internal server error!')            
        }
    },
    verify: (req,res) => {
        const token = req.params.token
        if(token) {
            jwt.verify(token, JWT_KEY, (err,decode) => {
                if(err){
                    res.status(505)
                    failed(res, [], `Failed Activation`)
                }else{
                    const email = decode.email
                    const name = decode.name
                    usersModel.activateUser(email)
                    .then((result) => {
                        if(result.affectedRows){
                            res.status(200)
                            res.render('index', {email, name})
                        }else{
                            res.status(505)
                            failed(res, [], err.message)
                        }
                    })
                    .catch((err)=>{
                        res.status(505)
                        response.failed(res, [], err.message)
                    })
                }
            })
        }
    },
    login: async (req, res) => {
        try {
            const body = req.body
            usersModel.login(body)

            .then(async(result) => {
                const userData = result[0]
                const hashWord = userData.password
                const userRefreshToken = userData.refreshToken
                const correct = await bcrypt.compare(body.password, hashWord)

                if (correct) {
                    if(userData.is_active === 1){
                        jwt.sign(
                            { 
                              email : userData.email,
                              name : userData.name,
                            },
                            JWT_KEY,
                            { expiresIn: 120 },
    
                            (err, token) => {
                                if (err) {
                                    console.log(err)
                                } else {
                                    if(userRefreshToken === null){
                                        const id = userData.id
                                        const refreshToken = jwt.sign( 
                                            {id} , JWT_KEY)
                                        usersModel.updateRefreshToken(refreshToken,id)
                                        .then(() => {
                                            const data = {
                                                id: userData.id,
                                                name: userData.name,
                                                email: userData.email,
                                                token: token,
                                                refreshToken: refreshToken
                                            }
                                            tokenStatus(res, data, 'Login Success')
                                        }).catch((err) => {
                                            failed(res,[], err.message)
                                        })
                                    }else{
                                        const data = {
                                            id: userData.id,
                                            name: userData.name,
                                            email: userData.email,
                                            token: token,
                                            refreshToken: userRefreshToken
                                        }
                                        tokenStatus(res, data, 'Login Success')
                                    }
                                }
                            }
                        ) 
                    }else{
                        failed(res, [], "Need Activation")
                    }
                } else {
                    failed(res, [], "Incorrect password! Please try again")
                }
            })
            .catch((err) => {
                failed(res, [], err.message)
            })
        } catch (error) {
            failed(res, [], 'Internal server error!')
        }
    },
    renewToken: (req, res) =>{
        const refreshToken = req.body.refreshToken
        usersModel.checkRefreshToken(refreshToken)
        .then((result)=>{
            if(result.length >=1){
                const userData = result[0];
                const newToken = jwt.sign(
                    {
                        email : userData.email,
                        name : userData.name 
                    },
                    JWT_KEY,
                    {expiresIn: 3600}
                )
                const data = {
                    token: newToken,
                    refreshToken: refreshToken
                }
                tokenStatus(res,data, `The token has been refreshed successfully`)
            }else{
                failed(res,[], `Refresh token not found`)
            }
        }).catch((err) => {
            failed(res, [], err.message)
        })
    },
    logout: (req,res) => {
        try {
            const id = req.params.id
            usersModel.logout(id)
            .then((result) => {
                success(res,result, `Logout Success`)
            }).catch((err) => {
                failed(res,[], err.message)
            })
        } catch (error) {
            failed(res, [], `Internal Server Error`)
        }
    },
    ForgotPassword: (req,res) => {
        try {
            const body = req.body
            const email = body.email
            usersModel.getEmail(email)
            .then(() => {
                const userkey = jwt.sign({
                    email: body.email,
                    name: body.name
                }, JWT_KEY)

                usersModel.updateUserKey(userkey, email)
                .then(async() => {
                    let transporter = mailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 587,
                        secure: false,
                        requireTLS: true,
                        auth:{
                            user: myemail,
                            pass: mypassword
                        }
                    })
    
                    let mailOptions = {
                        from    : `FOOD POS ${myemail}`,
                        to      : body.email,
                        subject : `Reset Password ${body.email}`,
                        html:
                        `Hai
                        This is an email to reset the password
                        KLIK --> <a href="${urlforgot}/resetpass-users?userkey=${userkey}">Klik this link for Reset Password</a>  <---`
                    }
    
                    transporter.sendMail(mailOptions,(err, result) => {
                        if(err) {
                            res.status(505)
                            failed(res, [], err.message)
                        } else {
                            success(res, [result], `Send Mail Success`)
                        }
                    })
                    res.json({
                        message: `Please Check Email For Reset Password`
                    })
                }).catch((err) =>{
                    failed(res, [], err)
                })
            }).catch((err) =>{
                failed(res, [], err)
            })
        } catch (error) {
            failed(res, [], `Internal Server Error`)
        }
    },
    newPassword: async (req, res) => {
        try {
            const body = req.body
            
            const salt = await bcrypt.genSalt(10)
            const hashWord = await bcrypt.hash(body.password, salt)

            const key = req.params.userkey

            usersModel.newPassword(hashWord ,key)

            .then((result) => {
                success(res, result, `Update Password Success`)
                jwt.verify(key, JWT_KEY, (err,decode) =>{
                    if(err){
                        res.status(505)
                        failed(res, [], `Failed Reset userkey`)
                    }else{
                        const email = decode.email
                        console.log(email)
                        usersModel.resetKey(email)
                        .then((results) => {
                            if(results.affectedRows){
                                res.status(200)
                                success(res, results, `Update Password Success`)
                            }else{
                                res.status(505)
                                // failed(res,[],err.message)
                            }
                        }).catch((err) => {
                            // failed(res, [], err)
                        })
                    }
                })
            }).catch((err) => {
                failed(res, [], err.message)
            })        
        } catch (error) {
            failed(res, [], `Internal Server Error`)
        }
    },
    getAll: (req, res) => {
        try {
            const body = req.params.body
            usersModel.getAll()
            .then((result) => {
                success(res, result, 'Here are the data you requested')
            })
            .catch((err) => {
                failed(res, [], err)
            })
        } catch (error) {
            failed(res, [], 'Internal server error!')
        }
    },
    getDetail: (req, res) => {
        try {
            const id = req.params.id
            usersModel.getDetail(id)
            .then((result) => {
                success(res, result, `Here is the data of users with id ${id}`)
            })
            .catch((err) => {
                failed(res, [], err.message)
            })
        } catch (error) {
            failed(res, [], 'Internal server error!')
        }
    }
}


module.exports = users
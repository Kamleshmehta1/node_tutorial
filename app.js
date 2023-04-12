//import NPM modules

const express = require('express')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const validator = require('validator')
const session = require('express-session')
const mongoDbSession = require('connect-mongodb-session')(session);

// import utils

const { cleanUpAndValidate } = require('./utils/AuthUtils')
const dataBase = require('./private-constants')

// import userModels

const UserModel = require('./model/UserModel')


const app = express()



const PORT = 4000


mongoose.connect(dataBase.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((resp) => {
    console.log('connected to database')
})


const dataBaseSession = new mongoDbSession({
    uri: dataBase.mongoURI,
    collection: 'mySession'
})

app.use(
    session({
        secret: "Our Secret Key",
        resave: true,
        saveUninitialized: true,
        store: dataBaseSession
    })
);
app.use(express.json())
app.use(express.urlencoded({ extended: true }))



app.set('view engine', 'ejs')

app.get('/', (req, resp) => {
    resp.send('Welcome to the welcome page!')
})
app.get('/login', (req, resp) => {
    resp.render('login')
})
app.get('/register', (req, resp) => {
    resp.render('register')
})


app.post('/login', async (req, resp) => {
    const { loginId, password } = req.body
    console.log(loginId, password);

    let user;

    if (validator.isEmail(loginId)) {
        // loginId is email
        user = await UserModel.findOne({ email: loginId })
    } else {
        //loginId is userName
        user = await UserModel.findOne({ userName: loginId })

        // user not found

        if (!user) {
            return resp.send({
                status: 401,
                message: "Data not found",
                data: req.body
            })
        }

        const isMatch = bcrypt.compare(password, user.password)

        if (!isMatch) {
            return resp.send({
                status: 401,
                message: "Wrong password",
                data: req.body
            })
        }

        console.log(req.session)

        req.session.isAuth = true;
        req.session.user = { email: user.email, userName: user.userName }
        return resp.redirect('/home')

        // return resp.send({
        //     status: 200,
        //     message: "Login successfull !",
        //     data: {
        //         name: user.name,
        //         email: user.email,
        //         userName: user.userName
        //     }
        // })
    }
    try {
        await cleanUpAndValidate({ name, email, password, userName })
    } catch (error) {
        return resp.send({ status: 400, message: "invalid data", data: error })
    }
})



app.get('/home', (req, resp) => {

    if (req.session.isAuth) {
        return resp.send('Welcome to the home page')
    } else {
        return resp.send('Invalid session')
    }
})

app.post('/register', async (req, resp) => {
    const { name, email, password, userName } = req.body
    console.log(req.body);
    try {
        await cleanUpAndValidate({ name, email, password, userName })
    } catch (error) {
        return resp.send({ status: 400, message: "invalid data", data: error })
    }

    // check if user already exist
    try {
        const emailId = await UserModel.findOne({ email });
        const user = await UserModel.findOne({ userName });

        if (user) {
            return resp.send({
                status: "400",
                message: "userName already exist",
            })
        }
        if (emailId) {
            return resp.send({
                status: "400",
                message: "email already exist",
            })
        }
    } catch (error) {
        return resp.send({
            status: "400",
            message: "Database error",
            data: error
        })
    }

    // password encryption
    const hashedPassword = await bcrypt.hash(password, 13)

    //  store the data in data base

    const user = new UserModel({
        name, email, userName, password: hashedPassword
    })

    try {
        const res = await user.save();

        return resp.send({
            status: 200,
            message: "registered successfully!",
            data: res
        })
    } catch (error) {
        return resp.send({
            status: 400,
            message: "error",
            data: error
        })
    }

})

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})



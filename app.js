const express = require('express')
const cleanUpAndValidate = require('./utils/AuthUtils')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const dataBase = require('./private-constants')


const app = express()

const PORT = 4000


mongoose.connect(dataBase.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((resp) => {
    console.log('connected to database')
})

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
    const { name, email, password, userName } = req.body
    console.log(req.body)


    try {
        await cleanUpAndValidate({ name, email, password, userName })
    } catch (error) {
        return resp.send({ status: 400, message: "invalid data", data: error })
    }

})
app.post('/register', async (req, resp) => {
    const { name, email, password, userName } = req.body
    console.log(req.body)
    resp.send(req.body)
    try {
        await cleanUpAndValidate({ name, email, password, userName })
    } catch (error) {
        return resp.send({ status: 400, message: "invalid data", data: error })
    }

    // password encryption
    const hashedPassword = await bcrypt.hash(password, 13)

    //  store the data in data base

})

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})



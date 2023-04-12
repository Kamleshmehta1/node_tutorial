const validator = require('validator')

const cleanUpAndValidate = async ({ name, email, password, userName }) => {
    return new Promise((resolve, reject) => {
        if (typeof (email) != 'string') {
            reject('Invalid email')
        }
        if (typeof (name) != 'string') {
            reject('Invalid name')
        }
        if (typeof (userName) != 'string') {
            reject('Invalid userName')
        }
        if (typeof (password) != 'string') {
            reject('Invalid password')
        }


        if (!email || !password || !userName) {
            reject("Invalid email || password || userName")
        }

        if (!validator.isEmail(email)) {
            reject('Invalid email')
        }

        if (userName.length < 3) {
            reject('username length too short !')
        }
        if (userName.length > 50) {
            reject('username length too long !')
        }
        if (password.length < 5) {
            reject('password length too short !')
        }
        if (password.length > 200) {
            reject('password length too long !')
        }


        resolve()
    })
}


module.exports = { cleanUpAndValidate } 
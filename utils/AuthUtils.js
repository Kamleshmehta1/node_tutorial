const validator = require('validator')

const cleanUpAndValidate = async ({ name, email, password, userName }) => {
    return new Promise((resolve, reject) => {
        if (typeof email !== 'string' && email !== 'string' && password !== 'string' && userName !== 'string') {
            reject('Invalid Email')
        }

        if (!email || !password || !userName) {
            reject("Invalid data")
        }

        if (!validator.isEmail(email)) {
            reject('Invalid email')
        }

        if (userName.toString().length < 3) {
            reject('username length too short !')
        }
        if (userName.toString().length > 50) {
            reject('username length too long !')
        }
        if (password.toString().length > 5) {
            reject('password length too short !')
        }
        if (password.toString().length > 200) {
            reject('password length too long !')
        }

        resolve()
    })
}


module.exports = { cleanUpAndValidate }
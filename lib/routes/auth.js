const path = require('path')
const fs = require('fs')

const car = require('../services/car')
const { generateAuthCode } = require('../helpers/authCode')

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_PROJECT_ID = process.env.GOOGLE_PROJECT_ID

// verify client_id is the client id given to google
// verify redirect_uri matches the one provided by google for client 
//   (https://oauth-redirect.googleusercontent.com/r/YOUR_PROJECT_ID)
//   (YOUR_PROJECT_ID is the ID found on the Project settings page of the Actions Console.)
// confirm response_type === 'code'
const verifyAuthRequest = ({ client_id, redirect_uri, response_type }) => {
    if (client_id !== GOOGLE_CLIENT_ID ||
        redirect_uri !== `https://oauth-redirect.googleusercontent.com/r/${GOOGLE_PROJECT_ID}` ||
        response_type !== 'code'
    ) {
        throw new AuthRequestError()
    }
}

function AuthRequestError(message) {
    this.name = 'AuthRequestError'
    this.message = message
}

module.exports = {
    post: async (req, res) => {
        const {
            client_id,
            redirect_uri,
            state,
            // scope,
            response_type
        } = req.query

        const {
            login,
            password
        } = req.body

        if (!login || !password) {
            res.redirect(req.url)
            return
        }

        let tokens
        try {
            tokens = await car.getToken({ login, password })
        } catch (error) {
            res.send('invalid tesla credentials')
            return
        }

        try {
            verifyAuthRequest({ client_id, redirect_uri, response_type })

            // generate auth code, that google can use to access api
            const code = generateAuthCode({ client_id, login, tokens })

            res.redirect(`https://oauth-redirect.googleusercontent.com/r/${GOOGLE_PROJECT_ID}?code=${code}&state=${state}`)
        } catch (error) {
            res.status(403).send('Invalid request')
        }
    },
    get: (req, res) => {
        fs.readFile(path.join(__dirname, '../../static/auth.html'), (err, fileContents) => {
            const html = fileContents.toString().replace('${URL}', req.url)
            res.send(html)
        })
    }
}
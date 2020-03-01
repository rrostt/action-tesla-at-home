const { generateAuthCode } = require('../helpers/authCode')

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_PROJECT_ID = process.env.GOOGLE_PROJECT_ID

const defaultUserId = 1

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

module.exports = (req, res) => {
    const {
        client_id,
        redirect_uri,
        state,
        // scope,
        response_type
    } = req.query

    try {
        // verify client_id is the client id given to google
        // verify redirect_uri matches the one provided by google for client 
        //   (https://oauth-redirect.googleusercontent.com/r/YOUR_PROJECT_ID)
        //   (YOUR_PROJECT_ID is the ID found on the Project settings page of the Actions Console.)
        // confirm response_type === 'code'
        verifyAuthRequest({ client_id, redirect_uri, response_type })

        // get user (let em sign in if possible)
        const userId = defaultUserId

        // generate auth code, that google can use to access api
        const code = generateAuthCode({ client_id, userId })

        // redirect to : 
        //   https://oauth-redirect.googleusercontent.com/r/YOUR_PROJECT_ID?code=AUTHORIZATION_CODE&state=STATE_STRING
        res.redirect(`https://oauth-redirect.googleusercontent.com/r/${GOOGLE_PROJECT_ID}?code=${code}&state=${state}`)
    } catch (error) {
        res.status(403).send('Invalid request')
    }
}

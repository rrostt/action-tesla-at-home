const { decodeAuthCode } = require('../helpers/authCode')
const { decodeToken, generateToken, generateTokens } = require('../helpers/tokens')

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

const verifyTokenRequest = ({ client_id, client_secret }) => {
    if (client_id !== GOOGLE_CLIENT_ID || client_secret !== GOOGLE_CLIENT_SECRET) {
        throw new TokenRequestError()
    }
}

function TokenRequestError(message) {
    this.name = 'TokenRequestError'
    this.message = message
}

module.exports = (req, res) => {
    const {
        client_id,
        client_secret,
        grant_type,     // either 'authorization_code', or 'refresh_token'
        code,           // when grant_type is 'authorization_code'
        refresh_token   // when grant_type is 'refresh_token'
    } = req.body

    try {
        verifyTokenRequest({ client_id, client_secret })
    } catch (error) {
        res.status(400).json({error: 'valid_grant'})
    }

    if (grant_type === 'authorization_code') {
        // unpack code to get tokens
        const { tokens } = decodeAuthCode(code)
        // generate access_token and refresh_token
        const { access_token, refresh_token, expires_in } = generateTokens({ client_id, tokens })
        // return tokens, expires_in in seconds and token_type 'Bearer'
        res.json({
            token_type: 'Bearer',
            access_token,
            refresh_token,
            expires_in
        })
    } else if (grant_type === 'refresh_token') {
        // unpack refresh_token to get userID
        const { tokens } = decodeToken(refresh_token)
        // generate access_token
        const access_token = generateToken({ client_id, tokens })
        // return access_token, token_type 'Bearer', and expires_in in seconds
        res.json({
            token_type: 'Bearer',
            access_token,
            expires_id: 3600
        })
    } else {
        res.status(404).send('no')
    }
}

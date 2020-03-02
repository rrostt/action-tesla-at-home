const { atob, btoa } = require('./base64')

const generateTokens = ({ client_id, tokens }) => ({
    access_token: generateAccessToken({ client_id, tokens }),
    refresh_token: generateRefreshToken({ client_id, tokens }),
    expires_in: 3600
})

const generateAccessToken = ({ client_id, tokens }) =>
    generateToken({ client_id, tokens, expires: Date.now() + 3600000 })

const generateRefreshToken = ({ client_id, tokens }) =>
    generateToken({ client_id, tokens })

const generateToken = obj => btoa(JSON.stringify(obj))
const decodeToken = token => JSON.parse(atob(token))

module.exports = {
    generateTokens,
    generateToken,
    decodeToken
}

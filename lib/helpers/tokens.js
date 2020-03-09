const { atob, btoa } = require('./base64')

const generateTokens = ({ client_id, login, tokens }) => ({
    access_token: generateAccessToken({ client_id, login, tokens }),
    refresh_token: generateRefreshToken({ client_id, login, tokens }),
    expires_in: 3600
})

const generateAccessToken = ({ client_id, login, tokens }) =>
    generateToken({ client_id, login, tokens, expires: Date.now() + 3600000 })

const generateRefreshToken = ({ client_id, login, tokens }) =>
    generateToken({ client_id, login, tokens })

const generateToken = obj => btoa(JSON.stringify(obj))
const decodeToken = token => JSON.parse(atob(token))

module.exports = {
    generateTokens,
    generateAccessToken,
    generateToken,
    decodeToken
}

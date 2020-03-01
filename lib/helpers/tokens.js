const { atob, btoa } = require('./base64')

const generateTokens = ({ client_id, userId }) => ({
    access_token: generateAccessToken({ client_id, userId }),
    refresh_token: generateRefreshToken({ client_id, userId }),
    expires_in: 3600
})

const generateAccessToken = ({ client_id, userId }) =>
    generateToken({ client_id, userId, expires: Date.now() + 3600000 })

const generateRefreshToken = ({ client_id, userId }) =>
    generateToken({ client_id, userId })

const generateToken = obj => btoa(JSON.stringify(obj))
const decodeToken = token => JSON.parse(atob(token))

module.exports = {
    generateTokens,
    generateToken,
    decodeToken
}

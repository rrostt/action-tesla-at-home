const { atob, btoa } = require('./base64')

const generateAuthCode = ({ client_id, userId }) => btoa(JSON.stringify({
    client_id, userId
}))

const decodeAuthCode = code => JSON.parse(atob(code))

module.exports = {
    generateAuthCode,
    decodeAuthCode
}

const { atob, btoa } = require('./base64')

const generateAuthCode = (obj) => btoa(JSON.stringify(obj))

const decodeAuthCode = code => JSON.parse(atob(code))

module.exports = {
    generateAuthCode,
    decodeAuthCode
}

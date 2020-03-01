const btoa = str => Buffer.from(str).toString('base64')
const atob = str => Buffer.from(str, 'base64').toString()

module.exports = {
    btoa,
    atob,
}

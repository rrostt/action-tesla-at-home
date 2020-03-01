const axios = require('axios')

const MY_TESLA_API = process.env.MY_TESLA_API

const climateOn = () =>
    axios.get(`${MY_TESLA_API}/vehicle/climateOn`)

const climateOff = () =>
    axios.get(`${MY_TESLA_API}/vehicle/climateOff`)

const climate = () =>
    axios.get(`${MY_TESLA_API}/vehicle/climate`)
        .then(response => response.data)

module.exports = {
    climateOn,
    climateOff,
    climate
}

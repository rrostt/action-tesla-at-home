const axios = require('axios')

const climateOn = ({ accessToken, vehicleId }) =>
    axios.post(`https://owner-api.teslamotors.com/api/1/vehicles/${vehicleId}/command/auto_conditioning_start`,
        {},
        {
            headers: { Authorization: `Bearer ${accessToken}` },
        }
    )

const climateOff = ({ accessToken, vehicleId }) =>
    axios.post(`https://owner-api.teslamotors.com/api/1/vehicles/${vehicleId}/command/auto_conditioning_stop`,
        {},
        {
            headers: { Authorization: `Bearer ${accessToken}` },
        }
    )

const climate = ({ accessToken, vehicleId }) =>
    axios.get(`https://owner-api.teslamotors.com/api/1/vehicles/${vehicleId}/data_request/climate_state`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => response.data.response)

const getToken = ({ login, password }) =>
    axios.post('https://owner-api.teslamotors.com/oauth/token', {
        grant_type: 'password',
        client_id: '81527cff06843c8634fdc09e8ac0abefb46ac849f38fe1e431c2ef2106796384',
        client_secret: 'c7257eb71a564034f9419ee651c7d0e5f7aa6bfbd18bafb5c5c033b093bb2fa3',
        email: login,
        password: password
    })
    .catch(error => {
        console.error('Error getting access token from Tesla servers', JSON.stringify(error), error)
        throw error
    })
    .then(result => result.data)

const refreshToken = ({ refreshToken }) =>
    axios.post('https://owner-api.teslamotors.com/oauth/token', {
        grant_type: 'refresh_token',
        client_id: '81527cff06843c8634fdc09e8ac0abefb46ac849f38fe1e431c2ef2106796384',
        client_secret: 'c7257eb71a564034f9419ee651c7d0e5f7aa6bfbd18bafb5c5c033b093bb2fa3',
        refresh_token: refreshToken
    })
    .catch(error => {
        console.error('Error getting access token from Tesla servers', JSON.stringify(error), error)
        throw error
    })
    .then(result => result.data)

const vehicles = ({ accessToken }) =>
    axios.get('https://owner-api.teslamotors.com/api/1/vehicles', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .catch(error => {
        console.log('unable to get vehicles', error)
        throw error
    })
    .then(response => response.data)
    .then(data => data.response)

module.exports = {
    climateOn,
    climateOff,
    climate,

    getToken,
    refreshToken,
    vehicles
}

const { decodeToken } = require('../helpers/tokens')
const car = require('../services/car')

const device = accessToken => {
    const { tokens } = decodeToken(accessToken)
    const userId = 1
    
    const onSync = async (requestId, res) => {
        console.log('onSync')

        const vehicles = await car.vehicles({ accessToken: tokens.access_token })

        const devices = vehicles.map(({
            vehicle_id: vehicleId,
            vin,
            display_name: name,
            id_s: id
        }) => ({
            id,
            type: 'action.devices.types.HEATER',
            traits: ['action.devices.traits.OnOff'],
            name: {
                defaultNames: ['Tesla Model S'],
                name,
                nicknames: [name, 'Tesla']
            },
            willReportState: false,
            customData: {
                vehicleId,
                vin
            }
        }))

        console.log('devices', devices)

        res.json({
            requestId,
            payload: {
                agentUserId: userId,
                devices
            }
        })
    }

    const onQuery = async (requestId, { devices }, res) => {
        console.log('onQuery', devices)

        const deviceClimates = await Promise.all(
            devices.map(async device => ({
                id: device.id,
                climate: await car.climate({ accessToken: tokens.access_token, vehicleId: device.id })
            }))
        )

        console.log('deviceClimates', deviceClimates)

        // const climateStatus = await car.climate()
        // const isOn = climateStatus.is_climate_on

        const outputDevices = {}
        deviceClimates.forEach(device => {
            outputDevices[device.id] = {
                status: 'SUCCESS',
                online: true,
                on: device.climate.is_climate_on
            }
        })

        res.json({
            requestId,
            payload: {
                devices: outputDevices
            }
        })
    }

    const onExecute = async (requestId, { commands: [{ devices, execution }] }, res) => {
        console.log('onExectute', devices, execution)

        const device = devices[0]

        if (execution[0].command === 'action.devices.commands.OnOff') {
            const turnOn = execution[0].params.on
            if (turnOn)
                await car.climateOn({ accessToken: tokens.access_token, vehicleId: device.id })
            else
                await car.climateOff({ accessToken: tokens.access_token, vehicleId: device.id })
            
            const { is_climate_on: isOn } = await car.climate({ accessToken: tokens.access_token, vehicleId: device.id })

            console.log('turnOn', turnOn, isOn)

            res.json({
                requestId,
                payload: {
                    commands: [{
                        ids: devices.map(({ id }) => id),
                        status: 'SUCCESS',
                        states: {
                            on: isOn,
                            online: true
                        }
                    }]
                }
            })
        }
    }

    return {
        onSync,
        onQuery,
        onExecute
    }
}

module.exports = (req, res) => {
    const {
        requestId,
        inputs: [{
            intent,
            payload
        }]
    } = req.body

    const {
        authorization
    } = req.headers

    const accessToken = authorization.split(' ')[1]
    const aDevice = device(accessToken)

    switch (intent) {
        case 'action.devices.SYNC':
            aDevice.onSync(requestId, res)
            break
        case 'action.devices.QUERY':
            aDevice.onQuery(requestId, payload, res)
            break
        case 'action.devices.EXECUTE':
            aDevice.onExecute(requestId, payload, res)
    }
}

const { decodeToken } = require('../helpers/tokens')
const { climateOn, climateOff, climate } = require('../services/car')

const device = accessToken => {
    const { userId } = decodeToken(accessToken)

    const onSync = (requestId, res) => {
        console.log('onSync')
        res.json({
            requestId,
            payload: {
                agentUserId: userId,
                devices: [
                    {
                        id: '200022',
                        type: 'action.devices.types.HEATER',
                        traits: ['action.devices.traits.OnOff'],
                        name: {
                            defaultNames: ['Tesla Model S'],
                            name: 'Bobo bil',
                            nicknames: ['Bobo car', 'Tesla']
                        },
                        willReportState: false,
                    }
                ]
            }
        })
    }

    const onQuery = async (requestId, { devices }, res) => {
        console.log('onQuery', devices)

        const climateStatus = await climate()
        const isOn = climateStatus.is_climate_on

        const outputDevices = {}
        devices.forEach(device => {
            outputDevices[device.id] = {
                status: 'SUCCESS',
                online: true,
                on: isOn
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

        if (execution[0].command === 'action.devices.commands.OnOff') {
            const turnOn = execution[0].params.on
            if (turnOn)
                await climateOn()
            else
                await climateOff()
            
            const { is_climate_on: isOn } = await climate()

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

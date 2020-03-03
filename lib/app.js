const express = require('express')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use((req, res, next) => {
    console.log(req.url, req.method, req.body)
    next()
})

app.get('/auth', require('./routes/auth').get)
app.post('/auth', require('./routes/auth').post)

app.post('/token', require('./routes/token'))

app.post('/action', require('./routes/action'))

module.exports = app

const express = require('express')
const app = express()
require('dotenv').config()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use((req, res, next) => {
    console.log(req.url, req.headers, req.method, req.body)
    next()
})

app.get('/auth', require('./routes/auth'))

app.post('/token', require('./routes/token'))

app.post('/action', require('./routes/action'))

app.listen(8080)
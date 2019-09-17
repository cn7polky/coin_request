const express = require('express')
const app = express()
const path = require('path')
const router = express.Router()
const compression = require('compression')
const port = process.env.PORT || 9090

app.use(router)
app.use(compression())

app.use("/static", express.static('./src/app/static/'))

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'))
})

router.get('/manifest', (req, res) => {
    res.sendFile(path.join(__dirname + '/manifest.json'))
})

router.get('/sw', (req, res) => {
    res.sendFile(path.join(__dirname + '/sw.js'))
})

router.get('/request', (req, res) => {
    res.sendFile(path.join(__dirname + '/src/app/view/request.html'))
})

app.listen(port)
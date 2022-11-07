const express = require('express');
const app = express();

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    try {
        res.send({
            status: true,
            message: 'server is ready to use'
        })
    } catch (error) {
        res.send({
            status: false,
            message: 'server failed to response'
        })
    }
})


app.listen(port, () => {
    console.log('astrophotography server is running on ', port)
})
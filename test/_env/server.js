const express = require('express')
const app = express()

/* enable parsing of post bodies */
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* define routes */
app.get('/say_hello', (req, res) =>{
    res.send('Hello!') // respond with "Hello!"
})
app.post('/post_data', (req, res) =>{
    res.json(req.body) // respond with request body
})

/* start server */
app.listen(3000, () => console.log('Testing Server listening on port 3000!'))

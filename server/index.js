const express = require('express');
const cors = require('cors');
const connectDB = require('./src/utils/db');
const taskrouter = require("./src/routes/taskRoutes")
require('dotenv').config();


const app = express();
const port = process.env.PORT;
const allowedOrigin = process.env.CLIENT_URL;

app.use(cors({origin: allowedOrigin, credentials: true}));
app.use(express.json());

app.get('/', (req,res) => {
    res.send('Hello World');
})

app.use('/api/tasks', taskrouter);


connectDB().then(() => {
    app.listen(port, ()=>{
        console.log(`Server is running on port ${port}`);
    })
})
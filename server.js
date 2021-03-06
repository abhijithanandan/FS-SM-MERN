const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB()

app.get('/', (req, res) => res.send('API Running'));

// Define Middleware

//Body Parser for POST request
app.use(express.json({ extended: false })); 

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/auth', require('./routes/api/auth'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server Started on port ${PORT}`));
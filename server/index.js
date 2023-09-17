const express=require('express');
const connectDB=require('./config/db');
const app=express();

//Connecting to database
connectDB();

//middleware
app.use(express.json({extended: false}));

//Defining routes
app.use('/api/users',require('./routes/api/users'));
app.use('/api/auth',require('./routes/api/auth'));
app.use('/api/profile',require('./routes/api/profile'));
app.use('/api/posts',require('./routes/api/posts'));


const PORT=process.env.PORT || 3001;

app.listen(PORT,()=>
    console.log(`Server started at ${PORT}`)
);
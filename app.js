import express from "express";
import dotenv from "dotenv"  
import cors from "cors";
import cookieParser from "cookie-parser";

var app = express();
dotenv.config()
app.use(cors(
  {
  origin: "http://localhost:3000", 
  credentials: true,               
}
))
app.use(express.json())
app.use(cookieParser());

import userRoutes from './routes/user_R.js';
import pollRoutes from './routes/poll_R.js';
import voteRoutes from './routes/vote_R.js';

app.use('/user', userRoutes);
app.use('/poll', pollRoutes);
app.use('/vote', voteRoutes);

app.use( (req, res, next) => {
 return res.status(404).json({message:'No-route found', success:false})
});

export default app;
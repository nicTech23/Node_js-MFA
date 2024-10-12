import express, { urlencoded } from "express"
import session from "express-session"
import passport from "passport"
import dotenv from "dotenv"
import cors from "cors"
import http from "http"
import helmet from "helmet"
import compression from "compression"
import dbConnection from "./config/dbConnect.js"
import router from "./route/authRoute.js"

import "./config/passport.js"



dotenv.config();




const app = express()

//MIDDLEWARE
const corsOption = {
    origin: [ "http://localhost:3000" ],
    credetials: true
}
app.use(cors(corsOption))
app.use(express.json({ limit: "100mb" }))
app.use(urlencoded({ limit: "100mb", extended: true }))
app.use(helmet())
app.use(compression())
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000 * 60 
    }
}))


app.use(passport.initialize())
app.use(passport.session())



//ROUTE
app.use("/api/auth", router)
//LISTEN APP
const PORT = process.env.PORT
http.createServer(app)
.listen(PORT, ()=>{
    dbConnection()
    console.log(`Running on port ${PORT}`)
})
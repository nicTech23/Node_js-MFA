import mongoose from "mongoose"

const dbConnection = ()=>{
    mongoose.connect(process.env.MONGO_URL)
    .then((con)=>{
        console.log(`db connected ${con.connection.host}`)
    })
    .catch((err)=>{
        console.log(`db fails to connect Error: ${err.message}`)
    })
}

export default dbConnection;
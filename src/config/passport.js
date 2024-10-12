import {Strategy } from "passport-local"
import passport from "passport"
import User from "../model/user.js"
import bcrypt from "bcryptjs"


const LocalStrategy = Strategy

// const findOrCreate = async (query, userProps)=>{
//     const user = await User.findOne({ query })
//     if (user) {
//         return user
//     } else {
//         user = new User({ userProps })
//         user.save()
//         .then((user)=>{
//             return user
//         })
//         .catch( err => err)
//     }
// }


const verifyFunction = (username, password, done)=>{
    User.findOne({ username })
    .then((user)=>{
        if (user) {
            bcrypt.compare(password, user.password, (err, match)=>{
                if (err) return done(err)
                
                if (match) {
                    return done(null, user)
                } else {
                    return done(null, false, { message: 'Incorrect username or password.' })
                }
            })
        } else {
            return done(null, false, { message: 'Incorrect username or password.' })
        }
    })
    .catch(err => done(err))
}

const strategy = new LocalStrategy(verifyFunction)

export default passport.use(strategy)

passport.serializeUser((user, done)=>{
    done(null, user._id)
})

passport.deserializeUser((userId, done)=>{
    User.findById(userId)
        .then((user)=>{
            done(null, user) 
        })
        .catch(err => done(err))
})



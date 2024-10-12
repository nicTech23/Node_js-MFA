import bcrypt from "bcryptjs"
import User from "../model/user.js"
import speakeasy from "speakeasy"
import qrCode from "qrcode"
import jwt from "jsonwebtoken"
export const register = async (req, res) =>
{
    try {
        const { username, password } = req.body

        const  hashPassword = await bcrypt.hash(password, 10)

        const newUser = new User({username, password: hashPassword, isMfaActive: false})

        await newUser.save()
        
        res.status(201).json({ message: "User registered successfull" })
        
    } catch (error) {
        res.status(500).json({error: "Error registering user", message: error.message
        })
    }
}

export const login = async(req, res)=>{
    if (req.user) {
       res.status(200).json({
           message: "Login successfull",
           username: req.user.username,
           isMfaActive: req.user.isMfaActive,
       })
    } else {
        res.status(401).json({message: "Unauthorize user"})
   }
}

export const authStatus = async(req, res)=>{
     if (req.user) {
       res.status(200).json({
           message: "Login successfull",
           username: req.user.username,
           isMfaActive: req.user.isMfaActive,
       })
    } else {
        res.status(401).json({message: "Unauthorize user"})
   }
}


export const logout = async(req, res)=>{
    if (!req.user) res.status(401).json({ message: "Unauthorize user" })
    req.logout((err) =>{
        if (err) return es.status(400).json({ message: "User not login" })
        res.status(200).json({ message: "User logged out successfull" })
    })
}

export const setup2FA = async(req, res)=>{
    try {
        const user = req.user
        
        // generating secret code in base32 and save it 
        //in database to verify 2FA
        const secret = speakeasy.generateSecret();

        user.twoFactorSecret = secret.base32
        user.isMfaActive = true
        await user.save();

        // generate url for qrcode generation
        const url = speakeasy.otpauthURL({
            secret: secret.base32,
            label: `${req.user.username}`,
            issuer: "nick.com",
            encoding:"base32"
        })
        
        // base 64 qrcode image
        const qrImageUrl = await qrCode.toDataURL(url)
        // res.setHeader('Content-Type', 'image/png');
        // res.send(Buffer.from(qrImageUrl, "base64"))
       
        res.status(200).json({
            //not recommended to pass secret
            secret: secret.base32,
            qrCode: qrImageUrl
        })
        
    } catch (error) {
        res.status(500).json({error: "2FA setup fail", message: error.message
        })
    }
}

export const verify2FA = async(req, res)=>{
    try {

        // getting the code generate by authenticator app
        const { token } = req.body

        const user = req.user

        // verified the 2FA with the secrete store in the database and the token 
        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: "base32",
            token
        })
    

        // generate token for the user if 2fA is verified
        if (verified) {
            const jwtToken = jwt.sign({ username: user.username }, process.env.SECRET, { expiresIn: "1hr" })
            res.status(200).json({token: jwtToken, message: "2FA successfull"})
        } else {
            res.status(401).json({message: "Invalid 2FA token"})
        }

    } catch (error) {
        res.status(500).json({error: "verifying 2fA fail", message: err.message})
    }
}

export const reset2FA = async(req, res)=>{
    try {
        const user = req.user
        user.twoFactorSecret = ""
        user.isMfaActive = false
        await user.save();
        res.status(200).json({message: "2FA reset successfull"})
    } catch (error) {
        res.status(500).json({error: "Error reseting 2fA", message: err.message})
    }
}
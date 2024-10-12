import { Router } from "express";
import passport from "passport";
import {
    register,
    login,
    authStatus,
    logout,
    setup2FA,
    verify2FA,
    reset2FA 
 } from "../controller/authController.js";
import isAuthorized from "../../middleware/isAuth.js";

const router = Router()

//REGISTERED ROUTE
router.post("/register", register)
//LOGIN ROUTE
router.post("/login", passport.authenticate("local"), login)
//AUTH STATUS ROUTE
router.get("/status", authStatus)
//LOGOUT ROUTE
router.post("/logout", logout)


//2FA SETUP
router.post("/2fa/setup",isAuthorized, setup2FA)

//VERIFY ROUTE
router.post("/2fa/verify",isAuthorized, verify2FA)

//RESET ROUTE
router.post("/2FA/reset",isAuthorized, reset2FA)


export default router
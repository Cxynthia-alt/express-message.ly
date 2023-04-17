/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/


/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */


const express = require("express")
const ExpressError = require("../expressError")
const router = express.Router()
const db = require("../db")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { BCRYPT_WORK_FACTOR, SECRET_KEY } = require("../config")
const { ensureLoggedIn } = require("../middleware/auth")
const User = require("../models/user")



router.post('/login', async (req, res, next) => {
  try {
    let { username, password } = req.body
    if (!username || !password) {
      throw new ExpressError('Username and password required', 404)
    }
    if (await User.authenticate(username, password)) {
      let token = jwt.sign({ username }, SECRET_KEY)
      User.updateLoginTimestamp(username)
      return res.json({ token })
    } else {
      throw new ExpressError('Username/password invalid', 404)
    }
  } catch (err) {
    return next(err)
  }
})

router.post('/register', async (req, res, next) => {
  try {
    let { username } = await User.register(req.body)
    let token = jwt.sign({ username }, SECRET_KEY)
    User.updateLoginTimestamp(username)
    return res.json({ token })
  } catch (err) {
    if (err.code === '23505') {
      return next(new ExpressError("Username taken. Please pick another", 400))
    }
    return next(err)
  }
})

//make sure the loggedin user can see the info
// router.get('/topsecret', ensureLoggedIn, async (req, res, next) => {
//   try {
//     const token = req.body._token
//     const data = jwt.verify(token, SECRET_KEY)
//     return res.json({ message: "Signed In." })
//   } catch (err) {
//     return next(new ExpressError("Please log in first", 401))
//   }
// })


module.exports = router

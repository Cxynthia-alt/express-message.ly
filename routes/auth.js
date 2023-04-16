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


router.post('/register', async (req, res, next) => {
  try {
    const { username, password, first_name, last_name, phone } = req.body
    if (!username || !password) {
      throw new ExpressError('Username and password required', 404)
    }
    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR)
    const result = await db.query(`
    INSERT INTO users (username, password, first_name, last_name, phone, join_at)
    VALUES($1, $2, $3, $4, $5, current_timestamp)
    RETURNING username, first_name, last_name, join_at`, [username, hashedPassword, first_name, last_name, phone])
    return res.json(result.rows[0])
  } catch (err) {
    if (err.code === '23505') {
      return next(new ExpressError("Username taken. Please pick another", 400))
    }
    return next(err)
  }
})


router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      throw new ExpressError('Username and password required', 404)
    }
    const result = await db.query(`
    SELECT username, password
    FROM users
    WHERE username =$1`, [username])
    const user = result.rows[0]
    const hashedPassword = result.rows[0].password
    if (user) {
      if (await bcrypt.compare(password, hashedPassword)) {
        const token = jwt.sign({ username }, SECRET_KEY)
        return res.json({ message: 'Logged in!', token: token })
      }
    }
    throw new ExpressError('Username/password invalid', 404)
  } catch (err) {
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

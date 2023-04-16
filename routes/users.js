const express = require("express")
const ExpressError = require("../expressError")
const router = express.Router()
const db = require("../db")
const User = require("../models/user")
const { ensureLoggedIn, ensureCorrectUser, authenticateJWT } = require("../middleware/auth")


/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/


router.get('/', ensureLoggedIn, async (req, res, next) => {
  try {
    const result = await User.all()
    return res.json({ users: result })
  } catch (err) {
    return next(err)
  }
})
/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/

router.get('/:username', ensureCorrectUser, async (req, res, next) => {
  try {
    const username = req.params.username
    const result = await User.get(username)
    return res.json({ user: result })
  } catch (err) {
    return next(err)
  }
})

/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router.get('/:username/to', ensureCorrectUser, async (req, res, next) => {
  try {
    const username = req.params.username
    const result = await User.messagesTo(username)
    return res.json({ messages: result })
  } catch (err) {
    return next(err)
  }
})


/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router.get('/:username/from', ensureCorrectUser, async (req, res, next) => {
  try {
    const username = req.params.username
    const result = await User.messagesFrom(username)
    return res.json({ messages: result })
  } catch (err) {
    return next(err)
  }
})



// router.get('/authenticate', async (req, res, next) => {
//   try {
//     const { username, password } = req.query
//     const isValid = User.authenticate(username, password)
//     return res.json({ result: isValid })
//   } catch (err) {
//     return next(err)
//   }
// })

module.exports = router

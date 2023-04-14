/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/


/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/


/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/


/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

const express = require("express")
const ExpressError = require("../expressError")
const router = express.Router()
const db = require("../db")
const User = require("../models/user")

router.get('/authenticate', async (req, res, next) => {
  try {
    const { username, password } = req.query
    const isValid = User.authenticate(username, password)
    return res.json({ result: isValid })
  } catch (err) {
    return next(err)
  }
})

module.exports = router

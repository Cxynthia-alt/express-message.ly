const express = require("express")
const ExpressError = require("../expressError")
const router = express.Router()
const db = require("../db")
const Message = require("../models/message")
const { ensureLoggedIn, ensureCorrectUser, authenticateJWT } = require("../middleware/auth")


/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/

router.get(':id', ensureLoggedIn, async (req, res, next) => {
  try {
    const id = req.params.id
    const result = await Message.get(id)
    return res.json({ message: result })
  } catch (err) {
    return next(err)
  }
})


/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/

router.post('/', ensureLoggedIn, async (req, res, next) => {
  try {
    const { to_username, body } = req.body
    const result = await Message.create({ username, to_username, body })
    return res.json({ message: result })
  } catch (err) {
    return next(err)
  }
})
/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/

router.post('/:id/read', ensureCorrectUser, async (req, res, next) => {
  try {
    const id = req.body.id
    const result = await Message.markRead(id)
    return res.json({ message: result })
  } catch (err) {
    return next(err)
  }
})

module.exports = router

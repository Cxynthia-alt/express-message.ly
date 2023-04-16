const User = require("./models/user")



async function test() {
  try {
    const result = await User.messagesFrom('Elie')
    console.log(result)
  } catch (e) {
    console.log(e)
  }

}
test()

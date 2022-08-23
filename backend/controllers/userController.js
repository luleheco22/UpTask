import generateId from "../helpers/generateId.js"
import generateJWT from "../helpers/genarateJWT.js"
import User from "../models/User.js"
import { emailRegister,emailForgetPassword } from "../helpers/sendEmail.js"

const register = async (req, res) => {
  try {
    //Evitar registros duplicados
    const { email } = req.body
    const existsUser = await User.findOne({ email })
    if (existsUser) {
      const error = new Error('User already exists')
      return res.status(400).json({ msg: error.message })
    } else {
      const user = new User(req.body)
      user.token = generateId()
      await user.save()
      //Send email
      emailRegister({
        name:user.name,
        email:user.email,
        token:user.token
      })
      res.json({msg:'User created correctly, Check your email to verify the account'})
    }
  } catch (error) {
    console.log(error)
  }
}


const authenticate = async (req, res) => {
  const { email, password } = req.body
  //Comprobar si el usuario existe
  const user = await User.findOne({ email })
  if (!user) {
    const error = new Error('User does not exist')
    return res.status(404).json({ msg: error.message })
  }

  //Comprobar si el usuario esta confirmado
  if (!user.confirmado) {
    const error = new Error('Your account has not been confirmed')
   return res.status(404).json({ msg: error.message })
  }
  //Comprobar su password
  if (await user.checkPassword(password)) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateJWT(user._id)
    })
  } else {
    const error = new Error('The password is wrong')
   return res.status(404).json({ msg: error.message })
  }
}

const confirm = async (req, res) => {
  const { token } = req.params
  const userConfirm = await User.findOne({ token })
  if (userConfirm) {
    try {
      userConfirm.confirmado = true
      userConfirm.token = ''
      await userConfirm.save()
      res.json({ msg: 'User confirmed successfully' })
    } catch (error) {
      console.log(error)
    }
  } else {
    const error = new Error('Invalid token')
    res.status(404).json({ msg: error.message })
  }
}

const forgetPassword = async (req, res) => {
  const { email } = req.body
  const user = await User.findOne({ email })
  if (user) {
    try {
      user.token = generateId()
      await user.save()
      emailForgetPassword({
        name:user.name,
        email:user.email,
        token:user.token
      })

      res.json({ msg: 'We have sent an email with the instructions' })
    } catch (error) {
      console.log(error)
    }
  } else {
    const error = new Error('User does not exist')
    res.status(404).json({ msg: error.message })
  }

}

const checkToken = async (req, res) => {
  const { token } = req.params

  const validToken = await User.findOne({ token })

  if (validToken) {
    res.json({ msg: 'Valid token and user exists' })
  } else {
    const error = new Error('Invalid Token')
    res.status(404).json({ msg: error.message })
  }
}

const newPassword = async (req, res) => {
  const { token } = req.params
  const { password } = req.body
  const user = await User.findOne({ token })

  if (user) {
    user.password = password
    user.token = ''
    try {
      await user.save()
      res.json({ msg: 'Password modified successfully' })
    } catch (error) {
      console.log(error)
    }
  } else {
    const error = new Error('Invalid Token')
    res.status(404).json({ msg: error.message })
  }
}

const profile = async (req, res) => {
  const { user } = req
  res.json(user)
}

export {
  register,
  authenticate,
  confirm,
  forgetPassword,
  checkToken,
  newPassword,
  profile
}
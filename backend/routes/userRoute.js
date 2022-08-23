import express from 'express'
import { register, authenticate,confirm,forgetPassword,checkToken,newPassword,profile } from '../controllers/userController.js'
import checkAuth from '../middlewares/checkAuth.js'
const router = express.Router()






//Autenticación , Registro y Confirmacion de Usuarios
router.post('/', register)//Crea un nuevo usuario
router.post('/login', authenticate)
router.get('/confirm/:token',confirm)
router.post('/forget-password',forgetPassword)
// router.get('/forget-password/:token',checkToken)
// router.post('forget-password/:token',newPassword)
router.route('/forget-password/:token')
.get(checkToken)
.post(newPassword)

router.get('/profile', checkAuth,profile)


export default router
import {Router} from 'express'
import UserController from '../controllers/user_C.js'
import auth from '../middlewares/userAuth.js'
const router = Router()

router.post('/', UserController.addUser)
router.post('/login', UserController.login)
router.get('/logout',auth, UserController.logout)

export default router
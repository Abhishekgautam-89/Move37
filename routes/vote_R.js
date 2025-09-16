import Router from 'express'
import VoteController from '../controllers/vote_C.js'
import auth from '../middlewares/userAuth.js'

const router = Router()

router.post('/',auth, VoteController)

export default router
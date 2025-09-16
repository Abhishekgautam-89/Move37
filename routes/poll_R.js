import {Router} from 'express'
import auth from '../middlewares/userAuth.js'
import PollController from '../controllers/poll_C.js'

const router = Router()
router.post('/',auth, PollController.createPoll)
router.get('/', PollController.getPoll)
router.get('/:id', PollController.getSinglePoll)

export default router
/// render the serverside pages and send it to the client

import express from 'express'
import { featuresController } from '../controllers/featuresController.mjs';

const featuresRouter = express.Router()

// endpoints

featuresRouter.get('/publicLeaderboard', featuresController.RenderPublicLeaderboard)
featuresRouter.get('/publicStatistics',  featuresController.RenderPublicStatistics)


export default featuresRouter;

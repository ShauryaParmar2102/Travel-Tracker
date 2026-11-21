import express from 'express'
import {ApiController} from '../controllers/apiController.mjs'

const ApiRouter = express.Router()

//create endpoints for router

// // something like 👇
// ApiRouter.get('/getAllPriceData', ApiController.GetAllPriceData)
// ApiRouter.get('/getAllHotelData', ApiController.GetAllHotelData) <- work on this to test go to (localhost:8080/api/getAllHotelData)

ApiRouter.get('/getAllHotelData', ApiController.GetAllHotels)
ApiRouter.get('/getAllDestinationData', ApiController.GetAllDestinations)

ApiRouter.get('/getAllTrips',ApiController.GetAllTrips)

ApiRouter.post('/NewTrip' , ApiController.NewTrip)
ApiRouter.delete('/deleteTrip/:id', ApiController.DeleteTrip)

ApiRouter.put('/UpdateTrip', ApiController.UpdateTrip)

// // can only be a POST if you're doing this through the 'form'
// ApiRouter.post('/DeleteTrip' , ApiController.DeleteTrip)

// // PUT for when something that is stored is being updated
// ApiRouter.put('/UpdateTrip' , ApiController.UpdateTrip)

export default ApiRouter


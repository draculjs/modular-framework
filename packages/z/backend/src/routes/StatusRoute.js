import express from 'express';
export let statusRoute = express.Router();

//STATIC FILES
statusRoute.get('/status',  (req, res) => {
    res.json({status:"RUNNING"})
})

export default statusRoute

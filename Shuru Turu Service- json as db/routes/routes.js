const express = require('express'),
    userRoutes = require('./tours');

var router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to Shuru-Turu web service!');
});

//CRUD - create read update delete
router.get('/tours', userRoutes.getTours); // Read all tours
router.get('/tours/:id', userRoutes.getTour); // Read specific tour
router.post('/tours', userRoutes.createTour); // Create a new tour
router.put('/tours/:id', userRoutes.updateTour); // Update a tour or a site (depend on body params)
//router.put('/tours/:id', userRoutes.createSiteInPath); // Update a site in a tour
router.delete('/tours/:id/:site_name', userRoutes.deleteSite); // Delete a site in a tour
router.delete('/tours/:id', userRoutes.deleteTour); // Delete a tour


module.exports = router;
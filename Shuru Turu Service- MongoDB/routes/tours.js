const Tour = require('../models/tour');
const Guide = require('../models/guide');

function checkIfKeysExist(json, keys) {
    // Return true if all keys are in json file
    for (let key of keys)
        if (json[key] == undefined)
            return false;
    return true;
}

function isValidTour(tour) {
    if (Object.keys(tour).length == 0)
        return false;

    var json = tour;
    if (json == undefined)
        return false;

    var general_fields = ["name", "start_date", "duration", "price", "guide"];
    if (!checkIfKeysExist(json, general_fields))
        return false;

    let keys = Object.keys(tour);
    for (let key of keys)
        if (!general_fields.includes(key)) return false;

    return true;
}

function isValidTourUpdate(update_fields) {
    // Assuming new tour ID will be sent at tour_id parameter in json file
    if (Object.keys(update_fields).length == 0)
        return false;

    let toCheck = ["start_date", "duration", "price"];
    let found_site = false;
    for (let key of Object.keys(update_fields)) {
        for (let field of toCheck)
            if (key == field)
                found_site = true;
        if (!found_site)
            return false;
        found_site = false;
    }

    return true;
}

module.exports = {

    getTours: function (req, res) {
        Tour.find().populate('Tour').then(tour => {
            res.send(tour.sort(function (a, b) {
                if (a["name"] < b["name"]) return -1;
                if (a["name"] == b["name"]) return 0;
                return 1;
            }))
        }
        ).catch(e => res.status(500).send())
    },

    getGuides: function (req, res) {
        Guide.find().populate('Guide').then(guide => res.send(guide)
        ).catch(e => res.status(500).send())
    },

    // Read specific tour
    getTour: function (req, res) {
        const tour_name = req.params["id"];
        Tour.find({ "name": tour_name }, function (err, doc) {
            if (err) {
                res.status(500).send();
                return;
            }
            else
                res.send(doc);
            return;
        });
    },

    getGuide: function (req, res) {
        const guide_id = req.params["id"];
        Guide.find({ "_id": guide_id }, function (err, doc) {
            if (err) {
                res.status(500).send();
                return;
            }
            else
                res.send(doc);
            return;
        })
    },

    // Create a new tour
    createTour: function (req, res) {

        // Add a new tour
        if (!isValidTour(req.body)) {
            res.sendStatus(400);
            console.log("ERROR: Invalid parameters (createTour)");
            return;
        }

        const tour = new Tour(req.body);

        tour.save().then(tour =>
            res.status(201).send(tour)
        ).catch(e => res.status(400).send(e))
    },

    createGuide: function (req, res) {
        const guide = new Guide(req.body);

        guide.save().then(guide =>
            res.status(201).send(guide)
        ).catch(e => res.status(400).send(e))
    },


    // Update a tour or create site in path
    updateTour: function (req, res) {

        let keys = Object.keys(req.body);
        if (keys.length == 0) {
            res.status(200).send('Updated succesfully. FYI: No parameters sent on request body.');
            return;
        }

        let tour_id = req.params["id"];
        let fields_to_update = req.body;

        const tour = Tour.findOne({ "name": tour_id }, function (err, doc) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            else {
                if (!doc) {
                    res.status(400).send("Tour not exists");
                    return;
                }
                if ((keys.includes("price") || keys.includes("start_date") || keys.includes("duration")) && isValidTourUpdate(req.body)) {
                    // update tour case
                    Tour.updateOne({ "name": tour_id }, fields_to_update, fields_to_update, function callback(err, numAffected) {
                        if (err) {
                            res.status(500).send(err);
                            return;
                        }
                        else {
                            res.status(200).send("Updated succefully");
                            return;
                        }
                    });
                }
                else if (keys.includes("name") && keys.includes("country") && keys.length == 2) {
                    // create site in path case
                    let path = doc.path;
                    if (path == undefined)
                        path = [];

                    for (let json of path) {
                        if (json["name"] == req.body["name"]) {
                            res.send("Site already exists");
                            return;
                        }
                    }

                    path.push(req.body);

                    Tour.updateOne({ "name": tour_id }, { "path": path }, function callback(err, numAffected) {
                        if (err) {
                            res.status(500).send(err);
                            return;
                        }
                        else {
                            res.status(200).send("Updated succefully");
                            return;
                        }
                    });
                }
                else {
                    res.status(400).send("Request body illegal");
                    return;
                }
            }
        });
        return;
    },

    // Delete a site in a tour
    deleteSite: function (req, res) {

        const tour_id = req.params["id"];
        const site_name = req.params["site_name"];

        if (site_name == null || !site_name) {
            res.status(400).send("site name parameter = null");
            return;
        }


        const tour = Tour.findOne({ "name": tour_id }, function (err, doc) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            else {
                if (!doc) {
                    res.status(400).send("Tour not exists");
                    return;
                }

                let path = doc.path;
                if (path == undefined) {
                    path = [];
                    res.send("Site not exists");
                    return;
                }

                let found_site = false;
                for (let site of path)
                    if (site["name"] == site_name && !found_site) {
                        path.splice(path.findIndex(e => e.name == site_name), 1);
                        found_site = true;
                    }

                if (!found_site) {
                    res.send("Site is not exists");
                    return;
                }

                Tour.updateOne({ "name": tour_id }, { "path": path }, function callback(err, numAffected) {
                    if (err) {
                        res.status(500).send(err);
                        return;
                    }
                    else {
                        res.status(200).send("Site deleted succefully");
                        return;
                    }
                });
            }
        });
    },

    // Delete a tour
    deleteTour: function (req, res) {

        const tour_id = req.params["id"];
        Tour.findOne({ "name": tour_id }, function (err, doc) {
            Tour.remove({ "_id": doc["_id"] }, function (err, doc2) {
                if (err) res.status(500).send(err);
                else {
                    if (doc2.deletedCount == 0) {
                        res.status(400).send("No such tour");
                        return;
                    }
                    else res.status(200).send("Tour deleted");

                }
            });
        });
    }
};
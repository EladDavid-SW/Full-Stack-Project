const { json } = require('express');
const fs = require('fs');

// Variables
const dataPath = './data/tour-options.json';

// Helper methods
const readFile = (callback, returnJson = false, filePath = dataPath, encoding = 'utf8') => {
    fs.readFile(filePath, encoding, (err, data) => {
        if (err) {
            console.log(err);
        }
        callback(returnJson ? JSON.parse(data) : data);
    });
};

const writeFile = (fileData, callback, filePath = dataPath, encoding = 'utf8') => {
    fs.writeFile(filePath, fileData, encoding, (err) => {
        if (err) {
            console.log(err);
        }

        callback();
    });
};

function sortByKey(jsObj) {
    var sortedArray = [];

    // Push each JSON Object entry in array by [key, value]
    for (var i in jsObj) {
        sortedArray.push([i, jsObj[i]]);
    }

    // Run native sort function and returns sorted array.
    return sortedArray.sort();
}

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

    var json = tour[Object.keys(tour)[0]];
    if (json == undefined)
        return false;

    var general_fields = ["start_date", "duration", "price", "guide"];
    if (!checkIfKeysExist(json, general_fields))
        return false;

    var guide = json["guide"];
    let guide_fields = ["name", "email", "cellular"];
    if (!checkIfKeysExist(guide, guide_fields))
        return false;

    return true;
}

function isValidTourUpdate(update_fields) {
    // Assuming new tour ID will be sent at tour_id parameter in json file
    if (Object.keys(update_fields).length == 0)
        return false;

    let toCheck = ["start_date", "duration", "price", "name", "email", "cellular"];
    let found = false;
    for (let key of Object.keys(update_fields)) {
        for (let field of toCheck)
            if (key == field)
                found = true;
        if (!found)
            return false;
        found = false;
    }

    return true;
}

function isValidSite(site_detaild) {
    let len = Object.keys(site_detaild).length;
    if (len == 0 || len > 2) return false;
    let toCheck = ["name", "country"];
    if (!site_detaild["name"] || !site_detaild["country"]) return false;
    return checkIfKeysExist(site_detaild, toCheck);
}

// Update a site in a tour
function createSiteInPath(req, res) { //push to array :)
    if (!isValidSite(req.body)) {
        res.sendStatus(400);
        console.log("ERROR: Invalid parameters (updateTour)");
        return;
    }

    readFile(data => {

        const tour_id = req.params["id"];

        // Check if tour already exists:
        if (data[tour_id] == undefined) {
            res.send("Tour is not exists");
            return;
        }

        // Validate that path exists:
        if (data[tour_id]["path"] == undefined) {
            data[tour_id]["path"] = [];
        }
        let path = data[tour_id]["path"];
        for (let json of path) {
            if (json["name"] == req.body["name"]) {
                res.send("Site already exists");
                return;
            }

        }
        path.push(req.body);

        writeFile(JSON.stringify(data, null, 2), () => {
            res.status(200).send('Site deatails updated succesfully');
        });
    },
        true);
}

module.exports = {
    // Read all tours sorted by name value
    getTours: function (req, res) {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                console.log(err);
                res.sendStatus(500); // Internal Server Error server response              
            }
            else {
                let json = JSON.parse(data);
                res.send(sortByKey(json));
            }
        });
    },

    // Read specific tour
    getTour: function (req, res) {
        const tour_id = req.params["id"];
        console.log(tour_id);
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                console.log("ERROR:\n")
                console.log(err);
                res.sendStatus(500); // Internal Server Error server response 
            }
            else {
                let json = JSON.parse(data);

                if (json[tour_id] != undefined)
                    res.send(json[tour_id]);
                else
                    res.send("Tour does not exist");
            }
        });
    },

    // Create a new tour
    createTour: function (req, res) {
        readFile(data => {

            // Add a new tour
            if (!isValidTour(req.body)) {
                res.sendStatus(400);
                console.log("ERROR: Invalid parameters (createTour)");
                return;
            }
            var tour_id = Object.keys(req.body)[0];

            // Check if tour already exists:
            if (data[tour_id] != undefined) {
                res.sendStatus(400);
                console.log("ERROR: Tour exists already (createTour)");
                return;
            }

            data[tour_id] = req.body[tour_id];

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send('A new tour added');
            });
        },
            true);

    },


    // Update a tour
    updateTour: function (req, res) {

        if (Object.keys(req.body).length == 0) {
            res.status(200).send('Updated succesfully. FYI: No parameters to update in request body.');
            return;
        }

        if (!isValidTourUpdate(req.body)) {
            createSiteInPath(req, res);
            return;
        }

        readFile(data => {

            let tour_id = req.params["id"];

            // Check if tour already exists:
            if (data[tour_id] == undefined) {
                res.send("Tour is not exists");
                return;
            }

            let fields_to_update = Object.keys(req.body);
            let tour_to_update = data[tour_id];
            let tour_keys = Object.keys(tour_to_update);
            for (let field of fields_to_update) {
                if (tour_keys.includes(field))
                    tour_to_update[field] = req.body[field];
                else 
                    tour_to_update["guide"][field] = req.body[field];
            }

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send('Tour updated succesfully');
            });
        },
            true);
    },

    // Delete a site in a tour
    deleteSite: function (req, res) {

        readFile(data => {
            const tour_id = req.params["id"];
            const site_name = req.params["site_name"];

            if (site_name == null || !site_name) {
                res.sendStatus(400);
                console.log("ERROR: Invalid parameters (createTour)");
                return;
            }

            // Check if tour already exists:
            if (data[tour_id] == undefined) {
                res.send("Tour is not exists");
                return;
            }

            // Validate that path exists:
            if (!data[tour_id]["path"]) {
                data[tour_id]["path"] = [];
            }
            let path = data[tour_id]["path"];

            // Special case: delete all sites
            if (site_name == "ALL") {
                data[tour_id]["path"] = [];
                writeFile(JSON.stringify(data, null, 2), () => {
                    res.status(200).send(`Site removed`);
                });
                res.status(200).send(`All sites removed`);
                return;
            }

            if (path.findIndex(e => e.name == site_name) == -1) {
                res.send("Site name not found");
                return;
            }

            path.splice(path.findIndex(e => e.name == site_name), 1);

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`Site removed`);
            });
        },
            true);
    },

    // Delete a tour
    deleteTour: function (req, res) {

        readFile(data => {
            const tour_id = req.params["id"];

            // Check if tour already exists:
            if (data[tour_id] == undefined) {
                res.send("Tour is not exists");
                return;
            }


            delete data[tour_id];

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`Tour removed`);
            });
        },
            true);
    }
};
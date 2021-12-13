// Upper line
let comp_name = $("<h4>Shuru Turu Tours</h4>").addClass("Name").attr('id', "Name");
let upperLine = $("<div></div>").addClass("upperLine").append(comp_name);

// Options section
let sub_title = $("<h5>Our Tours:</h5>").addClass("title");
let add_tour_butt = $("<button></button>").text("Add tour").addClass("button").click(addTour);
let add_guide_butt = $("<button></button>").text("Add guide").addClass("button").click(addGuide);
let sort_by_name = $("<button></button>").text("Sort up by name").addClass("button").click(sortByName);
let sort_by_price = $("<button></button>").text("Sort up by price").attr('id', "sort").addClass("button").click(sortByPrice);
let sort_by_start_date = $("<button></button>").text("Sort up by start date").addClass("button").click(sortByStartDate);
let sort_by_duration = $("<button></button>").text("Sort up by up duration").addClass("button").click(sortByDuration);
let sortD_by_name = $("<button></button>").text("Sort down by name").addClass("button").click(sortD_ByName);
let sortD_by_price = $("<button></button>").text("Sort down by price").attr('id', "sort").addClass("button").click(sortD_ByPrice);
let sortD_by_start_date = $("<button></button>").text("Sort down by start date").addClass("button").click(sortD_ByStartDate);
let sortD_by_duration = $("<button></button>").text("Sort down by duration").addClass("button").click(sortD_ByDuration);
let options = $("<div></div>").addClass("options").append(sub_title).append(sort_by_name).append(sort_by_price).append(sort_by_start_date).append(sort_by_duration);
options.append(sortD_by_name).append(sortD_by_price).append(sortD_by_start_date).append(sortD_by_duration).append(add_tour_butt).append(add_guide_butt);
// Down line
let add_tour_butt2 = $("<button></button>").text("Add tour").addClass("down_button").click(addTour);
let add_guide_butt2 = $("<button></button>").text("Add a new guide").addClass("down_button").click(addGuide);
let down_line = $("<div></div>").text("Enjoy the moment with us :)").addClass("options").append(add_tour_butt2).append(add_guide_butt2);

// Tour deatails table
let tours_content = $("<div></div>").attr('id', "tours_cont").addClass("toursDiv");
let tours_table = $("<table></table>").addClass("table");
tours_content.append(tours_table);

async function addTour(event) {
    location.href = 'http://localhost:3001/add_tour';
}

async function addGuide(event) {
    location.href = 'http://localhost:3001/createGuide';
}

async function editTourDetails(event) {
    let tour_id = event.target.getAttribute("tour_id");
    let url = 'http://localhost:3001/edit_tour/' + tour_id;
    location.href = url;
}

async function sortByName(event) {
    tours = await loadTours();
    let guides = await loadGuides();
    tours_table.empty();

    toursToTable(tours, guides);
}

async function sortByPrice(event) {
    tours = await loadTours();
    let sorted = await tours.sort(function (a, b) {
        if (a["price"] < b["price"]) return -1;
        if (a["price"] == b["price"]) return 0;
        return 1;
    });

    let guides = await loadGuides();
    tours_table.empty();

    toursToTable(sorted, guides);
}

function biggerDate(a, b) {
    // return 1 if a > b, -1 if a < b and 0 if equel
    a_year = parseInt(a.slice(6));
    b_year = parseInt(b.slice(6));
    a_month = parseInt(a.slice(3, 5));
    b_month = parseInt(b.slice(3, 5));
    a_day = parseInt(a.slice(0, 2));
    b_day = parseInt(b.slice(0, 2));
    console.log(a_day, a_month, a_year);
    if (a_year > b_year) return 1;
    else if (b_year > a_year) return -1;
    else if (a_month > b_month) return 1;
    else if (b_month > a_month) return -1;
    else if (a_day > b_day) return 1;
    else if (b_day > a_day) return -1;
    else
        return 0;
}

async function sortByStartDate(event) {
    tours = await loadTours();
    let guides = await loadGuides();
    let sorted = await tours.sort(function (a, b) {
        return biggerDate(a["start_date"], b["start_date"]);
    });

    tours_table.empty();
    toursToTable(sorted, guides);
}

async function sortByDuration(event) {
    tours = await loadTours();
    let sorted = await tours.sort(function (a, b) {
        let first = a["duration"];
        let second = b["duration"];
        if (first == undefined) first = -10000;
        if (second == undefined) second = -10000;
        if (first < second) return -1;
        if (first == second) return 0;
        return 1;
    });

    let guides = await loadGuides();
    tours_table.empty();
    toursToTable(sorted, guides);
}

async function sortD_ByName(event) {
    tours = await loadTours();
    let guides = await loadGuides();
    tours_table.empty();
    toursToTable(tours.reverse(), guides);
}

async function sortD_ByPrice(event) {
    tours = await loadTours();
    let sorted = await tours.sort(function (a, b) {
        if (a["price"] < b["price"]) return -1;
        if (a["price"] == b["price"]) return 0;
        return 1;
    }).reverse();

    let guides = await loadGuides();
    tours_table.empty();
    toursToTable(sorted, guides);
}

async function sortD_ByStartDate(event) {
    tours = await loadTours();
    let guides = await loadGuides();
    let sorted = await tours.sort(function (a, b) {
        return biggerDate(a["start_date"], b["start_date"]);
    }).reverse();

    tours_table.empty();
    toursToTable(sorted, guides);
}

async function sortD_ByDuration(event) {
    tours = await loadTours();
    let sorted = await tours.sort(function (a, b) {
        let first = a["duration"];
        let second = b["duration"];
        if (first == undefined) first = -10000;
        if (second == undefined) second = -10000;
        if (first < second) return -1;
        if (first == second) return 0;
        return 1;
    }).reverse();

    let guides = await loadGuides();
    tours_table.empty();
    toursToTable(sorted, guides);
}

let tours_list = [];
async function loadTours() {

    const result = await $.ajax({
        url: "http://localhost:3001/tours",
        success: function (tours_l) {
            tours_list = tours_l;
            return tours_l;
        },
        error: function (jqXhr, status, errorM) { // Error case
            console.log("Error: " + errorM)
        }
    });
    return result;
}

let guides_list = [];
async function loadGuides() {

    const result = await $.ajax({
        url: "http://localhost:3001/Guides",
        success: function (guide) {
            guides_list = guide;
            return guide_list;
        },
        error: function (jqXhr, status, errorM) { // Error case
            console.log("Error: " + errorM)
        }
    });
    return result;
}

let guide_list = [];
async function loadGuide(guide_id) {

    const result = await $.ajax({
        url: "http://localhost:3001/guides/" + guide_id,
        success: function (guide) {
            guides_list.push(guide);
            return guide;
        },
        error: function (jqXhr, status, errorM) { // Error case
            console.log("Error: " + errorM)
        }
    });
    return guide_list;
}

function tableHeadLines() {
    headlines = ["Name", "Start date", "Duration", "Price", "Guide", "Tour sites", "Edit tour"];
    let row = $("<tr></tr>");
    for (let headline of headlines) {
        let col = $("<td></td>").addClass("border_headLine").text(headline);
        row.append(col);
    }
    tours_table.append(row);
}

async function deleteSite(event) {
    let tour_id = event.target.getAttribute("tour_id");
    let site_name = event.target.getAttribute("site_name");
    await $.ajax({
        // the server script you want to send your data to
        'url': 'http://localhost:3001/tours/' + tour_id + '/' + site_name,
        type: 'DELETE',
    });

    // Reload the table
    tours_table.empty();
    let tours = await loadTours();
    let guides = await loadGuides();

    toursToTable(tours, guides);
}

async function deleteTour(event) {
    let tour_id = event.target.getAttribute("tour_id");

    await $.ajax({
        'url': 'http://localhost:3001/tours/' + tour_id,
        type: 'DELETE',
    });

    // Reload the table
    tours_table.empty();
    let tours = await loadTours();
    let guides = await loadGuides();

    toursToTable(tours, guides);
}

async function addSite(event) {
    let tour_id = event.target.getAttribute("tour_id");
    let url = 'http://localhost:3001/add_site/' + tour_id;
    location.href = url;
}

async function toursToTable(tours, guides) {
    tableHeadLines();
    for (let tour of tours) {
        let row = $("<tr></tr>");
        let name_col = $("<td></td>").addClass("border").text(tour["name"]);
        let start_date_col = $("<td></td>").addClass("border").text(tour["start_date"]);
        let duration_col = $("<td></td>").addClass("border").text(tour["duration"]);
        let price_col = $("<td></td>").addClass("border").text(tour["price"]);

        let guide_col = $("<td></td>").addClass("border");
        let guide_json;
        for (let guide of guides) {
            if (guide["_id"] == tour["guide"]) {
                guide_json = guide;
                break;
            }
        }

        if (guide_json == undefined)
            guide_col.text("No Guide founded");
        else
            guide_col.text("Name: " + guide_json["name"]).append($("<br>")).append("Email: " + guide_json["email"]).append($("<br>")).append("Cellular: " + guide_json["cellular"]);



        let tour_sites_col = $("<td></td>").addClass("border");
        let sites = tour["path"];
        if (sites.length > 0)
            for (let site of sites) {
                tour_sites_col.append("Name: " + site["name"]).append($("<br>"));
                tour_sites_col.append("Country: " + site["country"]).append($("<br>"));
                let delete_site = $("<button></button>").text('Delete ' + site["name"] + ' site').attr('tour_id', tour["name"]).attr('site_name', site["name"]).click(deleteSite);
                tour_sites_col.append(delete_site).append($("<br>"));
            }

        // Forms buttons:
        let delete_tour = $("<button></button>").text('Delete tour').attr('tour_id', tour["name"]).click(deleteTour);
        let edit_tour_details = $("<button></button>").text('Edit details').attr('tour_id', tour["name"]).click(editTourDetails);
        let add_site = $("<button></button>").text('Add a site').attr('tour_id', tour["name"]).click(addSite);
        let edit_col = $("<td></td>").addClass("border").append(delete_tour).append($("<br>")).append(edit_tour_details).append($("<br>")).append(add_site);

        row.append(name_col);
        row.append(start_date_col);
        row.append(duration_col);
        row.append(price_col);
        row.append(guide_col);
        row.append(tour_sites_col);
        row.append(edit_col);


        // row.append(sec_col);
        tours_table.append(row);

    }
}

async function loadMainPage() {
    tours = await loadTours();
    guides = await loadGuides();
    toursToTable(tours, guides);
}



$(document).ready(function () {
    loadMainPage();

    $("body").append(upperLine);
    $("body").append(options);
    $("body").append(tours_content);
    $("body").append(down_line);

});
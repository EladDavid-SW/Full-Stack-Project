// Upper line
let comp_name = $("<h4>Shuru Turu Tours</h4>").addClass("Name").attr('id', "Name");
let upperLine = $("<div></div>").addClass("upperLine").append(comp_name);

// Options section
let sub_title = $("<h5>Our Tours:</h5>").addClass("title");
let add_tour_butt = $("<button></button>").text("Add tour").addClass("button").click(addTour);
let sort_by_name = $("<button></button>").text("Sort by name").addClass("button").click(sortByName);
let sort_by_price = $("<button></button>").text("Sort by price").attr('id', "sort").addClass("button").click(sortByPrice);
let sort_by_start_date = $("<button></button>").text("Sort by start date").addClass("button").click(sortByStartDate);
let sort_by_duration = $("<button></button>").text("Sort by duration").addClass("button").click(sortByDuration);
let options = $("<div></div>").addClass("options").append(sub_title).append(sort_by_name).append(sort_by_price).append(sort_by_start_date).append(sort_by_duration).append(add_tour_butt);

// Down line
let add_tour_butt2 = $("<button></button>").text("Add tour").addClass("down_button").click(addTour);
let down_line = $("<div></div>").text("Enjoy the moment with us :)").addClass("options").append(add_tour_butt2);

// Tour deatails table
let tours_content = $("<div></div>").attr('id', "tours_cont").addClass("toursDiv");
let tours_table = $("<table></table>").addClass("table");
tours_content.append(tours_table);

async function addTour(event) {
    location.href = 'http://localhost:3001/add_tour';
}

async function editTourDetails(event) {
    let tour_id = event.target.getAttribute("tour_id");
    let url = 'http://localhost:3001/edit_tour/' + tour_id;
    location.href = url;
}

async function sortByName(event) {
    tours = await loadTours();
    tours_table.empty();
    toursToTable(tours);
}

async function sortByPrice(event) {
    tours = await loadTours();
    let sorted = tours.sort(function (a, b) {
        if (a[1]["price"] < b[1]["price"]) return -1;
        if (a[1]["price"] == b[1]["price"]) return 0;
        return 1;
    });

    tours_table.empty();
    toursToTable(tours);
}

async function sortByStartDate(event) {
    tours = await loadTours();
    let sorted = tours.sort(function (a, b) {
        if (a[1]["start_date"] < b[1]["start_date"]) return -1;
        if (a[1]["start_date"] == b[1]["start_date"]) return 0;
        return 1;
    });

    tours_table.empty();
    toursToTable(tours);
}

async function sortByDuration(event) {
    tours = await loadTours();
    let sorted = tours.sort(function (a, b) {
        let first = a[1]["duration"];
        let second = b[1]["duration"];
        if (first == undefined) first = -10000;
        if (second == undefined) second = -10000;
        if (first < second) return -1;
        if (first == second) return 0;
        return 1;
    });

    tours_table.empty();
    toursToTable(tours);
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

function tableHeadLines() {
    headlines = ["Name", "Start date", "Duration", "Price", "Guide", "Tour sites", "Edit tour"];
    let row = $("<tr></tr>");
    for (let headline of headlines) {
        let col = $("<td></td>").addClass("border").text(headline);
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
    toursToTable(tours);
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
    toursToTable(tours);
}

async function addSite(event) {
    let tour_id = event.target.getAttribute("tour_id");
    let url = 'http://localhost:3001/add_site/' + tour_id;
    location.href = url;
}

function toursToTable(tours) {
    tableHeadLines();
    for (let tour of tours) {
        let row = $("<tr></tr>");
        let name_col = $("<td></td>").addClass("border").text(tour[0]);
        let start_date_col = $("<td></td>").addClass("border").text(tour[1]["start_date"]);
        let duration_col = $("<td></td>").addClass("border").text(tour[1]["duration"]);
        let price_col = $("<td></td>").addClass("border").text(tour[1]["price"]);

        let guide_col = $("<td></td>").addClass("border");
        guide_col.text("Name: " + tour[1]["guide"]["name"]).append($("<br>")).append("Email: " + tour[1]["guide"]["email"]).append($("<br>")).append("Cellular: " + tour[1]["guide"]["cellular"]);

        let tour_sites_col = $("<td></td>").addClass("border");
        let sites = tour[1]["path"];
        if (sites.length > 0)
            for (let site of sites) {
                tour_sites_col.append("Name: " + site["name"]).append($("<br>"));
                tour_sites_col.append("Country: " + site["country"]).append($("<br>"));
                let delete_site = $("<button></button>").text('Delete ' + site["name"] + ' site').attr('tour_id', tour[0]).attr('site_name', site["name"]).click(deleteSite);
                tour_sites_col.append(delete_site).append($("<br>"));
            }

        // Forms buttons:
        let delete_tour = $("<button></button>").text('Delete tour').attr('tour_id', tour[0]).click(deleteTour);
        let edit_tour_details = $("<button></button>").text('Edit details').attr('tour_id', tour[0]).click(editTourDetails);
        let add_site = $("<button></button>").text('Add a site').attr('tour_id', tour[0]).click(addSite);
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
    toursToTable(tours);
}



$(document).ready(function () {
    loadMainPage();

    $("body").append(upperLine);
    $("body").append(options);
    $("body").append(tours_content);
    $("body").append(down_line);

});
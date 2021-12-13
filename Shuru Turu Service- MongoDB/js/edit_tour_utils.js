function changeDateFormat(date) {
    // Get format: yy\mm\dd and return dd\mm\yy
    let new_date = date.slice(8) + "-";
    new_date += date.slice(5, 8);
    new_date += date.slice(0, 4);
    return new_date;
}

$(document).ready(function () {

    let tour_id = window.location.pathname.slice(11);
    $("#title").text("Edit " + tour_id + " tour");

    $("form[name='add_tour_form']").validate({
        // Specify validation rules
        rules: {

            "start_date": {
                required: false
            },
            "duration": {
                required: false,
                digits: true
            },
            "price": {
                required: false,
                digits: true
            }
        },
        // Specify validation error messages
        messages: {
            duration: {
                digits: "Enter just digits please"
            },
            price: {
                digits: "Enter just digits please"
            },
        }
    });

    // process the form
    $("form[name='add_tour_form']").submit(function (event) {
        let valid = $("form[name='add_tour_form']").valid();

        if (!valid) return;

        let req_json = {};

        if (!$("#start_date").val() == "")
            req_json["start_date"] = changeDateFormat($("#start_date").val());
        if (!$("#duration").val() == "")
            req_json["duration"] = parseInt($("#duration").val());
        if (!$("#price").val() == "")
            req_json["price"] = parseInt($("#price").val());
    
        str_req = JSON.stringify(req_json);

        // Process the form
        $.ajax({
            type: 'PUT',
            url: '/tours/' + tour_id,
            contentType: 'application/json',
            data: str_req,

            processData: false,
            encode: true,
            success: function (data, textStatus, jQxhr) {
                location.href = 'http://localhost:3001/list';
            },
            error: function (jqXhr, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        })

        // Stop the form from submitting the normal way and refreshing the page
        event.preventDefault();
        return;
    });

});

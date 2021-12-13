function changeDateFormat(date) {
    // Get format: yy\mm\dd and return dd\mm\yy
    let new_date = date.slice(8) + "-";
    new_date += date.slice(5, 8);
    new_date += date.slice(0, 4);
    return new_date;
}

$(document).ready(function () {

    $("form[name='add_tour_form']").validate({
        // Specify validation rules
        rules: {
            "tour_name": {
                required: true
            },
            "start_date": {
                required: true
            },
            "duration": {
                required: true,
                digits: true
            },
            "price": {
                required: true,
                digits: true
            },
            "guide_name": {
                required: true
            },
            "guide_email": {
                required: true,
                "email": true
            },
            "guide_cellular": {
                required: true,
                minlength: 6,
                digits: true
            }
        },
        // Specify validation error messages
        messages: {
            tour_name: "Tour name must be entered",
            start_date: "Start date must be entered",
            duration: {
                required: "Duration must be entered",
                digits: "Enter just digits please"
            },
            price: {
                required: "Price must be entered",
                digits: "Enter just digits please"
            },
            guide_name: "Guide name must be entered",
            guide_email: {
                required: "Guide email must be entered",
                email: "Enter Email in the format: some@domain"
            },
            guide_cellular: {
                required: "Guide cellular must be entered",
                minlength: "Cellular must be at least 6 characters long",
                digits: "Enter just digits please"
            }

        }
    });

    // process the form
    $("form[name='add_tour_form']").submit(function (event) {
        let valid = $("form[name='add_tour_form']").valid();

        if (!valid) return;
        let guide_json =
            '{ "name": ' + '"' + $("#guide_name").val() + '"' +
            ' , "email": ' + '"' + $("#guide_email").val() + '"' +
            ' , "cellular": ' + '"' + $("#guide_cellular").val() + '"' + " }";

        let details_json =
            '{ "start_date": ' + '"' + changeDateFormat($("#start_date").val()) + '"' +
            ' , "duration": ' + $("#duration").val() +
            ' , "price": ' + $("#price").val() +
            ' , "guide": ' + guide_json +
            ' , "path": [] }';

        let req_json = '{ "' + $("#tour_name").val() + '": ' + details_json + " }";

        // Process the form
        $.ajax({
            type: 'post',
            url: '/tours/',
            contentType: 'application/json',
            data: req_json,

            processData: false,
            encode: true,
            success: function (data, textStatus, jQxhr) {
                location.href = 'http://localhost:3001/list';

            },
            error: function (jqXhr, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        })

        // stop the form from submitting the normal way and refreshing the page
        event.preventDefault();
        return;
    });

});

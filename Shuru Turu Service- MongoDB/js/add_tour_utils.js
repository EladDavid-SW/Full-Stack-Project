function changeDateFormat(date) {
    // Get format: yy\mm\dd and return dd\mm\yy
    let new_date = date.slice(8) + "-";
    new_date += date.slice(5, 8);
    new_date += date.slice(0, 4);
    return new_date;
}// for example: from: 6666-05-04 to 04-05-6666

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
            "guides": {
                required: true
            },
            
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
            guides: "Guide id must be selected",
        }
    });

    // process the form
    $("form[name='add_tour_form']").submit(function (event) {
        let valid = $("form[name='add_tour_form']").valid();

        if (!valid) return;

        let details_json =
            '{ "start_date": ' + '"' + changeDateFormat($("#start_date").val()) + '"' +
            ' , "duration": ' + $("#duration").val() +
            ' , "price": ' + $("#price").val() +
            ' , "guide": ' + '"' + $("#guides").val() + '"' +
            ' , "name": ' + '"' + $("#tour_name").val() + '"' +
            ' }';

        let req_json =  details_json ;

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

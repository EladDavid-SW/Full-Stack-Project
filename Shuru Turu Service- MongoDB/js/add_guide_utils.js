$(document).ready(function () {

    $("form[name='add_tour_form']").validate({
        // Specify validation rules
        rules: {
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
    $("form[name='add_guide_form']").submit(function (event) {
        let valid = $("form[name='add_guide_form']").valid();

        if (!valid) return;

        let guide_json =
            '{ "name": ' + '"' + $("#guide_name").val() + '"' +
            ' , "email": ' + '"' + $("#guide_email").val() + '"' +
            ' , "cellular": ' + '"' + $("#guide_cellular").val() + '"' + " }";
            
        let req_json = guide_json;

        // Process the form
        $.ajax({
            type: 'post',
            url: '/createGuide/',
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

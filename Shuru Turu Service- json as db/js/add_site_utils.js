$(document).ready(function () {

  let tour_id = window.location.pathname.slice(10);
  $("#title").text("Add site to  " + tour_id + " tour");

  $("form[name='add_site_form']").validate({
    // Specify validation rules
    rules: {
      "site_name": {
        required: true
      },
      "country": {
        required: true
      }
    },
    // Specify validation error messages
    messages: {
      site_name: "Site name must be entered",
      country: "Country of the site must be entered",
    }
  });

  // process the form
  $("form[name='add_site_form']").submit(function (event) {

    if (!$("form[name='add_site_form']").valid()) return;

    // process the form
    $.ajax({
      type: 'PUT',
      url: '/tours/' + tour_id,
      contentType: 'application/json',
      data: JSON.stringify({
        "name": $("#site_name").val(),
        "country": $("#country").val()
      }),
      processData: false,
      encode: true,
      success: function (data, textStatus, jQxhr) {
        if (data == 'Tour is not exists')
          alert(data);
        else
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

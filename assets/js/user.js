jQuery(document).ready(function ($) {
    $('#loginform').submit(function (e) {
        event.preventDefault();
        var $form = $(this),
            url = $form.attr('action'),
            method = $form.attr('method');

        var data = $form.serialize();

        $.ajax({
            type: method,
            url: url,
            data: data
        })
        .success(function (data) {
            console.log(data);
            var resultResponse = $(".resultResponse");
            if (data.state == "error") {
                resultResponse.empty().append(data.error);
                resultResponse.removeClass('success').addClass('error');
            }
            else {
                resultResponse.empty().append("Login success!!! You will auto redirect to Dashboard");
                resultResponse.removeClass('error').addClass('success');

                setTimeout(function () {
                    window.location.href = '/admin';
                }, 2 * 1000);

            }
        })
        .error(function (error) {
            console.log(error)
        })

    });
});
jQuery(document).ready(function ($) {
    $('#addPostForm').submit(function (event) {
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
                resultResponse.empty().append("Add new post success!!!");
                resultResponse.removeClass('error').addClass('success');
            }
        })
        .error(function (error) {
            console.log(error)
        })

    });
});
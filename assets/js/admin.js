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
                    $("#idPost").val(data.result.insertedIds[0]);
                    $form.fadeOut('slow');
                    $(".uploadPanel").fadeIn('fast');
                }
            })
            .error(function (error) {
                console.log(error)
            })

    });

    $('.upload-btn').on('click', function () {
        $('#upload-input').click();
        $('.progress-bar').text('0%');
        $('.progress-bar').width('0%');
    });
    $('#upload-input').on('change', function () {

        var files = $(this).get(0).files;
        var postId = $("#idPost").val();
        if (files.length > 0) {
            // create a FormData object which will be sent as the data payload in the
            // AJAX request
            var formData = new FormData();
            formData.append('postId', postId);
            for (var i = 0; i < files.length; i++) {
                var file = files[i];

                // add the files to formData object for the data payload
                formData.append('uploads[]', file, file.name);
            }
            $.ajax({
                url: 'addImagesSubmit',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function (data) {
                    console.log(data);
                    $(".uploadedImage").append("<img src='"+ data.result + "' alt=''/>")
                },
                xhr: function () {
                    // create an XMLHttpRequest
                    var xhr = new XMLHttpRequest();

                    // listen to the 'progress' event
                    xhr.upload.addEventListener('progress', function (evt) {

                        if (evt.lengthComputable) {
                            // calculate the percentage of upload completed
                            var percentComplete = evt.loaded / evt.total;
                            percentComplete = parseInt(percentComplete * 100);

                            // update the Bootstrap progress bar with the new percentage
                            $('.progress-bar').text(percentComplete + '%');
                            $('.progress-bar').width(percentComplete + '%');

                            // once the upload reaches 100%, set the progress bar text to done
                            if (percentComplete === 100) {
                                $('.progress-bar').html('Done');
                            }
                        }
                    }, false);

                    return xhr;
                }
            });
        }
    })
});
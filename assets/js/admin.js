jQuery(document).ready(function ($) {
    $('#addPostForm').submit(function (event) {
        event.preventDefault();
        var $form = $(this),
            url = $form.attr('action'),
            method = $form.attr('method');
        $form.ajaxSubmit({
            error: function(xhr) {
                status('Error: ' + xhr.status);
            },

            success: function(data) {
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
            }
        });
    });

    $('input[type=radio][name=type]').change(function() {
        if (this.value == 'image') {
            $("input[type=file][name=featureImage]").show();
            $("input[type=text][name=featureVideo]").hide();
        }
        else if(this.value == 'video'){
            $("input[type=file][name=featureImage]").hide();
            $("input[type=text][name=featureVideo]").show();
        }
        else{

        }
    });

    $('.upload-btn').on('click', function () {
        $('#upload-input').click();
        $('.progress-bar').text('0%');
        $('.progress-bar').width('0%');
    });
    $('#upload-input').on('change', function () {

        var files = $(this).get(0).files;
        var postId = $("#idPost").val();
        console.log(postId)
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
                url: '/admin/addImagesSubmit',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function (data) {
                    console.log(data);
                    $(".uploadedImage").append("<img src='"+ data.result + "' alt='Yeu em' />")
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
    $(".remove").click(function(){
        var row = $(this).closest("tr");
        var id = $(this).attr("data-id");
        row.fadeOut("slow");
        $.ajax({
            url: "admin/deletePost",
            method: "POST",
            data: { id: id}
        })
        .success(function(data){
            if(data.state == "success")
                alert("Delete success");
        })
    });
    $(".delete_image").click(function(){
        var row = $(this).closest(".image");
        var id = $(this).attr("data-id");
        row.fadeOut("slow");
        $.ajax({
            url: "/admin/deleteImage",
            method: "POST",
            data: { id: id}
        })
        .success(function(data){
            if(data.state == "success")
                alert("Delete success");
        })
    })
});
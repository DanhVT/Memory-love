jQuery(document).ready(function($){
    $('#loginform').submit(function(e) {
		event.preventDefault();
		var $form = $( this ),
          url = $form.attr( 'action' ),
          method =  $form.attr( 'method' );
		
        var data = $form.serialize();

        $.ajax({
            type: method,
            url: url,
            data: data
        })
        .success(function(data){
            console.log(data)
        })
        .error(function(error){
            console.log(error)
        })

	});
});
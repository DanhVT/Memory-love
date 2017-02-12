jQuery(document).ready(function($){

	//when set to true and open a post,
	//it will scroll to the comments section
	var scroll_to_comments = false;	

	//opens menu
	$('#link-menu').on('click',function(e){
		e.preventDefault();
		$('#side-menu').addClass('open');
		$(this).fadeOut('fast');
		$('body').addClass('overflow-hidden');
	});

	//closes menu
	$('#side-menu-close').on('click',function(e){
		e.preventDefault();
		$('#side-menu').removeClass('open');
		$('#link-menu').fadeIn('fast');
		$('body').removeClass('overflow-hidden');
	});


	$(document).on('click','.info-likes',function(e){
		e.preventDefault();
		var postid = $(this).data('id');
		var counter = $(this);
		$.ajax({
			url: theme_url + '/likepost.php?op=like&p=' + postid,
			success: function(data) {
				counter.find('span').html(data);
				counter.addClass('liked');
			}
		});
	})

	var is_firefox = navigator.userAgent.indexOf('Firefox') > -1;
	
	

	//on scolling, show/animate timeline blocks when enter the viewport
	$(window).on('scroll', function(){
		$('.post-hidden').each(function(){
			if( $(this).offset().top <= $(window).scrollTop()+$(window).height()*0.75 && $(this).find('.timeline-img').hasClass('is-hidden') ) {
				$(this).find('.timeline-img, .timeline-content').removeClass('is-hidden').addClass('bounce-in');
			}
		});
	});

	$('.post-hidden').first().find('.timeline-img, .timeline-content').removeClass('is-hidden').addClass('bounce-in');
		
	//sets up sharing buttons
	applySharingButtons();

	//opens a post
	$(document).on('click','.post-link', function(e){
		e.preventDefault();
		var permalink = $(this).attr('href');
		var loader = $(this).parent().parent().find('.loader');
		var postid = $(this).data('id');
		var title = $(this).data('title');
		var permalink = $(this).data('permalink');

		$('.post-panel').html('');
		
		//show preloader
		loader.fadeIn('fast');
		//load post
		$.ajax({
		  url: '/post/' + postid,
		  success: function(data) {
			  console.log(data)
		  		$('.post-panel').html(data);
		  		$('.post-image').get(0).onload = openPost; 
		  		//change the url
		  		if (history.pushState) {
		  			history.pushState(postid, title, permalink);
		  		}					  			  		
		  }
		});

		//closes a post
		$(document).on('click', '.post-button-close', function(event){
			event.preventDefault();			
			$('.post-panel').removeClass('slide-in');
			$('.post-button-close').removeClass('is-visible');
			//goes back with the url to the previous page
			if (history.pushState) {
		  		history.back();
		  	}
			if( is_firefox ) {
				$('main').removeClass('slide-out').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
					$('body').removeClass('overflow-hidden');
				});
			} else {
				$('main').removeClass('slide-out');
				$('body').removeClass('overflow-hidden');
			}
		});

	});




	function openPost(){
		// post slides in
		$('.loader').fadeOut('fast');
		
		$('.post-panel').addClass('slide-in');
		$('.post-button-close').addClass('is-visible');
		//for firefox wait until the transition ends to change the body overflow
		if( is_firefox ) {
			$('main').addClass('slide-out').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
				$('body').addClass('overflow-hidden');
			});
		} else {
			$('main').addClass('slide-out');
			$('body').addClass('overflow-hidden');
		}
		if(scroll_to_comments){
			scroll_to_comments = false;
			$('.post-panel').animate({
          		scrollTop:  $('.post-comments').offset().top
     		});
		}
	}


	

	$(".fuelpixels_slider").responsiveSlides({
		auto: false,
		nav: true,
		prevText: '<i class="fa fa-chevron-left"></i>',
		nextText: '<i class="fa fa-chevron-right"></i>'
	});

    $('.fuelpixels_lightbox').imageLightbox({
    	overlay: true    	
    });


    //detects if the url goes to comments, opens the post and scroll to comments
	if(location.href.indexOf("#comment") != '-1'){
		scroll_to_comments = true;
		$('.post-link').trigger('click');
	}
	

    function applySharingButtons() {
		$('.share-facebook').on('click', function() {
			var data_share = $(this).parent('.atbe-share-box').attr('data-share-url');
			var url = data_share !== undefined ? data_share : window.location.href;
			share('http://www.facebook.com/sharer/sharer.php?u='+url, 'Share on Facebook');
			return false;
		});

		$('.share-google-plus').on('click', function() {
			var data_share = $(this).parent('.atbe-share-box').attr('data-share-url');
			var url = data_share !== undefined ? data_share : window.location.href;
			share('https://plus.google.com/share?url='+url, 'Share on Google Plus');
			return false;
		});

		$('.share-twitter').on('click', function() {
			var data_share = $(this).parent('.atbe-share-box').attr('data-share-url');
			var url = data_share !== undefined ? data_share : window.location.href;
			var data_title = $(this).parent('.atbe-share-box').attr('data-share-title');
			var post_title = data_title !== undefined ? (data_title + ' ') : '';
			var status = post_title + url;
			share('http://twitter.com/home?status='+status, 'Twitter');
			return false;
		});

		$('.share-pinterest').on('click', function() {
			var data_share = $(this).parent('.atbe-share-box').attr('data-share-url');
			var url = data_share !== undefined ? data_share : window.location.href;
			var data_title = $(this).parent('.atbe-share-box').attr('data-share-title');
			var post_title = data_title !== undefined ? data_title : '';
			var data_media = $(this).parent('.atbe-share-box').attr('data-share-media');
			var media = data_media !== undefined ? data_media : '';
			var data_excerpt = $(this).parent('.atbe-share-box').attr('data-share-excerpt');
			var excerpt = data_excerpt !== undefined && data_excerpt !== '' ? (' - ' + data_excerpt) : '';
			share('http://www.pinterest.com/pin/create/button/?url='+url+'&media='+media+'&description='+post_title + excerpt, 'Pin It');
			return false;
		});

		var shareWindow = null;
		var prevUrl;

		function share(url, window_title) {
			if( shareWindow === null || shareWindow.closed ) {
				shareWindow = window.open( url, window_title, 'width=640,height=300' );
			} else if( prevUrl !== url ) {
				shareWindow = window.open( url, window_title, 'width=640,height=300' );
				shareWindow.focus();
			} else {
				shareWindow.focus();
			}
			prevUrl = url;
		}
	}
});


$(document).ready(function(){
	
			$("#uploadForm").submit(function( event ) {
				// Stop form from submitting normally
				event.preventDefault();
				// Get some values from elements on the page:
				var $form = $( this ),
					name_val = $form.find( "input[name='name']" ).val(),
					city_val = $form.find( "input[name='city']" ).val(),
					price_val = $form.find( "input[name='price']" ).val(),
					image_val = $form.find('input[type=file]').val().split('\\').pop(),
					desc_val = $form.find( "textarea[name='description']" ).val();

				// Send the data using post
				var posting = $.post( "/catalog", { name: name_val, city: city_val, description:desc_val, price:price_val, upl:image_val } );
				// Put the results in a div
				posting.done(function( data ) {
					console.log("Posting finished from jquery");
					$( "#result" ).empty().append( "Created new item with id: "+data );
				});
			});	
		});
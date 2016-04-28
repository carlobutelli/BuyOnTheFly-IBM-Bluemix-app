$(document).ready(function(){
	    var name,price,city,description;
	    $("#upload-item").click(function(){ 
	    	if($("#name").val() === ''){  
	    		document.getElementById("name").style.backgroundColor = "red";
	    		$("#message").text("The field is required, please fill it in!");
	    		return false;
	    	} else {
	    		document.getElementById("name").style.backgroundColor = "#f1f4f7";
	    		name=$("#name").val();
	    	}
	    	if($("#price").val() === ''){  
	    		document.getElementById("price").style.backgroundColor = "red";
	    		$("#message").text("The field is required, please fill it in!");
	    		return false;
	    	} else {
	    		document.getElementById("price").style.backgroundColor = "#f1f4f7";
	    		price=$("#price").val();
	    	}
	    	if($("#city").val() === ''){  
	    		document.getElementById("city").style.backgroundColor = "red";
	    		$("#message").text("The field is required, please fill it in!");
	    		return false;
	    	} else {
	    		document.getElementById("city").style.backgroundColor = "#f1f4f7";
	    		city=$("#city").val();
	    	}
	    	if($("#description").val() === ''){  
	    		document.getElementById("description").style.backgroundColor = "red";
	    		$("#message").text("The field is required, please fill it in!");
	    		return false;
	    	} else {
	    		document.getElementById("description").style.backgroundColor = "#f1f4f7";
	    		description=$("#description").val();
	    	}
	    	if(!($('#itemPhoto').val().length)){
				document.getElementById("inputPic").style.backgroundColor = "red";
	    		$("#message").text("The picture is required, please upload it!");
	    		return false;
			} else {
				document.getElementById("inputPic").style.backgroundColor = "#f1f4f7";	
			}
	        $("#message").text("Item Uploading...Please wait");

			$.ajax({
		        url: '/register_item',  //Server script to process data
		        type: 'POST',
		        xhr: function() {  // Custom XMLHttpRequest
		            var myXhr = $.ajaxSettings.xhr();
		            if(myXhr.upload){ // Check if upload property exists
		                myXhr.upload.addEventListener('progress',progressHandlingFunction, false); // For handling the progress of the upload
		            }
		            return myXhr;
		        },
		        //Ajax events
		        beforeSend: beforeSendHandler,
		        success: completeHandler,
		        error: errorHandler,
		        // Form data
		        data: {
		        	name: $('#name').val(),
        	    	city: $('#city').val(), 
                	price: $('#price').val(),
                	description: $('#description').val(),
                	file_data: $('#itemPhoto').prop('files')[0]
		        },
		        //Options to tell jQuery not to process data or worry about content-type.
		        cache: false,
		        contentType: false,
		        processData: false
		    });


	    });	  
	});
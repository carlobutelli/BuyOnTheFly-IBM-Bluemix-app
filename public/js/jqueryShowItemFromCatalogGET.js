$(document).ready(function(){	
	$.getJSON("/item_bought", function(data,status){		    
		/*output="<tr><td>id</td><td>name</td><td>email</td><td>address</td></tr>";
		$.each( data, function( i, item ) {
			output+="<tr><td>"+item.id+"</td><td>"+item.name+"</td><td>"+item.email+"</td><td>"+item.address+"</td></tr>";
		});*/
		output='<div class="form-group-sell col-md-6-sell"><h4>New product for sale from </h4><h3>'+data.seller+'</h3><br>';
		output+='<h5>Item: </h5><h4>'+data.name+' ('+data.city+')<h4><br>';
		output+='<img src="../img/gal/'+data.img+'" width="350px" height="250px">';
		output+='<br>'+data.description+'<br>';
		output+='<h4>Price:</h4><h3>'+data.price+'</h3></div>';
		output+='<div class="form-group-sell col-md-12-sell"><button id="buy" type="submit" name="submit" class="profile-btn btn-lg btn-primary">Buy It!</button></div>';
		$("#buy-item").html(output);  
	});
});
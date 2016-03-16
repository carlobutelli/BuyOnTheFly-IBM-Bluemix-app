$(document).ready(function(){	
	$.getJSON("/get_items", function(data,status){		    
		output="";
		$.each( data, function( i, item ) {
			//output+="<tr><td>"+item.id+"</td><td>"+item.name+"</td><td>"+item.email+"</td><td>"+item.address+"</td></tr>";
			output+='<div class="col-md-4-it"><a href="/item"><div class="thumbnail-it"><div id="result" class="caption-it"><h3></h3>'
			output+='<br>Price:<h3></h3></div><img src="../img/gal/' + data.img + '" width="350px" height="274px"></div></a></div>'
		});
		$("#img_from_folder").html(output);  
	});
}); 
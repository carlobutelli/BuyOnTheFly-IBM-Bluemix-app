$(document).ready(function(){	
	$.getJSON("/get_items", function(data,status){		    
		output='<ul>';
		var buy='';
		$.each( data, function( i, item ) {
			var returnedItem=JSON.stringify({"id":item.id,"rev":item.doc._rev});
			buy+='<option value='+returnedItem+'>'+item.doc.name+' - '+item.doc.price+'</option>';
			output+='<li><p><img class="det" src="../img/gal/'+item.doc.img_name+'" width="350px" height="250px" style="float:left; border:1px black; margin:0px 10px 15px 5px;">';
			output+='<div style="color:black;"><h3>'+item.doc.name+'</h3><h5>From: '+item.doc.seller+' <'+item.doc.email+'></h5>'+item.doc.description+'<br>Price:<h3>'+item.doc.price+'</h3></div></p></li><br clear="all">';
		});
		output+='</ul>';
		$("#img_from_folder").html(output);  
		$("#buyThisItem").append("<option value='-1'>"+"Select an item"+"</option>");
		$("#buyThisItem").append(buy);
	});

	$("#buyItemButton").click(function(data){
        var parsedItem=$.parseJSON($("#buyThisItem").val());
        alert ("You have just bought the item. Id: "+parsedItem.id);
		$.ajax({
			  url: '/register_item?id='+parsedItem.id+'&rev='+parsedItem.rev,
			  type: 'PUT',
			  contentType: 'application/json',
			  success: function(data, textStatus ,jqXHR) {
				 alert ("Congratulations! You you got this item!\nA mail has been sent to the Seller!");
				 $("#result").empty().append(data);
			  }	  
		});
	});
});
/*
output+='<div class="col-md-4-it"><a href="/item_from_catalog"><div class="thumbnail-it">';
output+='<div id="details" class="caption-it" style="display:block; opacity: 0.6"><h3>'+item.doc.name+'</h3>'+item.doc.description+'<br>Price:<h3>'+item.doc.price+'</h3></div>';
output+='<img src="../img/gal/'+item.doc.img_name+'" width="100%" height="100%"></div></a></div>';
*/

//onclick="alert(this.id)"
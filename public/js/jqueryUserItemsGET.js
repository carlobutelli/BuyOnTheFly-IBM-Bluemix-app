$(document).ready(function(){	
	$.getJSON("/user_items", function(data,status){		    
		var itemForSale='<ul id="myid">';
		var itemSold='<ul>';
		var output='';
		$.each( data, function( i, item ) {
			var returnedItem=JSON.stringify({"id":item.id,"rev":item.doc._rev});
			if(!item.doc.buyer){
				output+='<option value='+returnedItem+'>'+item.doc.name+' - '+item.doc.price+'</option>';
				itemForSale+='<li><p><img class="det" src="../img/gal/'+item.doc.img_name+'" width="250px" height="150px" style="float:left; border:1px black; margin:0px 10px 15px 5px; margin-left: 200px;">';
				itemForSale+='<div><a href=""><div><h3>'+item.doc.name+'</h3>'+item.doc.description+'<br><h3>'+item.doc.price+'</h3></div></a></div></p></li><br clear="all">';
			} else {
				itemSold+='<li><p><img class="det" src="../img/gal/'+item.doc.img_name+'" width="250px" height="150px" style="float:left; border:1px black; margin:0px 10px 15px 5px; margin-left: 200px;">';;
				itemSold+='<div><a href="/delivery_boxes"><div><h3>'+item.doc.name+' bought from: '+item.doc.buyer+'</h3>'+item.doc.description+'<br><h3>'+item.doc.price+'</h3></div><input type="submit" name="submit" onclick="/delivery_boxes" value="Send it!" class="profile-btn btn-lg btn-primary"></a></div></p></li><br clear="all">';
			}
		});
		itemForSale+='</ul>';
		itemSold+='</ul>';
		$("#it_for_sale").html(itemForSale);  
		$("#it_sold").html(itemSold);
		$("#itemsToDeleteControl").append("<option value='-1'>"+"Select an item"+"</option>");
		$("#itemsToDeleteControl").append(output);
	});

	$("#deleteItemButton").click(function(data){
        var parsedItem=$.parseJSON($("#itemsToDeleteControl").val());
		$.ajax({
			  url: '/user_items?id='+parsedItem.id+'&rev='+parsedItem.rev,
			  type: 'delete',
			  success: function(data, textStatus ,jqXHR) {
				 alert ("Deleting item with id: "+$("#itemsToDeleteControl").val()+" reported status: "+textStatus);
				 $("#result").empty().append(data);
			  }	  
		});
	});
	/*
	$("#myid li").click(function() {
	    this.id = 'newId';

	    // longer method using .attr()
	    $(this).attr('id', 'newId');
	});*/
});

//<input id="deleteItemButton" type="submit" name="submit" value="Delete Item" class="profile-btn btn-lg btn-primary">
function imgReplaceSvg(){
	jQuery('img.svg').each(function(){
        var $img = jQuery(this);
        var imgID = $img.attr('id');
        var imgClass = $img.attr('class');
        var imgURL = $img.attr('src');
  
        function getSvg(data){
	         		var $svg = jQuery(data).find('svg');
					// Add replaced image's ID to the new SVG
		            if(typeof imgID !== 'undefined') {
		                $svg = $svg.attr('id', imgID);
		            }
		            // Add replaced image's classes to the new SVG
		            if(typeof imgClass !== 'undefined') {
		                $svg = $svg.attr('class', imgClass+' replaced-svg');
		            }
		            
		            // Remove any invalid XML tags as per http://validator.w3.org
		            $svg = $svg.removeAttr('xmlns:a');
		            return $svg;
        }
        
         $.ajax({
	        type: "get",
	        url: imgURL,
	       
	        success: 
	            function (data) {
	               // Get the SVG tag, ignore the rest
		           
		           var $svg = getSvg(data)
		            
		            // Replace image with new SVG
		            $img.replaceWith($svg);
	            },
	            error: function (xhr,status,error) {
	            //   alert("Status: " + status);
	            //   alert("Error: " + error);
	             //  alert("xhr: " + xhr.readyState);
	            },
	            statusCode: {
	               404: function() {
	                   $.get('/assets/icons/material_hardware/ic_keyboard_arrow_right_48px.svg', function(data){
		                    var $svg = getSvg(data)
							$img.replaceWith($svg);
	                   });
	               }
	            }
	        });
        
    });
}

$(function(){
	imgReplaceSvg();
})
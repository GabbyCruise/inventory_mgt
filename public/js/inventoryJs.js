/**
 * Author: Gabriel Jonah
 * Software Developer
 */

//======== NAVIGATION DISPLAY ON MOBILE VIEW =======//
function openMenu(getBtn, dropDwon) {
	$(getBtn).toggleClass('active');
	$(dropDwon).toggle();
};


//=========== POPULATE THE MATERIAL FIELDS ==============//
function loadMaterial(categorySel, subcategorySel, itemSel){
	//list the first material category of items
	for (var item in materialObject){
		categorySel.options[categorySel.options.length] = new Option(item, item);	
		//TODO: this currently repeats listing on a second click, fix this later
	}
	//selecting from second field
	categorySel.onchange = function(){
		//empty items
		subcategorySel.length = 1;
		itemSel.length = 1;
		//display corresponding items
		for(var subItem in materialObject[this.value]){
			subcategorySel.options[subcategorySel.options.length] = new Option(subItem, subItem);
		}
	}

	subcategorySel.onchange = function(){
		//empty item field
		itemSel.length = 1;
		var finalItem = materialObject[categorySel.value][this.value];
		for(i = 0; i < finalItem.length; i++){
			itemSel.options[itemSel.options.length] = new Option(finalItem[i], finalItem[i]);
		}
	}
}

//=============== DISPLAY SIDE DRAWER ==================//
$(function () {
	$('.project_dropdown').on('click', function () {
		//$('.project_dropdown')
		var reveal = $(this).next().find('.project_actions');

		// don't slide up if clicking on the already visible element
		if (!reveal.is(':visible')) {
			$('.project_actions').slideUp();
		}
		reveal.slideToggle('active'); // only slide clicked element
	});
});


// ================= DISPLAY INNER TABS ==================//
function openPage(pageName, elmnt) {
	var i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}
	tablinks = document.getElementsByClassName("tablink");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].style.color = "";
	}
	document.getElementById(pageName).style.display = "block";
	elmnt.style.color = '#483D8B';
}





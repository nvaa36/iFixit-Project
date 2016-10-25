var collection = JSON.parse(localStorage.getItem('collection'));
if(collection == null){
	collection = [];
	localStorage.setItem('collection', JSON.stringify(collection));
}

function loadList(){
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "https://www.ifixit.com/api/2.0/guides?limit=200", false);
	xhr.send();
	resp = JSON.parse(xhr.response);
	createTable(resp);
}

function createTable(resp){
	var table = document.getElementById("table");
	table.width = "100%";
	var row = table.insertRow(-1);
	for (var i = 0; i < resp.length; i++) {
		if(i % 3 == 0 && i != 0){
			row = table.insertRow(-1);
		}
		var cell = row.insertCell(-1);
		cell.innerHTML = "<style = 'text-align: center>";
		cell.width = "33%";
		var img = resp[i].image;
		var link = document.createElement('a');
		link.href = resp[i].url;
		link.title = resp[i].title;
		if(img != null){
			var image = document.createElement('img');
			image.src = img.standard;
			image.width = "300";
			image.id = "icon";
			link.appendChild(image);
		}
		else{
			var image = document.createElement('img');
			image.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2000px-No_image_available.svg.png";
			image.width = "300";
			image.height = "230";
			image.id = "icon";
			link.appendChild(image);
		}
		cell.appendChild(link);
		cell.title = resp[i].guideid;
		var text = document.createTextNode(resp[i].title);
		text.width = "300";
		cell.appendChild(text);
	}
	createClicks();
}

function createClicks(){
	var tbl = document.getElementById("table");
	if (tbl != null) {
 	   for (var i = 0; i < tbl.rows.length; i++) {
  	      for (var j = 0; j < tbl.rows[i].cells.length; j++){
  	      	var cell = tbl.rows[i].cells[j];
  	      	if(collection.indexOf(cell.title) < 0){
		  	    var image = document.createElement('img');
		  	    image.title = cell.title;
				image.width = "40";
				image.height = "40";
				image.src = "glyphicons-191-plus-sign.png";
				image.onclick = function () { addCell(this); };
				cell.appendChild(image);
			}
 	      }
 	   }
	}
}

function showResults(){
	var table = document.getElementById("table");
	table.innerHTML = "";
	var text = document.getElementById("searchQ").value;
	if(text != null){
		var xhr = new XMLHttpRequest();
		text = "https://www.ifixit.com/api/2.0/search/" + text + "?filter=guide&limit=200";
		xhr.open("GET", text, false);
		xhr.send();
		resp = JSON.parse(xhr.response);
		createTable(resp.results);
	}
	else
		window.alert("no results found");
}

function addCell(cell){
	getCollection();
	var name = cell.title;
	if(collection.indexOf(name) < 0)
		collection.push(name);
	for(var i = 0; i < collection.length; i++)
		console.log(collection[i]);
	localStorage.setItem('collection', JSON.stringify(collection));
	history.go(0);
}

function loadCollection(){
	var col = getCollection();
	var table = document.getElementById("table");
	table.innerHTML = "";
	table.width = "100%";
	var row = table.insertRow(-1);
	for (var i = 0; i < col.length; i++) {
		if(i % 3 == 0 && i != 0){
			row = table.insertRow(-1);
		}
		var cell = row.insertCell(-1);
		cell.width = "33%";
		var img = col[i].image;
		var link = document.createElement('a');
		link.href = col[i].url;
		link.title = col[i].title;
		if(img != null){
			var image = document.createElement('img');
			image.src = img.standard;
			image.width = "300";
			link.appendChild(image);
		}
		else{
			var image = document.createElement('img');
			image.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2000px-No_image_available.svg.png";
			image.width = "300";
			image.height = "230";
			link.appendChild(image);
		}
		cell.appendChild(link);
		cell.title = col[i].guideid;
		var text = document.createTextNode(col[i].title);
		text.width = "300";
		cell.appendChild(text);
	}
	createRClicks();
}

function createRClicks(){
	var tbl = document.getElementById("table");
	if (tbl != null) {
 	   for (var i = 0; i < tbl.rows.length; i++) {
  	      for (var j = 0; j < tbl.rows[i].cells.length; j++){
  	      	var cell = tbl.rows[i].cells[j];
  	      	var image = document.createElement('img');
  	      	image.title = cell.title;
  			image.width = "40";
			image.height = "40";
			image.src = "glyphicons-192-minus-sign.png";
			cell.appendChild(image);
	        image.onclick = function () { removeCell(this); };
 	       }
 	   }
	}
}

function removeCell(cell){
	console.log(cell.title + ' ' + collection[0]);
	var name = cell.title;
	var row = 0;
	var col = 0;
	for(var i = 0; i < collection.length; i++){
		if(collection[i] == name){
			collection.splice(i, 1);
			var tbl = document.getElementById("table");
			tbl.rows[row].cells[col].innerHTML = '';
			console.log(collection.length + ' ' + row + ' ' + col);
		}
		if(col % 3 == 0 && col != 0)
			row++;
		else
			col++;
	}
	console.log(collection.length);
	localStorage.setItem('collection', JSON.stringify(collection));
	history.go(0);
}

function getCollection() {
	collection = JSON.parse(localStorage.getItem('collection'));
	var xhr = new XMLHttpRequest();
	var col = new Array();
	for(var i = 0; i < collection.length; i++){
		text = "https://www.ifixit.com/api/2.0/guides/" +  collection[i];
		xhr.open("GET", text, false);
		xhr.send();
		resp = JSON.parse(xhr.response);
		col.push(resp);
	}
	return col;
}

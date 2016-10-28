var collection = JSON.parse(localStorage.getItem('collection'));
if(collection == null){
	collection = [];
	localStorage.setItem('collection', JSON.stringify(collection));
}

var cats;
var devices;

function loadSideBar(){
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "https://www.ifixit.com/api/2.0/categories?", false);
	xhr.send();
	cats = JSON.parse(xhr.response);
	var keys = Object.keys(cats);
	var list = document.getElementById("column");
	list.style.color = "blue";
	makeSideBar(keys, list);
}

function makeSideBar(keys, list){
	for(var i = 0; i < keys.length; i++){
		var el = document.createElement('li');
		el.title = keys[i];
		var div = document.createElement('div');
		div.innerHTML = "<p title='" + keys[i] + "'>" + keys[i] + "</p>";
		el.appendChild(div);
		list.appendChild(el);
	}
	createColClicks(list);
}

function createColClicks(list){
	var items = list.getElementsByTagName('li');
	for(var i = 0; i < items.length; i++){
		var item = items[i];
		var div = item.firstChild;
		div.addEventListener("click", function(){showCat(this.parentElement)});
	}
}

function showCat(item){
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "https://www.ifixit.com/api/2.0/wikis/CATEGORY/"+item.title, false);
	xhr.send();
	var resp = JSON.parse(xhr.response);
	devices = resp.children;
	localStorage.setItem('devices', JSON.stringify(devices));
	var subli = document.createElement('ul');
	item.appendChild(subli);
	var ances = resp.ancestors;
	var subcat = cats;
	for(var i = ances.length - 2; i >= 0; i--){
		console.log(subcat[ances[i].title]);
		subcat = subcat[ances[i].title];
	}
	subcat = subcat[item.title];
	editSideBar(subcat, subli);
	createTable(devices);
}

function editSideBar(subcat, list){
	var names = Object.keys(subcat);
	for(var i = 0; i < names.length; i++){
		if(Object.keys(subcat[names[i]]).length > 0){
			var el = document.createElement('li');
			el.title = names[i];
			var div = document.createElement('div');
			div.innerHTML = "<p title='" + names[i] + "'>" + names[i] + "</p>";
			el.appendChild(div);
			list.appendChild(el);
		}
	}
	createColClicks(list);
}

function loadList(){
	devices = JSON.parse(localStorage.getItem('devices'));
	if(devices == null || devices.length == 0){
		devices = [];
		var xhr = new XMLHttpRequest();
		xhr.open("GET", "https://www.ifixit.com/api/2.0/wikis/CATEGORY?limit=200", false);
		xhr.send();
		devices = JSON.parse(xhr.response);
	}
	localStorage.setItem('devices', JSON.stringify(devices));
	createTable(devices);
}

function createTable(devices){
	var table = document.getElementById("table");
	table.innerHTML = "";
	table.width = "100%";
	var row = table.insertRow(-1);
	for (var i = 0; i < devices.length; i++) {
		if(i % 3 == 0 && i != 0){
			row = table.insertRow(-1);
		}
		var cell = row.insertCell(-1);
		cell.innerHTML = "<style = 'text-align: center>";
		cell.width = "33%";
		var img = devices[i].image;
		var link = document.createElement('a');
		link.href = devices[i].url;
		link.title = devices[i].title;
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
		cell.title = devices[i].title;
		var text = document.createTextNode(devices[i].title);
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
	var text = document.getElementById("searchQ").value;
	if(text != null){
		var xhr = new XMLHttpRequest();
		text = "https://www.ifixit.com/api/2.0/search/" + text + "?filter=category&limit=200";
		xhr.open("GET", text, false);
		xhr.send();
		resp = JSON.parse(xhr.response);
		devices = resp.results;
		localStorage.setItem('devices', JSON.stringify(devices));
		createTable(devices);
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
		cell.title = col[i].title;
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
		text = "https://www.ifixit.com/api/2.0/wikis/CATEGORY/" +  collection[i];
		xhr.open("GET", text, false);
		xhr.send();
		devices = JSON.parse(xhr.response);
		col.push(devices);
	}
	return col;
}

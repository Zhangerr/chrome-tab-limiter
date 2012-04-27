window.onload = function() {
	var port = chrome.extension.connect({name: "info"});
	var select2 = document.getElementById("orz"); //my pro variable naming (this is the checkbox)
	var fornow = localStorage["check"]; //spinner

	if(fornow != null) {
		select2.checked = fornow == 'true';//hacky, stored as string
		port.postMessage({check : select2.checked});
	}
	
	select2.onchange=function(){
		localStorage["check"] = select2.checked;
		port.postMessage({check : select2.checked});
	}
	
	var value = localStorage["max_tabs"];	
	var select = document.getElementById("sp");
	
	if(value !=null) {	
		select.value=value;
		port.postMessage({max : select.value});
	}

	document.getElementById("sp").oninput=function(){
		localStorage["max_tabs"] = document.getElementById("sp").value;
		port.postMessage({max : this.value});
	}
}

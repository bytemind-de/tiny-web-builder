var TinyBuilder = {
	defaultCodeTheme: "default"
}

TinyBuilder.start = function(){
	if (!TinyBuilder.GrapesJS){
		console.error("Missing library GrapesJS!");
		return;
	}
	TinyBuilder.GrapesJS.init();
	
	//select style manager to avoid selection bugs
	var openSmBtn = TinyBuilder.GrapesJS.getEditor().Panels.getButton('views', 'open-sm');
	openSmBtn.set('active', 1);
	
	if (!TinyBuilder.CodeMirror){
		console.error("Missing library CodeMirror!");
		return;
	}
};

/* --- Tools --- */

(function(){
	TinyBuilder.tools = {};
	
	TinyBuilder.tools.saveAsFile = function(fileName, content){
		var textFileAsBlob = new Blob([content], {type:'text/plain'}); 
		if (window.navigator && window.navigator.msSaveOrOpenBlob){
			//IE11 support
			window.navigator.msSaveOrOpenBlob(textFileAsBlob, fileName);
		}else{
			var downloadLink = document.createElement("a");
			downloadLink.download = fileName;
			downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
			downloadLink.click();
		}
	}
})();

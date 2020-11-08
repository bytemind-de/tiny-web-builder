var TinyBuilder = {
	defaultCodeTheme: "default",
	isBrowserIE11: (!!window.MSInputMethodContext && !!document.documentMode)
}

/* --- PAGE API --- */

TinyBuilder.showPagePreview = function(){
	if (TinyBuilder.GrapesJS && TinyBuilder.CodeMirror){
		var code = TinyBuilder.GrapesJS.getPageCodeWithTemplate();
		if (code){
			var pagePrev = document.getElementById("page-preview");
			var pagePrevIframe = document.getElementById("page-preview-iframe");
			pagePrevIframe.srcdoc = code;
			pagePrev.style.top = "-100%";
			pagePrev.style.display = "";
			setTimeout(function(){
				pagePrev.style.top = "0%";
			}, 10);
		}
	}
}
TinyBuilder.hidePagePreview = function(){
	if (TinyBuilder.GrapesJS && TinyBuilder.CodeMirror){
		var pagePrev = document.getElementById("page-preview");
		pagePrev.style.top = "100%";
		setTimeout(function(){
			pagePrev.style.display = "none";
			pagePrev.style.top = "0%";
			var pagePrevIframe = document.getElementById("page-preview-iframe");
			pagePrevIframe.srcdoc = "";
		}, 501);
	}
}
TinyBuilder.toggleFullscreen = function(){
	var element = document.documentElement;
    if (document.documentElement.requestFullscreen && !document.fullscreen){
		element.requestFullscreen();
    }else if (document.exitFullscreen){
		document.exitFullscreen();
	}
}

/* --- START --- */

TinyBuilder.start = function(){
	if (TinyBuilder.isBrowserIE11){
		alert("I'm sorry but this app does NOT support Internet Explorer 11 or older browsers. Please use a modern Firefox or Chromium based browser!");
		return;
	}
	if (!TinyBuilder.GrapesJS){
		console.error("Missing library GrapesJS!");
		return;
	}
	TinyBuilder.GrapesJS.getConfig().tinyBuilder.addOnLoad(function(){
		console.log("TinyBuilder.GrapesJS - ready");
		
		//select style manager then blocks to work around selection bug
		var openSmBtn = editor.Panels.getButton('views', 'open-sm');
		var openBlocksBtn = editor.Panels.getButton('views', 'open-blocks');
		openSmBtn.set('active', 1);
		openBlocksBtn.set('active', 1);
	});
	TinyBuilder.GrapesJS.init();
	var editor = TinyBuilder.GrapesJS.getEditor();
	
	editor.on('load', function(){
		editor.getConfig().tinyBuilder.onLoad.forEach(function(fun){
			fun();
		});
	});
	editor.render();
	
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

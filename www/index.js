if (!('TinyBuilder' in window)){
	throw("Error: Missing 'tinyBuilder.js' - ABORT");
}

/* --- Settings --- */
	
TinyBuilder.defaultCodeTheme = 'vscode-dark'; //GrapesJS default: 'hopscotch'

var conf = TinyBuilder.GrapesJS.getConfig();
conf.plugins.push("tinybuilder-core");
conf.plugins.push("html-block");
/*if (conf.canvas.scripts){ 
	conf.canvas.scripts.push("js/test.js");
}else{
	conf.canvas.scripts = ["js/test.js"];
}*/
if (conf.canvas.styles){ 
	conf.canvas.styles.push("css/tinybuilder-core.css");
}else{
	conf.canvas.styles = ["css/tinybuilder-core.css"];
}
conf.tinyBuilder.hideTinyCss = false;
	
/* --- START --- */

TinyBuilder.start();

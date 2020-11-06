if (!('TinyBuilder' in window)){
	throw("Error: Missing 'tinyBuilder.js' - ABORT");
}

/* --- Settings --- */
	
TinyBuilder.defaultCodeTheme = 'vscode-dark'; //GrapesJS default: 'hopscotch'

var conf = TinyBuilder.GrapesJS.getConfig();
conf.plugins.push("tinybuilder-core");
conf.plugins.push("html-block");
//conf.canvas.scripts = ["js/test.js"];
conf.canvas.styles = ["css/tinybuilder-core.css"];
	
/* --- START --- */

TinyBuilder.start();

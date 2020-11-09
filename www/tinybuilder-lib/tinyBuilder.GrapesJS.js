if (!('TinyBuilder' in window)){
	throw("Error: Missing 'tinyBuilder.js' - ABORT");
}

/* --- GrapesJS --- */
(function(){
	TinyBuilder.GrapesJS = {};
	
	var editor;
	var pageTemplate = "";
	var defaultPageTemplate = '<!DOCTYPE html><html lang="en"><head>' 
		+ '<meta http-equiv="content-type" content="text/html; charset=UTF-8">'
		+ '<meta name="viewport" content="width=device-width, initial-scale=1">'
		+ '<title>TinyBuilder Page</title>'
		+ '\n[[IMPORTS]]\n' 
		+ '<style>\n' + '* {box-sizing: border-box;}\n html, body {margin: 0; padding: 0; width: 100%; height: 100%;}\n' 
		+ '\n[[CSS]]\n' 
		+ '</style></head><body>' + '[[HTML]]' + '</body></html>';
	
	TinyBuilder.GrapesJS.getEditor = function(){
		return editor;
	}
	
	TinyBuilder.GrapesJS.showModal = function(title, content){
		if (!editor){
			console.error("Initialize GrapesJS editor first plz, e.g.: 'TinyBuilder.GrapesJS.init()'");
			return;
		}
		var modal = editor.Modal;
		modal.close();
		modal.setContent('');
		modal.setTitle(title);
		modal.setContent(content);
		modal.open();
	}
	
	TinyBuilder.GrapesJS.getPageTemplate = function(){
		return pageTemplate || defaultPageTemplate;
	}
	TinyBuilder.GrapesJS.setPageTemplate = function(newTemplate){
		pageTemplate = newTemplate;
		editor.StorageManager.store({tinyBuilderPageTemplate: newTemplate}, function(){
			console.log("TinyBuilder - set page template");
		}, console.error);
		return pageTemplate;
	}
	TinyBuilder.GrapesJS.getPageCodeWithTemplate = function(grEditor){
		grEditor = grEditor || editor;
		if (!grEditor) return "";
		
		var htmlCode = grEditor.getHtml();
		var cssCode = grEditor.getCss();
		var conf = grEditor.getConfig();
		
		var metaData = "";
		if (conf.canvas.scripts){
			conf.canvas.scripts.forEach(function(sc){
				metaData += '<script type="text/javascript" src="' + sc + '"></script>\n';
			});
		}
		if (conf.canvas.styles){
			conf.canvas.styles.forEach(function(st){
				metaData += '<link rel="stylesheet" type="text/css" href="' + st + '">\n';
			});
		}
		return TinyBuilder.GrapesJS.getPageTemplate()
			.replace(/\[\[IMPORTS\]\]/g, metaData)
			.replace(/\[\[CSS\]\]/g, cssCode)
			.replace(/\[\[HTML\]\]/g, htmlCode);
	}
	function showCodeWithTemplate(grEditor){
		var fullCode = TinyBuilder.GrapesJS.getPageCodeWithTemplate(grEditor);
		TinyBuilder.CodeMirror.showCodeModal("Export Page", fullCode, {
			buttons: [{type: "export"}]
		});
	}
	function showTemplateCode(grEditor){
		var code = TinyBuilder.GrapesJS.getPageTemplate();
		TinyBuilder.CodeMirror.showCodeModal("Page Template", code, {
			buttons: [{
				name: "Save",
				fun: function(codeViewer, modal){
					TinyBuilder.GrapesJS.setPageTemplate(codeViewer.editor.getValue());
					modal.close();
				}
			},{
				name: "Reset",
				fun: function(codeViewer, modal){
					TinyBuilder.GrapesJS.setPageTemplate("");
					modal.close();
				}
			}]
		});
	}
	function importCssAndJs(grEditor){
		//TinyBuilder.GrapesJS.showModal("Import CSS/JS", content);
		alert("coming soon");
	}

	/* -- CONFIG -- */
	
	var grapesJsConfig = {
		//CONFIG OPTIONS: https://github.com/artf/grapesjs/blob/master/src/editor/config/config.js
		container : '#page-builder',
		height: '100%',
		width: '100%',
		canvas: {},
		components: '<div class="tiny-builder tb-body"></div>',
		//stylePrefix: 'tb-',	//NOTE: if you use this remember to adjust all CSS files
		style: '',
		//protectedCss: '* { box-sizing: border-box; } html, body { margin: 0; padding: 0; width: 100%; height: 100%; }',
		protectedCss: '',
		panels: { 
			defaults: [{
				id: 'headerbar',
				buttons: [{
					id: 'new-page',
					label: 'New',
					className: 'text-label',
					command: function(editor){
						var r = confirm("Clear all content and start new page?");
						if (r == true){
							editor.DomComponents.clear();
							editor.CssComposer.clear();
							editor.UndoManager.clear();
							/*editor.StorageManager.store({tinyBuilderPageTemplate: ""}, function(){
								window.location.reload();
							}, console.error);*/
							window.location.reload();
						}
					},
					attributes: { title: 'Clear all cached data and start default page' }
				},{
					id: 'edit-template',
					label: 'Edit template',
					className: 'text-label',
					command: showTemplateCode,
					attributes: { title: 'Edit page template for export' }
				},{
					id: 'import-styles-n-scripts',
					label: 'Import JS/CSS',
					className: 'text-label',
					command: importCssAndJs,
					attributes: { title: 'Import style sheets and code scripts' }
				}]
			},{
				id: 'commands',
				buttons: [{
					id: 'preview',
					className: 'fa fa-eye',
					//command: 'preview',
					command: 'tinybuilder-show-page-preview',
					context: 'preview',
					attributes: { title: 'Preview' }
				},{
					id: 'save-code',
					className: 'fa fa-download',
					command: showCodeWithTemplate,
					context: 'save-and-load',
					togglable: false,
					attributes: { title: 'Show code, edit and save' }
				},{
					id: 'export-template',
					className: 'fa fa-code',
					command: 'export-template',
					attributes: { title: 'View code' }
				},{
					id: 'undo',
					className: 'fa fa-undo',
					command: function(editor){ editor.runCommand('core:undo'); },
					attributes: { title: 'Undo last action' }
				},{
					id: 'redo',
					className: 'fa fa-repeat',
					command: function(editor){ editor.runCommand('core:redo'); },
					attributes: { title: 'Redo last removed action' }
				},{
					id: 'device-desktop',
					className: 'fa fa-desktop',
					command: 'set-device-desktop',
					active: true,
					attributes: { title: 'Desktop view' }
				},{
					id: 'device-tablet',
					className: 'fa fa-tablet',
					command: 'set-device-tablet',
					attributes: { title: 'Tablet view' }
				},{
					id: 'device-mobile',
					className: 'fa fa-mobile',
					command: 'set-device-mobile',
					attributes: { title: 'Mobile view' }
				}]
			}, {
				id: 'options',
				buttons: [{
					active: true,
					id: 'sw-visibility',
					className: 'fa fa-square-o',
					command: 'sw-visibility',
					context: 'sw-visibility',
					attributes: { title: 'View components' }
				},{
					id: 'tiny-logo-text',
					label: 'TinyBuilder',
					className: 'text-label plain',
					//attributes: { title: 'Edit page template for export' },
					command: function(editor){ TinyBuilder.GrapesJS.showModal("TinyBuilder", "<p>Created by FQ/Bytemind.de</p><p>Based on:</p><ul><li>GrapesJS</li><li>CodeMirror</li></ul><p>More info soon ...</p>"); }
				},{
					id: 'fullscreen',
					className: 'fa fa-arrows-alt',
					//command: 'fullscreen',
					command: 'tinybuilder-toggle-fullscreen',
					context: 'fullscreen',
					attributes: { title: 'Fullscreen' }
				}]
			},{
				id: 'views',
				buttons: [{
					id: 'open-blocks',
					className: 'fa fa-th-large',
					command: 'open-blocks',
					togglable: 0,
					attributes: { title: 'Open Blocks' }
				},{
					id: 'open-sm',
					className: 'fa fa-sliders',
					command: 'open-sm',
					togglable: 0,
					attributes: { title: 'Open Style Manager' }
				},{
					id: 'open-tm',
					className: 'fa fa-cog',
					command: 'open-tm',
					togglable: 0,
					attributes: { title: 'Settings' }
				},{
					id: 'open-layers',
					className: 'fa fa-sitemap',
					command: 'open-layers',
					active: true,
					togglable: 0,
					attributes: { title: 'Open Layer Manager' }
				}]
			}/*,{
				id: 'basic-actions',
				//el: '.panel__basic-actions',
				buttons: [{
					id: 'show-json',
					className: 'btn-show-json',
					label: 'JSON',
					context: 'show-json',
					command: function(editor) {
						editor.Modal.setTitle('Components JSON')
						.setContent('<textarea style="width:100%; height: 250px;">' + JSON.stringify(editor.getComponents()) + '</textarea>')
						.open();
					}
				}]
			}*/]
		},
		//Configurations for Style Manager
		styleManager: {
			sectors: [{
				name: 'General',
				open: false,
				buildProps: [
				  'float', 'display', 'position', 'top', 'right', 'left', 'bottom'
				]
			},{
				name: 'Flex',
				open: false,
				buildProps: [
				  'flex-direction', 'flex-wrap', 'justify-content', 'align-items', 'align-content', 'order',
				  'flex-basis', 'flex-grow', 'flex-shrink', 'align-self'
				]
			},{
				name: 'Dimension',
				open: false,
				buildProps: [
				  'width', 'height', 'max-width', 'max-height', 'min-width', 'min-height',
				  'margin', 'padding'
				]
			},{
				name: 'Typography',
				open: false,
				buildProps: [
				  'font-family', 'font-size', 'font-weight', 'letter-spacing',
				  'color', 'line-height', 'text-align', 'text-shadow'
				],
				properties: [{
					property: 'text-align',
					list: [
						{ value: 'left', className: 'fa fa-align-left' },
						{ value: 'center', className: 'fa fa-align-center' },
						{ value: 'right', className: 'fa fa-align-right' },
						{ value: 'justify', className: 'fa fa-align-justify' }
					]
				}]
			},{
				name: 'Decorations',
				open: false,
				buildProps: [
				  'border-radius-c', 'background-color', 'border-radius', 'border',
				  'box-shadow', 'background'
				]
			},{
				name: 'Extra',
				open: false,
				buildProps: ['transition', 'perspective', 'transform']
			}]
		},
		plugins: [],
		pluginsOpts: {},
		showDevices: false,
		deviceManager: {
			devices: [{
				name: 'Desktop',
				width: '', 				// default size
				height: ''
			},{
				name: 'Tablet',
				width: '768px',
				//widthMedia: '768'	//NOTE: when a device is selected media queries will be generated with this value
				height: '1024px'
			},{
				name: 'Mobile',
				width: '360px',
				height: '720px'
			}]
		},
		assetManager: {
			upload: false
		},
		cssIcons: "fonts/font-awesome.min.css",
		autorender: false,
		tinyBuilder: {
			hideTinyCss: false,
			onLoad: [],
			addOnLoad: function(fun){
				grapesJsConfig.tinyBuilder.onLoad.push(fun);
			}
		}
	}
	//IE11 hacks - actually IE11 doesn't work anyways
	if (TinyBuilder.isBrowserIE11){
		grapesJsConfig.storageManager = false;
	}
	
	TinyBuilder.GrapesJS.getConfig = function(){
		return grapesJsConfig;
	}
	
	/* -- Style manager -- */
	
	//INFO: https://github.com/artf/grapesjs/blob/dev/src/style_manager/index.js
	//		https://github.com/artf/grapesjs/blob/master/test/specs/style_manager/model/Models.js
	var stylePropertyVertAlign = {
		name: "Vertical Align",
		property: "vertical-align",
		type: "select",
		default: "auto",
		list: [
			{value: "auto", name: "auto"}, 
			{value: "top !important", name: "top"},
			{value: "middle !important", name: "middle"},
			{value: "bottom !important", name: "bottom"}
		]
	};
	var stylePropertyBackgroundString = {
		name: "Background-image string (beta)",
		property: "background-image",
		//type: "color",
		default: ""
	};
	var stylePropertyBackgroundGradient = {
		name: 'Background-image gradient (beta)',
		property: 'background-image',
		type: 'gradient',
		defaults: 'none'
	};
	function styleManagerAddProperties(){
		//not possible in plugins?
		//editor.StyleManager.addProperty("typography", stylePropertyVertAlign);
		editor.StyleManager.addProperty("decorations", stylePropertyBackgroundString);
		//editor.StyleManager.addProperty('decorations', stylePropertyBackgroundGradient);		//Note: deactivated because buggy
	}
	function styleManagerModifyProperties(){
		editor.StyleManager.getProperty("general", "display").attributes.list.push({value: "inline-flex"});
	}
	
	/* -- INIT -- */
	
	TinyBuilder.GrapesJS.init = function(){
		if (!grapesJsConfig.tinyBuilder) grapesJsConfig.tinyBuilder = {};
		editor = grapesjs.init(grapesJsConfig);
		
		//styles
		styleManagerModifyProperties();
		styleManagerAddProperties();
		
		//tiny templates
		editor.StorageManager.load(["tinyBuilderPageTemplate"], function(res){
			if (res && res.tinyBuilderPageTemplate){ 
				TinyBuilder.GrapesJS.setPageTemplate(res.tinyBuilderPageTemplate);
			}
		}, console.error);
		
		//commands
		editor.Commands.add('tinybuilder-show-code-editor', showCodeWithTemplate);
		editor.Commands.add('tinybuilder-show-page-template', showTemplateCode);
		editor.Commands.add('tinybuilder-show-page-preview', TinyBuilder.showPagePreview);
		editor.Commands.add('tinybuilder-toggle-fullscreen', TinyBuilder.toggleFullscreen);
		editor.Commands.add('tinybuilder-import-css-and-js', importCssAndJs);
		
		//events
		editor.on('change:device', function(){
			console.log('Current device: ', editor.getDevice());
		});
		//editor.on('component:styleUpdate', function(model, style, info){});
		//editor.on('component:selected', function(model, info){});
		
		//make all selectors 'deselected' by default and some private
		editor.on('selector:add', function(selector){
			//console.log("selector-add", selector);
			selector.set({
				active: false
			});
		});
		editor.SelectorManager.getAll().each(function (selector){
			if (grapesJsConfig.tinyBuilder.hideTinyCss){
				if (selector.get('name').indexOf("tiny") == 0){ selector.set({ private: true }); }
			}
			return selector.set('active', false);
		});
		
		return editor;
	}
})();

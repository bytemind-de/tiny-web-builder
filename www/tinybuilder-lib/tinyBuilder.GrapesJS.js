if (!('TinyBuilder' in window)){
	throw("Error: Missing 'tinyBuilder.js' - ABORT");
}

/* --- GrapesJS --- */
(function(){
	TinyBuilder.GrapesJS = {};
	
	var editor;
	
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
	function showCodeWithTemplate(editor){
		var htmlCode = editor.getHtml();
		var cssCode = editor.getCss();
		var fullCode = '<!DOCTYPE html>\n'
			+ '<html lang="en">\n'
				+ '<head>\n'
					+ '\n'
					+ '<style>\n' 
						+ cssCode 
					+ '\n</style>\n'
				+ '</head>\n'
				+ '<body>\n'
					+ htmlCode
				+ '\n</body>\n'
			+ '</html>';
			
		TinyBuilder.CodeMirror.showCodeModal("Code", fullCode, {
			buttons: [{type: "export"}]
		});
	}

	var grapesJsConfig = {
		//CONFIG OPTIONS: https://github.com/artf/grapesjs/blob/master/src/editor/config/config.js
		container : '#page-builder',
		height: '100%',
		width: '100%',
		canvas: {},
		components: '',
		style: '',
		protectedCss: '* { box-sizing: border-box; } body {margin: 0; padding: 0; font-family: sans-serif; }',
		panels: { 
			defaults: [{
				id: 'headerbar',
				buttons: [{
					id: 'new-page',
					label: 'new',
					className: 'text-label',
					command: function(editor){
						var r = confirm("Clear all content and start new page?");
						if (r == true){
							editor.DomComponents.clear();
							editor.CssComposer.clear();
							editor.UndoManager.clear();
						}
					}
				}]
			},{
				id: 'commands',
				buttons: [{
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
					command: function(editor){ editor.runCommand('core:undo'); }
				},{
					id: 'redo',
					className: 'fa fa-repeat',
					command: function(editor){ editor.runCommand('core:redo'); }
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
					id: 'preview',
					className: 'fa fa-eye',
					command: 'preview',
					context: 'preview',
					attributes: { title: 'Preview' }
				},{
					id: 'fullscreen',
					className: 'fa fa-arrows-alt',
					command: 'fullscreen',
					context: 'fullscreen',
					attributes: { title: 'Fullscreen' }
				}]
			},{
				id: 'views',
				buttons: [{
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
				},{
					id: 'open-blocks',
					className: 'fa fa-th-large',
					command: 'open-blocks',
					togglable: 0,
					attributes: { title: 'Open Blocks' }
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
		plugins: [],
		pluginsOpts: {},
		showDevices: false,
		deviceManager: {
			devices: [{
				name: 'Desktop',
				width: '', 				// default size
				//widthMedia: '1024'	// ??
				height: ''
			},{
				name: 'Tablet',
				width: '1024px',
				height: '768px'
			},{
				name: 'Mobile',
				width: '360px',
				height: '720px'
			}]
		},
		cssIcons: "fonts/font-awesome.min.css"
	}
	
	TinyBuilder.GrapesJS.getConfig = function(){
		return grapesJsConfig;
	}
	
	TinyBuilder.GrapesJS.init = function(){
		editor = grapesjs.init(grapesJsConfig);
		
		//commands
		editor.Commands.add('tinybuilder-show-code-editor', showCodeWithTemplate);
		
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
			if (selector.get('name').indexOf("tiny") == 0){ selector.set({ private: true }); }
			return selector.set('active', false);
		});
		
		return editor;
	}
})();

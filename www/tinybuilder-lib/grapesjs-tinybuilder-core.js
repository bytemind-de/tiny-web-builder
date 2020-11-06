grapesjs.plugins.add('tinybuilder-core', function(editor, options){
	
	//Commands
	editor.Commands.add('set-device-desktop', {
		run: function(editor){ editor.setDevice('Desktop'); }
	});
	editor.Commands.add('set-device-tablet', {
		run: function(editor){ editor.setDevice('Tablet'); }
	});
	editor.Commands.add('set-device-mobile', {
		run: function(editor){ editor.setDevice('Mobile'); }
	});
	
	//Blocks + Components
	var tinyCoreBlocks = {
		tinyAppView1: {
			label: "Simple app view",
			category: "TinyBuilder Page templates",
			blockAttributes: {"class": "fa fa-object-group"},
			comp: {
				tagName: "div",
				attributes: {"class": "tiny-page"},
				components: [{
					tagName: "div",
					attributes: {"class": "tiny-page-header"},
					components: "<span>Header</span>"		//`content` for static strings, `components` string will be parsed to Component
				},{
					tagName: "div",
					attributes: {"class": "tiny-page-content"},
					components: "<span>Content</span>"
				},{
					tagName: "div",
					attributes: {"class": "tiny-page-footer"},
					components: "<span>Footer</span>"
				}]
			}
		},
		tinyDiv1: {
			label: "Fullsize flex DIV",
			category: "Basic Elements",
			blockAttributes: {"class": "fa fa-square-o"},
			comp: {
				tagName: "div",
				attributes: {"class": "tiny-fullsize tiny-flex-centered"},
				components: "DIV"
			}
		},
		plainDiv: {
			label: "div",
			category: "Basic Elements",
			comp: {
				tagName: 'div',
				type: 'text',
				removable: true,
				draggable: true,	//'form, form *', // Can be dropped only inside `form` elements
				droppable: true,
				copyable: true,
				content: 'DIV',
				style: {
					//"min-height": "40px"
				},
				attributes: {}
			}
		},
		plainTextarea: {
			label: "textarea",
			category: "Basic Elements",
			comp: {
				tagName: 'textarea',
				type: 'text',
				droppable: false
			}
		},
		plainInput: {
			label: "input",
			category: "Basic Elements",
			comp: {
				tagName: 'input',
				droppable: false,
				attributes: {
					type: 'text',
					name: '',
					placeholder: 'Insert text here'
				},
				traits: ['name', 'placeholder',	{ type: 'checkbox', name: 'required' }]
			}
		},
		tinyButton: {
			label: "tb-button",
			category: "Styled Elements",
			comp: {
				tagName: 'button',
				content: 'Button',
				attributes: {
					"class": "tiny-button"
				}
			}
		}
	}
	
	Object.keys(tinyCoreBlocks).forEach(function(key){
		var compInfo = tinyCoreBlocks[key];
		var comp = compInfo.comp;
		editor.BlockManager.add('tinycore-' + key, {
			label: compInfo.label || key,
			category: compInfo.category || "Other",
			attributes: compInfo.blockAttributes || {},
			content: comp		//use `content` for static strings, `components` string will be parsed and transformed in Components
		});
	});
	
	//Style manager
	
	//not yet ready here?
	/*editor.StyleManager.addProperty("Typography", {
		name: "Vertical Align",
		property: "vertical-align",
		type: "select",
		default: "auto",
		list: [{
				value: "auto",
				name: "auto"
			}, {
				value: "top !important",
				name: "top"
			},
			{
				value: "middle !important",
				name: "middle"
			},
			{
				value: "bottom !important",
				name: "bottom"
			}
		]
	});*/
	//editor.StyleManager.getConfig().sectors[3].buildProps.push("vertical-align");
	/*editor.StyleManager.getConfig().sectors.forEach(function(sec){
		if (sec.name == "Dimension"){
			sec.buildProps.push("padding");
		}
	});*/

	console.log("GrapesJS - Installed plugin: tinybuilder-core");
});
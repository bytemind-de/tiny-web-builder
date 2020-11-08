if (!('TinyBuilder' in window)){
	throw("Error: Missing 'tinyBuilder.js' - ABORT");
}

/* --- CodeMirror --- */
(function(){
	TinyBuilder.CodeMirror = {};
	
	TinyBuilder.CodeMirror.showCodeModal = function(title, code, options){
		if (!options) options = {};
		
		var modalContent = document.createElement('div');
		modalContent.style.maxHeight = "calc(85vh - 40px)";
		modalContent.style.overflow = "auto";
		
		var codeControls = document.createElement('div');
		codeControls.style.width = "100%";
		codeControls.style.height = "40px";
		
		//code buttons
		if (options.buttons){
			options.buttons.forEach(function(btnConfig){
				var btn = document.createElement('button');
				btn.className = "gjs-btn-prim gjs-btn-code-view";
				if (btnConfig.type == "export"){
					//pre-defined export button
					btn.textContent = "Export";
					btn.onclick = function(){
						var code = codeViewer.editor.getValue();
						TinyBuilder.tools.saveAsFile("new.html", code);
					};
				}else{
					//custom button
					btn.textContent = btnConfig.label || btnConfig.name;
					btn.onclick = function(){
						var modal = TinyBuilder.GrapesJS.getEditor().Modal;
						btnConfig.fun(codeViewer, modal);
					}
					/*btnEdit.onclick = function(){
						editor.DomComponents.getWrapper().set('content', '');
						editor.setComponents(code.trim());
						modal.close();
					};*/
				}
				codeControls.appendChild(btn);
			});
			modalContent.appendChild(codeControls);
		}
		
		var codeArea = document.createElement('textarea');
		modalContent.appendChild(codeArea);
				
		var codeViewer = TinyBuilder.GrapesJS.getEditor().CodeManager.getViewer('CodeMirror').clone();
		codeViewer.set({
			codeName: 'htmlmixed',
			readOnly: 0,
			theme: TinyBuilder.defaultCodeTheme,
			autoBeautify: true,
			autoCloseTags: true,
			autoCloseBrackets: true,
			lineNumbers: true,
			lineWrapping: true,
			styleActiveLine: true,
			smartIndent: true,
			indentWithTabs: true
			/*, dragDrop: true,
			allowDropFileTypes: ["text/x-java"]*/
		});
		codeViewer.init(codeArea);
		codeViewer.setContent(code);
		
		var viewEditor = codeViewer.editor;
		
		TinyBuilder.GrapesJS.showModal(title, modalContent);
		viewEditor.refresh();
	}
})();

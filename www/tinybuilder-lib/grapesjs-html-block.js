grapesjs.plugins.add('html-block', function(editor, options){
  options = options || {};

  addHTMLCodeEditor();
  addHTMLCodeComponent();
  addHTMLCodeBlock();
  console.log("GrapesJS - Installed plugin: html-block");

  function addHTMLCodeEditor() {
    editor.Commands.add("open-html-code-editor", {
      run: function(editor, sender, data) {
        var component = editor.getSelected();

        var htmlContent = document.createElement("div");
        htmlContent.innerHTML = component.toHTML();
        htmlContent = htmlContent.firstChild.innerHTML;
        
		TinyBuilder.CodeMirror.showCodeModal("Edit HTML", htmlContent, {
			buttons: [{
				name: "Save",
				fun: function(codeViewer, modal){
					component.set("content", "");
					component.components(codeViewer.editor.getValue());
					modal.close();
				}
			}]
		});
      }
    });
  };

  function addHTMLCodeComponent() {
    var defaultType = editor.DomComponents.getType('default');

    var _initToolbar = defaultType.model.prototype.initToolbar;

    editor.DomComponents.addType('html-code', {
      model: defaultType.model.extend({
        initToolbar: function(args) {
          _initToolbar.apply(this, args);

          var toolbar = this.get("toolbar");
          toolbar.push({
              attributes: { "class": "fa fa-code" },
                command: "open-html-code-editor"
          });
          this.set("toolbar", toolbar);
        }
      }, {
        isComponent: function(el) {
          if (typeof el.hasAttribute == "function" && el.hasAttribute("data-html-code")) {
            return {type: "html-code"};
          }
        }
      }),
      view: defaultType.view
    });

  };

  function addHTMLCodeBlock() {
    editor.BlockManager.add("html-code", {
      attributes: {class: "fa fa-code"},
      label: "HTML Code",
	  category: "Code",
      content: '<div data-html-code>Edit my HTML content</div>'
    });
  };

});

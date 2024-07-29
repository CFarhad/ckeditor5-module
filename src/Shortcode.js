import ButtonView from "@ckeditor/ckeditor5-ui/src/button/buttonview";
import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import extToMime from "./extToMime";

export default class Shortcode extends Plugin {
  init() {
    const editor = this.editor;

    let popupWindow = null;

    // register toolbar button
    editor.ui.componentFactory.add("shortCode", () => {
      const button = new ButtonView();

      button.set({
        label: "کد‌کوتاه",
        withText: true,
      });

      button.on("execute", handleButtonClick);

      return button;
    });

    function handleButtonClick(e) {
      window['shortCodeListModal'].show()
    }

    window['shortCodeEditorAdder'] = function handlePopupMessage(shortcode) {

      if (!shortcode) return;

      const viewFragment = editor.data.processor.toView(`${shortcode}`);
      const modelFragment = editor.data.toModel(viewFragment);
      editor.model.insertContent(modelFragment);

    }

  }
}

import ButtonView from "@ckeditor/ckeditor5-ui/src/button/buttonview";
import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import extToMime from "./extToMime";

export default class FileManager extends Plugin {
  init() {
    const editor = this.editor;

    let popupWindow = null;

    // register toolbar button
    editor.ui.componentFactory.add("fileManager", () => {
      const button = new ButtonView();

      button.set({
        label: "افزودن فایل",
        withText: true,
      });

      button.on("execute", handleButtonClick);

      return button;
    });

    function handleButtonClick(e) {
      window['uploader-type'] = "ckeditor";
      popupWindow = window.open(
        "/file-manager/fm-button",
        "fm",
        "width=1400,height=800"
      );
      window['exampleModal'].show()
    }

    window['ckeditor_file'] = function handlePopupMessage(url) {

      if (!url) return;

      const TEXT_NO_SUPPORT = "فایل پشتیبانی نمی شود";

      const fileUrl = url;
      const fileExtension = fileUrl.split(".").reverse()[0].toLowerCase();
      const fileMimeType = extToMime["." + fileExtension];

      let html = "";
      if (isImage(fileMimeType)) {
        html = `<img src="${fileUrl}" />`;
      } else if (isVideo(fileMimeType)) {
        html = `<video width="640" height="360" controls>
                    <source src="${fileUrl}" type="${fileMimeType}">
                    ${TEXT_NO_SUPPORT} ویدیو. <a href="${fileUrl}">دانلود ویدیو</a>
                </video>`;
      } else if (isAudio(fileMimeType)) {
        html = `<audio controls>
                    <source src="${fileUrl}" type="${fileMimeType}">
                    ${TEXT_NO_SUPPORT} صدا. <a href="${fileUrl}">دانلود صدا</a>
                </audio>`;
      } else if (isPdf(fileMimeType)) {
        html = `
                <object data="${fileUrl}" type="application/pdf" width="700" height="1050">
                    ${TEXT_NO_SUPPORT} PDF. <a href="${fileUrl}">دانلود PDF</a>
                </object>`;
      } else {
        html = `<a href="${fileUrl}">${fileUrl}</a>`;
      }

      const viewFragment = editor.data.processor.toView(html);
      const modelFragment = editor.data.toModel(viewFragment);
      editor.model.insertContent(modelFragment);

      window['uploader-type'] = ""

      popupWindow.close();
    }

    function isImage(mimeType) {
      return mimeType && mimeType.split("/")[0] === "image";
    }

    function isVideo(mimeType) {
      return mimeType && mimeType.split("/")[0] === "video";
    }

    function isAudio(mimeType) {
      return mimeType && mimeType.split("/")[0] === "audio";
    }

    function isPdf(mimeType) {
      return mimeType === "application/pdf";
    }
  }
}

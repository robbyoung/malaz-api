document.addEventListener("htmx:configRequest", function (evt) {
  if (evt.detail.path.includes("/selection")) {
    const startIndex = window.getSelection().baseOffset;
    const endIndex = window.getSelection().extentOffset;

    evt.detail.path = `${evt.detail.path}&start=${startIndex}&end=${endIndex}`;

    console.log(`Text selected ${startIndex} - ${endIndex}`, evt);
  }
});

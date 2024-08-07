function handleAutocomplete() {
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    const autocompleteAttr = input.getAttribute('autocomplete');
    if (autocompleteAttr) {
      input.setAttribute('autocomplete', 'on');
    } else {
      input.setAttribute('autocomplete', 'on');
    }
  });
}

function fillInputFields() {
  chrome.storage.sync.get(["name", "email", "url"], (data) => {
    // console.log(data);

    const hasValidName = data.name !== undefined && data.name !== "";
    const hasValidEmail = data.email !== undefined && data.email !== "";
    const hasValidUrl = data.url !== undefined && data.url !== "";

    // 关键字
    const nameKeywords = [
      "name", "author", "display_name", "full-name", "username", "nick", "displayname", 
      "first-name", "last-name", "full name", "real-name", "given-name", 
      "family-name", "user-name", "pen-name", "alias", "name-field", "displayname"
    ];
    const emailKeywords = [
      "email", "mail", "contact", "emailaddress", "mailaddress", 
      "email-address", "mail-address", "email-addresses", "mail-addresses", 
      "emailaddresses", "mailaddresses", "contactemail", "useremail", 
      "contact-email", "user-mail"
    ];
    const urlKeywords = [
      "url", "link", "website", "homepage", "site", "web", "address", 
      "siteurl", "webaddress", "homepageurl", "profile", "homepage-link"
    ];

    const inputs = document.querySelectorAll("input, textarea");

    inputs.forEach((input) => {
      const typeAttr = input.getAttribute("type")?.toLowerCase() || "";
      const nameAttr = input.getAttribute("name")?.toLowerCase() || "";
      let valueToSet = "";

      // 处理 URL
      if (urlKeywords.some(keyword => nameAttr.includes(keyword))) {
        if (hasValidUrl) {
          valueToSet = data.url;
        }
      }
      // 处理邮箱
      else if (emailKeywords.some(keyword => nameAttr.includes(keyword))) {
        if (hasValidEmail) {
          valueToSet = data.email;
        }
      }
      // 处理名称
      else if (nameKeywords.some(keyword => nameAttr.includes(keyword))) {
        if (hasValidName) {
          valueToSet = data.name;
        }
      }

      // 处理没有 type 属性或者 type 为 text 的情况
      if ((typeAttr === "" || typeAttr === "text") && valueToSet === "") {
        if (nameAttr && nameKeywords.some(keyword => nameAttr.includes(keyword))) {
          if (hasValidName) {
            valueToSet = data.name;
          }
        } else if (nameAttr && urlKeywords.some(keyword => nameAttr.includes(keyword))) {
          if (hasValidUrl) {
            valueToSet = data.url;
          }
        }
      }

      // 处理 type 为 email
      if (typeAttr === "email" && valueToSet === "") {
        if (nameAttr && emailKeywords.some(keyword => nameAttr.includes(keyword))) {
          if (hasValidEmail) {
            valueToSet = data.email;
          }
        }
      }

      // 处理 type 为 url
      if (typeAttr === "url" && valueToSet === "") {
        if (nameAttr && urlKeywords.some(keyword => nameAttr.includes(keyword))) {
          if (hasValidUrl) {
            valueToSet = data.url;
          }
        }
      }

      // 填充输入字段
      if (valueToSet !== "") {
        input.value = valueToSet;
      }
    });
  });
}

function clearInputFields() {
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => {
    const typeAttr = input.getAttribute("type")?.toLowerCase();
    if (typeAttr === "text" || typeAttr === "email") {
      input.value = "";
    }
  });
}

// 监听 textarea 标签的输入事件
document.addEventListener("input", (event) => {
  if (event.target.tagName.toLowerCase() === "textarea") {
    handleAutocomplete();
    fillInputFields();
  }
});
import './fonts/iconfont.css';
import './template.css';

// 为“保存”按钮添加点击事件监听器
document.getElementById("save").addEventListener("click", () => {
  const saveButton = document.getElementById("save");

  // 检查按钮文本内容以确定当前状态
  if (saveButton.textContent === "更改") {
    // 解锁输入框
    unlockInputFields();
    // 更改按钮文本为“保存”
    changeButtonText("保存");
    // 终止操作，不做进一步的保存操作
    return;
  }

  // 如果按钮文本为“保存”，执行保存操作
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const url = document.getElementById("url").value.trim();

  // 验证邮箱格式的正则表达式
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // 验证必填字段是否为空以及邮箱格式是否正确
  if (name === "" || email === "") {
    alert("请填写必填字段：姓名和邮箱!");
    return;
  }

  if (!emailPattern.test(email)) {
    alert("请输入有效的邮箱地址!");
    return;
  }

  // 从 Chrome 存储中读取当前的值
  chrome.storage.sync.get(["name", "email", "url"], (data) => {
    // 比较输入框的值与存储中的值是否一致
    const isNameAndEmailChanged = name !== data.name || email !== data.email;
    const isUrlChanged = url !== data.url;

    if (isNameAndEmailChanged || isUrlChanged) {
      // 如果数据发生变化，则更新存储
      chrome.storage.sync.set({ name, email, url }, () => {
        // 锁定输入框
        lockInputFields();
        // 更改按钮文本为“更改”
        changeButtonText("更改");
      });
    } else {
      // 如果信息没有改变，无需保存
      // 锁定输入框
      lockInputFields();
      // 更改按钮文本为“更改”
      changeButtonText("更改");
    }
  });
});

// 页面加载完成时执行
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get(["name", "email", "url"], (data) => {
    document.getElementById("name").value = data.name || "";
    document.getElementById("email").value = data.email || "";
    document.getElementById("url").value = data.url || "";

    // 如果存储中有数据，锁定输入框和更改按钮文本为“更改”
    if (data.name || data.email || data.url) {
      lockInputFields();
      changeButtonText("更改");
    }
  });

  const menuItems = document.querySelectorAll('.dl-menu li a');
  const tabContents = document.querySelectorAll('.tab-content');

  menuItems.forEach(menuItem => {
    menuItem.addEventListener('click', (event) => {
      event.preventDefault();
      
      tabContents.forEach(tab => tab.classList.remove('active'));
      
      const targetId = menuItem.getAttribute('href').substring(1);
      document.getElementById(targetId).classList.add('active');
      
      menuItems.forEach(item => item.parentElement.classList.remove('active'));
      
      menuItem.parentElement.classList.add('active');
    });
  });
});

// 锁定输入框
function lockInputFields() {
  document.getElementById("name").setAttribute("disabled", "true");
  document.getElementById("email").setAttribute("disabled", "true");
  document.getElementById("url").setAttribute("disabled", "true");
}

// 解锁输入框
function unlockInputFields() {
  document.getElementById("name").removeAttribute("disabled");
  document.getElementById("email").removeAttribute("disabled");
  document.getElementById("url").removeAttribute("disabled");
}

// 更改按钮文本
function changeButtonText(text) {
  document.getElementById("save").textContent = text;
}
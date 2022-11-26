// To Focus Input
inputHandel();

const Form = document.getElementById("form");
const Task_Container = document.getElementById("task-container");
let taskArr = [];
let pendingArr = [];
let completeArr = [];
const fillters = document.querySelectorAll(".fill");
let idCounter = 0;

fillters.forEach((fillter) => {
  fillter.addEventListener("click", (e) => {
    for (let i = 0; i < fillters.length; i++)
      fillters[i].classList.remove("active");
    fillter.classList.add("active");
    if (fillter.classList.contains("pending")) {
      pendingArr = [];
      Task_Container.innerHTML = "";
      for (let i of taskArr) {
        console.log(i);
        if (!i.complete) {
          pendingArr.push(i);
          updatDom(i);
        }
      }
      console.log(pendingArr);
    } else if (fillter.classList.contains("complete")) {
      completeArr = [];
      Task_Container.innerHTML = "";
      for (let i of taskArr) {
        console.log(i);
        if (i.complete) {
          completeArr.push(i);
          updatDom(i);
        }
      }
    } else {
      Task_Container.innerHTML = "";
      for (let i of taskArr) {
        console.log(i);
        completeArr.push(i);
        updatDom(i);
      }
    }
  });
});

if (localStorage.newTask) {
  let theTask = JSON.parse(localStorage.newTask);
  taskArr = [];
  for (let task of theTask) {
    taskArr.push(task);
    updatDom(task);
  }
}

// Form Valdation
Form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!taskName.classList.contains("edit")) {
    let inputVal = taskName.value.trim();
    if (inputVal) {
      let data = taskData(inputVal);
      updatDom(data);
      inputHandel();
    }
  } else {
    taskName.classList.remove("edit");
  }
});

clear.addEventListener("click", () => {
  taskArr = [];
  localStorage.clear();
  Task_Container.innerHTML = "";
  inputHandel();
});

// Fuction Update Dom
function updatDom(data) {
  idCounter++;
  // Create Task Div & Add Class
  let taskDiv = document.createElement("div");
  taskDiv.className = `task${data.complete ? " complete" : ""}`;
  taskDiv.id = data.id;
  // Create Form & Create Input + Label
  // Form
  let form = document.createElement("form");
  form.setAttribute("action", "");
  // Input + Label
  // Input & Add id
  let checkBox = document.createElement("input");
  checkBox.setAttribute("type", "checkbox");
  checkBox.id = `checkbox${idCounter}`;
  data.complete
    ? checkBox.setAttribute("checked", "true")
    : checkBox.removeAttribute("checked");
  // checkBox.removeAttribute("checked");
  // Label & Add id
  let label = document.createElement("label");
  label.setAttribute("for", `checkbox${idCounter}`);
  label.textContent = data.taskVal;
  // Create Setting Div & Add Class
  let settingDiv = document.createElement("div");
  settingDiv.className = "settings";
  // Create Ul & Add Class
  let ul = document.createElement("ul");
  ul.className = "polit";
  // Create Dil-Edit Div & Add Class
  let del_edit = document.createElement("div");
  del_edit.className = "del-edit";
  // Create Edit Div & Childrens
  // Edit Div
  let editDiv = document.createElement("div");
  editDiv.className = "edit";
  // Childrens
  let editIcon = document.createElement("span");
  editIcon.className = "fa-sharp fa-solid fa-pen";
  let editText = document.createElement("span");
  editText.className = "short-cut";
  editText.textContent = "Edit";
  // Create Delete Div & Childrens
  // Delete Div
  let delDiv = document.createElement("div");
  delDiv.className = "del";
  // Childrens
  let delIcon = document.createElement("span");
  delIcon.className = "fa-solid fa-trash trash";
  let delText = document.createElement("span");
  delText.className = "short-cut";
  delText.textContent = "Delete";
  // Appending All Elements Inside It
  // Append Input + Label Inside From
  form.appendChild(checkBox);
  form.appendChild(label);
  // Append Lis Inside Ul & Ul Inside Settings
  // Append Lis Inside Ul
  for (let i = 0; i < 3; i++) {
    let li = document.createElement("li");
    ul.appendChild(li);
  }
  // Ul Inside Settings
  settingDiv.appendChild(ul);
  // Append Edit Icon + Edit Text Inside Edit Div
  editDiv.appendChild(editIcon);
  editDiv.appendChild(editText);
  // Append Delete Icon + Delete Text Inside Delete Div
  delDiv.appendChild(delIcon);
  delDiv.appendChild(delText);
  del_edit.appendChild(editDiv);
  del_edit.appendChild(delDiv);
  // Append Edit + Del Inside Settings Div
  settingDiv.appendChild(del_edit);
  // Append Form + Settings Inside Task Div
  taskDiv.appendChild(form);
  taskDiv.appendChild(settingDiv);
  // Append Task Div Inside Task Container
  Task_Container.appendChild(taskDiv);
  // Settings Click
  taskDiv.addEventListener("click", (e) => {
    if (e.target.closest(".polit")) {
      ul.classList.toggle("show");
      for (let i of Task_Container.children) {
        let ulEle = i.lastElementChild.firstElementChild;
        if (ulEle.classList.contains("show")) {
          ulEle.classList.remove("show");
        }
        ul.classList.add("show");
      }
    } else if (e.target.closest(".del")) {
      ul.closest(".task").remove();
      fillterDel(taskArr, ul.closest(".task"));
    } else if (e.target.closest(".edit")) {
      ul.classList.remove("show");
      taskName.classList.add("edit");
      inputHandel();
      taskName.value = label.textContent;
      taskName.oninput = () => {
        if (taskName.classList.contains("edit")) {
          label.textContent = taskName.value;
          fillterEdit(taskArr, ul.closest(".task"));
        }
      };
      Form.onsubmit = () => {
        taskName.value = "";
      };
    } else {
      ul.classList.remove("show");
      checkBox.hasAttribute("checked")
        ? checkBox.removeAttribute("checked")
        : checkBox.setAttribute("checked", "true");
      // console.log(checkBox.hasAttribute("checked"));
      checkBox.closest(".task").classList.toggle("complete");
      // console.log(e.target);
      if (e.target === taskDiv) {
        for (let i in taskArr) {
          if (taskArr[i].id === +taskDiv.id) {
            taskArr[i].complete = taskDiv.classList.contains("complete");
            saveData();
          }
        }
      }
    }
  });
  saveData();
}

// Fuction Task Data
function taskData(value) {
  let taskObj = {
    taskVal: value,
    id: Date.now(),
    complete: false,
  };
  taskArr.push(taskObj);
  return taskObj;
}

// Fuction Save Data
function saveData() {
  localStorage.setItem("newTask", JSON.stringify(taskArr));
}

// Filtter Function
function fillterDel(arr, el) {
  taskArr = [];
  for (let i of arr) {
    if (i.id !== +el.id) {
      taskArr.push(i);
    }
  }
  saveData();
}

// Function Edit
function fillterEdit(arr, el) {
  for (let i in arr) {
    if (taskArr[i].id === +el.id) {
      taskArr[i].taskVal = taskName.value;
      saveData();
    }
  }
}

// Task Name Handling
function inputHandel() {
  taskName.value = "";
  taskName.focus();
}

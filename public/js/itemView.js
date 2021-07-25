let moneyGivenInput = document.querySelectorAll("input");
const id = window.location.pathname.split("/")[2];
const icons = document.querySelectorAll(".icon");

document.onload = changeIcon();
document.onload = addToLocalMemory();

console.log(id);
moneyGivenInput.forEach((input) => {
  //console.log(input);
  input.onchange = () => {
    if (Number(input.value)) {
      getAllValue();
      changeIcon();
    } else {
      calculator(input);
    }
  };
});

// kalkulator unutar inputa
function calculator(inputEl) {
  // Zbrajanje
  if (inputEl.value.includes("+")) {
    let splited = inputEl.value.split("+");
    let result = Number(splited[0]);
    for (let i = 1; i < splited.length; i++) {
      result += Number(splited[i]);
    }
    if (isNaN(result)) return;
    inputEl.value = result;
  }
  // Oduzimanje
  else if (inputEl.value.includes("-")) {
    let splited = inputEl.value.split("-");
    let result = Number(splited[0]);
    for (let i = 1; i < splited.length; i++) {
      result -= Number(splited[i]);
    }
    if (isNaN(result)) return;
    inputEl.value = result;
  }
  // Množenje
  else if (inputEl.value.includes("*")) {
    let splited = inputEl.value.split("*");
    let result = Number(splited[0]);
    for (let i = 1; i < splited.length; i++) {
      result *= Number(splited[i]);
    }
    if (isNaN(result)) return;
    inputEl.value = result;
  }
  // Dijeljenje
  else if (inputEl.value.includes("/")) {
    let splited = inputEl.value.split("/");
    let result = Number(splited[0]);
    for (let i = 1; i < splited.length; i++) {
      result /= Number(splited[i]);
    }
    if (isNaN(result)) return;
    inputEl.value = result;
  }
  // Nije operacija nijedna
  else {
    console.log("nije za računanje");
    return;
  }
  getAllValue();
  changeIcon();
}

// azuriranje danog novca u bazi podataka
function getAllValue() {
  let given = [];
  let needed = [];
  for (let i = 0; i < moneyGivenInput.length; i++) {
    if (i % 2 == 0) {
      given.push(moneyGivenInput[i].value);
    } else {
      needed.push(moneyGivenInput[i].value);
    }
  }

  let data = {};
  data.given = given;
  data.needed = needed;
  data.id = id;
  fetch("/updateMoney", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json",
    },
  });
}

// mijenjanje ikone s desne strane novca
function changeIcon() {
  for (let i = 0; i < moneyGivenInput.length; i = i + 2) {
    if (
      Number(moneyGivenInput[i].value) >= Number(moneyGivenInput[i + 1].value)
    ) {
      icons[i / 2].src = "/acceptIcon.svg";
    } else {
      icons[i / 2].src = "/declineIcon.svg";
    }
  }
}

function addToLocalMemory() {
  //localStorage.clear();
  let listOfItems = [];
  let localStorageItems = localStorage.getItem("listOfItems");
  if (localStorageItems) {
    if (!localStorageItems.includes(id)) {
      listOfItems = localStorageItems.split(",");
      listOfItems.push(id);
    } else {
      return;
    }
  } else {
    listOfItems[0] = id;
  }
  localStorage.setItem("listOfItems", listOfItems);
  console.log(listOfItems);
}

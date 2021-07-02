const moneyGivenInput = document.querySelectorAll(".moneyGiven");
const title = document.querySelector(".naslov").innerHTML.split(",")[0];
console.log(title);
moneyGivenInput.forEach((input) => {
  console.log(input);
  input.onchange = () => {
    getAllValue();
  };
});

function getAllValue() {
  let given = [];
  moneyGivenInput.forEach((input) => {
    given.push(input.value);
  });
  let data = {};
  data.given = given;
  data.title = title;
  fetch("/updateMoney", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json",
    },
  });
}

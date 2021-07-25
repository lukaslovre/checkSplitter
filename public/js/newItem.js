let memberCounter = 6;

const today = new Date();
document.getElementById("date").value =
  today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();

let memberList = document.querySelectorAll(".customMember");
console.log(memberList[memberList.length - 1]);

memberList[memberList.length - 1].onchange = () => {
  customUser();
};

function customUser() {
  const customName = memberList[memberList.length - 1].value;

  memberList[memberList.length - 2].value = customName;
  memberList[memberList.length - 2].checked = true;
  var str = `<label for="member${memberCounter}">${customName}</label>`;
  memberList[memberList.length - 1].outerHTML = str;
  memberCounter++;

  let newElement = ` <br />
    <input
      type="checkbox"
      name="members"
      id="member${memberCounter}"
      value=""
      class="customMember"
    />
    <input
      type="text"
      class="checkboxTextInput customMember"
    />`;
  document
    .querySelector(".memberInputDiv")
    .insertAdjacentHTML("beforeend", newElement);

  memberList = document.querySelectorAll(".customMember");
  console.log(memberList[memberList.length - 1]);
  memberList[memberList.length - 1].onchange = () => {
    customUser();
  };
}

let allItemsList = document.querySelectorAll(".ListDivItem");
let idListFromMemory = localStorage.getItem("listOfItems");
console.log(idListFromMemory);
if (!idListFromMemory) {
  idListFromMemory = [];
}
allItemsList.forEach((item) => {
  if (!idListFromMemory.includes(item.id)) {
    item.remove();
  }
});

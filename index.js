const foodDiv = document.querySelector(".food");
const url = "http://localhost:1337";
let allFood = [];

init();

function init() {
  getFood();
}

function getFood() {
  fetch(`${url}/fooditems?_sort=Expirationdate:ASC`)
    .then((data) => data.json())
    .then((result) => {
      allFood = result;
      console.log("allFood", allFood);
      renderFood(allFood);
    })
    .catch((err) => {
      console.error("error fetching food", err);
    });
}

function renderFood(food) {
  let list = [];
  food.forEach((f) => {
    const item = `<li>${f.title}</li>`;
    list = [...list, item];
  });
  console.log("list", list);
  foodDiv.innerHTML = `<ul>${list.join("")}</ul>`;
}

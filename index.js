const foodDiv = document.querySelector(".food");
const url = "http://localhost:1337";
let allFood = [];

const addfoodForm = document.forms.addfood;
const foodTitle = addfoodForm.foodtitle;
const expirationDate = addfoodForm.expirationdate;

addfoodForm.addEventListener("submit", addFood);

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

function addFood(e) {
  e.preventDefault();
  console.dir(e.target);
  const title = foodTitle.value.trim();
  const date = expirationDate.value;
  console.log(title, date);
  const payload = {
    title: title,
    expirationdate: date,
    category: "default",
  };

  fetch(`${url}/fooditems`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      console.log(response);
      // empty form
      foodTitle.value = "";
      expirationDate.value = "";
      // retrieve latest food
      getFood();
    })
    .catch((err) => {
      console.error(err);
    });
}

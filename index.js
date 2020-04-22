const foodDiv = document.querySelector(".food");
const url = "http://localhost:1337";
let allFood = [];

const addfoodForm = document.forms.addfood;
const foodTitle = addfoodForm.foodtitle;
const expirationDate = addfoodForm.expirationdate;

addfoodForm.addEventListener("submit", addFood);
let lastAddedItem = null;

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
      if (lastAddedItem !== null) {
        flashLastAddedItem(lastAddedItem);
      }
    })
    .catch((err) => {
      console.error("error fetching food", err);
    });
}

function renderFood(food) {
  let list = [];
  food.forEach((f) => {
    const item = `<li id=${f.id}>${f.title}</li>`;
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
    title,
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
    .then((response) => response.json())
    .then((data) => {
      // empty form
      foodTitle.value = "";
      expirationDate.value = "";
      lastAddedItem = data;
      // retrieve latest food
      getFood();
    })
    .catch((err) => {
      console.error(err);
    });
}

function flashLastAddedItem(item) {
  console.log(item);
  const lastAddedItemElement = document.getElementById(`${item.id}`);
  console.log(item.id, lastAddedItemElement);

  lastAddedItemElement.classList.add("just-added");

  setTimeout(() => {
    lastAddedItemElement.classList.remove("just-added");
    lastAddedItem = null;
  }, 2000);
}

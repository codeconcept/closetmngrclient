const foodDiv = document.querySelector(".food");
const url = "http://localhost:1337";
let allFood = [];

const addfoodForm = document.forms.addfood;
const foodTitle = addfoodForm.foodtitle;
const expirationDate = addfoodForm.expirationdate;

addfoodForm.addEventListener("submit", addFood);
let lastAddedItem = null;

foodDiv.addEventListener("click", deleteFoodItem);

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
    const dateFR = convertInFrenchDateString(f.expirationdate);
    const item = `<li id=${f.id}><button data-id="${f.id}">x</button> ${f.title} à consommer avant le ${dateFR}</li>`;
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

function convertInFrenchDateString(dateString) {
  const dateFragments = dateString.split("-");
  return `${dateFragments[2]}/${dateFragments[1]}/${dateFragments[0]}`;
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

function deleteFoodItem(e) {
  if (e.target.nodeName.toLowerCase() !== "button") {
    return;
  }
  const parentDiv = e.target.parentElement;
  const foodItemId = e.target.parentNode.id;
  fetch(`${url}/fooditems/${foodItemId}`, {
    method: "DELETE",
  }).then((res) => {
    console.log(res.json());
    getFood();
  });
}

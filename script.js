/* eslint-disable no-alert */

/**************
 *   SLICE 1
 **************/

function updateCoffeeView(coffeeQty) {
  const coffeeCounter = document.getElementById("coffee_counter");
  coffeeCounter.innerText = coffeeQty;
}

function clickCoffee(data) {
  data.coffee++;
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

/**************
 *   SLICE 2
 **************/

function unlockProducers(producers, coffeeCount) {
  producers.forEach((producer) => {
    let hasItBeenUnlocked = false;
    if (coffeeCount >= producer.price / 2 && !hasItBeenUnlocked) {
      producer.unlocked = true;
      !hasItBeenUnlocked;
    }
  });
}

function getUnlockedProducers(data) {
  // returns array of producers that are unlocked
  return data.producers.filter((producer) => {
    return producer.unlocked;
  });
}

function makeDisplayNameFromId(id) {
  let titleCaseId = id[0].toUpperCase() + id.slice(1);
  // function passed into .replace -
  // match = the matched substring ie. '_x'
  // return value of function is used to replace the match
  titleCaseId = titleCaseId.replace(/_[a-z]/gi, (match) => {
    return ` ${match[1].toUpperCase()}`;
  });
  return titleCaseId;
}

// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
function makeProducerDiv(producer) {
  const containerDiv = document.createElement("div");
  containerDiv.className = "producer";
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  // let childNodes = [...parent.childNodes];
  // for (let i = 0; i < childNodes.length; i++) {
  //   parent.removeChild(childNodes[i]);
  // }
  while (parent.childNodes.length > 0) {
    parent.removeChild(parent.firstChild);
  }
}

function renderProducers(data) {
  const producerContainer = document.getElementById("producer_container");
  deleteAllChildNodes(producerContainer);
  unlockProducers(data.producers, data.coffee);
  getUnlockedProducers(data).forEach((producer) => {
    producerContainer.appendChild(makeProducerDiv(producer));
  });
}

/**************
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {
  const producer = data.producers.filter(
    (producer) => producer.id === producerId
  );
  return producer[0];
}

function canAffordProducer(data, producerId) {
  const producer = getProducerById(data, producerId);
  if (data.coffee >= producer.price) {
    return true;
  } else return false;
}

function updateCPSView(cps) {
  const coffeePerSec = document.getElementById("cps");
  coffeePerSec.innerText = cps;
}

function updatePrice(oldPrice) {
  return Math.floor(oldPrice * 1.25);
}

function attemptToBuyProducer(data, producerId) {
  if (canAffordProducer(data, producerId)) {
    let producer = getProducerById(data, producerId);
    producer.qty++;
    data.coffee -= producer.price;
    producer.price = updatePrice(producer.price);
    data.totalCPS += producer.cps;
    return true;
  }
  // return canAffordProducer(data, producerId);
  return false;
}

function buyButtonClick(event, data) {
  const target = event.target;
  // gets error "Attempted to wrap alert which is already wrapped"
  //if (event.target.nodeName === "BUTTON") {
  if (target.tagName !== "BUTTON") {
    return;
  }
  if (!attemptToBuyProducer(data, target.id.slice(4))) {
    window.alert("Not enough coffee!");
  } else {
    // update DOM to show info from data
    renderProducers(data);
    updateCoffeeView(data.coffee);
    updateCPSView(data.totalCPS);
  }
}

function tick(data) {
  data.coffee += data.totalCPS;
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

function saveGameState(data) {
  populateStorage(data);
  console.log("saved game data", window.localStorage);
}

function restartGame() {
  //window.localStorage.removeItem('savedGameDataObject')
  window.localStorage.clear();
  //removes all game data from storage
  //data needs to revert back to original window.data values
  console.log("removed game data", window.localStorage);
  location.reload();
}

function populateStorage(data) {
  window.localStorage.setItem("savedGameDataObject", JSON.stringify(data));
  console.log(
    "populating storage with",
    window.localStorage.getItem("savedGameDataObject")
  );
  //setGameData();
}

// function setGameData() {
//   const savedGame = JSON.parse(
//     window.localStorage.getItem("savedGameDataObject")
//   );
//   console.log('saved game data is', savedGame)
//   data = savedGame;
//   updateCoffeeView(data.coffee);
//   updateCPSView(data.totalCPS);
//   console.log("game was updated with parsed saved game data", savedGame);
// }

/*************************
 *  Start your engines!
 *************************/

// You don't need to edit any of the code below
// But it is worth reading so you know what it does!

// So far we've just defined some functions; we haven't actually
// called any of them. Now it's time to get things moving.

// We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.
// How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
// we can see if we're in node by checking to see if `process` exists.
if (typeof process === "undefined") {
  // Get starting data from the window object
  // (This comes from data.js)
  let data = window.data;
  const startingData = JSON.parse(JSON.stringify(window.data));

  if (!window.localStorage.getItem("savedGameDataObject")) {
    populateStorage(startingData);
  } else {
    // setGameData();
    data = JSON.parse(window.localStorage.getItem("savedGameDataObject"));
      //   console.log('saved game data is', savedGame)
      //   data = savedGame;
        updateCoffeeView(data.coffee);
        updateCPSView(data.totalCPS);
      //   console.log("game was updated with parsed saved game data", savedGame);
  }

  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById("big_coffee");
  bigCoffee.addEventListener("click", () => clickCoffee(data));

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById("producer_container");
  producerContainer.addEventListener("click", (event) => {
    buyButtonClick(event, data);
  });

  // Call the tick function passing in the data object once per second
  setInterval(() => tick(data), 1000);

  //save game state every 5 min (300000)
  //save game every 5 sec for now - add button for manual save later
  setInterval(() => saveGameState(data), 5000);

  // const saveBtn = document.getElementById('save');
  // saveBtn.addEventListener('click', () => saveGameState(data));

  // Restart button resets game back to data.js file
  const restartBtn = document.getElementById('restart');
  restartBtn.addEventListener('click', () => restartGame());
}
// Meanwhile, if we aren't in a browser and are instead in node
// we'll need to exports the code written here so we can import and
// Don't worry if it's not clear exactly what's going on here;
// We just need this to run the tests in Mocha.
else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick,
  };
}

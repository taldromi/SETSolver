// Solving the New York Times Set Game - https://www.nytimes.com/puzzles/set

/*
 * A set consists of 3 cards satisfying all of these conditions:
 * 1. They all have the same number or have 3 different numbers.
 * 2. They all have the same symbol or have 3 different symbols.
 * 3. They all have the same shading or have 3 different shadings.
 * 4. They all have the same color or have 3 different colors.
 */

 // Getting the cards data from the DOM
const setBoardCardsRootClassString = "set-board spaced-cards fit-3";
const setBoardCardsClassString = "set-board-card";
const setCardsClassString = "set-card";

const colorMap = new Map(Object.entries({
    "rgb(0, 178, 89)": "green",
    "rgb(73, 47, 146)": "purple",
    "rgb(239, 62, 66)": "red",
    // Colorblind friendly mode colors:
    "#37AFA9": "turquoise",
    "#DF6747": "orange",
    "#FEBC38": "yellow"
}));

const shadingMap = new Map(Object.entries({
    "rgb(0, 178, 89)": "solid",
    "rgb(73, 47, 146)": "solid",
    "rgb(239, 62, 66)": "solid",
    "#37AFA9": "solid",
    "#DF6747": "solid",
    "#FEBC38": "solid",
    "none": "empty",
    "url(#green-stripes)": "striped",
    "url(#purple-stripes)": "striped",
    "url(#red-stripes)": "striped"
}));

const getCardsData = (cardNumbers) => {
    const cardData = [];
    for (let cardNumber = 0; cardNumber < cardNumbers; cardNumber++) {
        let individualCardData = [];
        const rootCardElement = document.getElementsByClassName(setBoardCardsRootClassString)[0]
                                        .getElementsByClassName(setBoardCardsClassString)[cardNumber]
                                        .getElementsByClassName(setCardsClassString)[0]
                                        .getElementsByTagName("svg");
        const quantity = rootCardElement.length;
        const shape = rootCardElement[0].getAttribute("class");
        const shadingRawValue = rootCardElement[0].getElementsByTagName("use")[0].getAttribute("fill");
        const colorRawValue = rootCardElement[0].getElementsByTagName("use")[0].getAttribute("stroke");
        const shading = shadingMap.get(shadingRawValue);
        const color = colorMap.get(colorRawValue);
        individualCardData = [color, shape, shading, quantity.toString()];
        cardData.push(individualCardData.flat());
    }
    return cardData;
};

// Generate random card set
const setCardsNumber = 3;

const generateRandomCardIndex = (cardNumbers) => {
    const cardIndexes = [];
    const indexOfValueNotFound = -1;
    while (cardIndexes.length < setCardsNumber) {
        const randomNumber = Math.floor(Math.random() * cardNumbers);
        if (cardIndexes.indexOf(randomNumber) === indexOfValueNotFound) {
            cardIndexes[cardIndexes.length] = randomNumber;
        }
    }
    return cardIndexes.sort((elementA, elementB) => elementA - elementB);
};

const cardsBeingChecked = new Set();

const generateNewCardIndex = (cardNumbers) => {
    let randomCardIndex = [];
    let newSet = false;
    while (newSet === false) {
        randomCardIndex = generateRandomCardIndex(cardNumbers);
        if (cardsBeingChecked.has(randomCardIndex.toString())) {
            newSet = false;
        } else {
            cardsBeingChecked.add(randomCardIndex.toString());
            newSet = true;
        }
    }
    return randomCardIndex;
};

// Check if the random cards are sets
const compareCardsParameter = (firstCard, secondCard, cardIndexes, cardParameter, cardsData, equality) => {
    if (equality) {
        if (cardsData[cardIndexes[firstCard]][cardParameter] === cardsData[cardIndexes[secondCard]][cardParameter]) {
            return true;
        }
        return false;
    }
    if (!equality) {
        if (cardsData[cardIndexes[firstCard]][cardParameter] !== cardsData[cardIndexes[secondCard]][cardParameter]) {
            return true;
        }
        return false;
    }
};

const cardParametersNumber = 4; // Color, Number, Pattern & Shape
const setFinder = (cardIndexes, cardsData) => {
    for (let cardParameter = 0; cardParameter < cardParametersNumber; cardParameter++) {
        const cardArguments = [cardIndexes, cardParameter, cardsData];
        if ((compareCardsParameter(0, 1, ...cardArguments, true) &&
            compareCardsParameter(1, 2, ...cardArguments, true)) ||
            (compareCardsParameter(0, 1, ...cardArguments, false) &&
            compareCardsParameter(1, 2, ...cardArguments, false) &&
            compareCardsParameter(0, 2, ...cardArguments, false))) {
            if (cardParameter === setCardsNumber)
                return true;
        } else {
            return;
        }
    }
}

// 'Click' on the screen the right set combination
const clickSetMatches = (cardIndexes) => {
    for (const cardIndex of Object.keys(cardIndexes)) {
        document.getElementsByClassName(setBoardCardsRootClassString)[0]
                .getElementsByClassName(setBoardCardsClassString)[cardIndexes[cardIndex]]
                .getElementsByClassName(setCardsClassString)[0].click();
    }
};

toStartCase = (txt) => txt.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });

// The main function - triggered by the Solve button being pressed
const setSolver = (matches, cardNumbers, cardsData) => {
    let matchCounter = 0;
    while (matches !== matchCounter) {
        const cardIndexes = generateNewCardIndex(cardNumbers);
        if (setFinder(cardIndexes, cardsData)) {
            matchCounter += 1;
            clickSetMatches(cardIndexes);

            console.info(`SET Nº ${matchCounter} 🤹🎰:`);
            const setCardsData = cardIndexes.map((cardIndex) => cardsData[cardIndex]);
            for (const cardIndex of Object.keys(cardIndexes)) {
                const cardLocation = Number(cardIndex) + 1;
                const cardColor = `Color: ${setCardsData[cardIndex][0]}`;
                const cardShading = `Shading: ${setCardsData[cardIndex][1]}`;
                const cardShape = `Shape: ${setCardsData[cardIndex][2]}`;
                const cardQuantity = `Quantity: ${setCardsData[cardIndex][3]}`;
                const cardTemplate = `${toStartCase(cardColor)}, ${toStartCase(cardShading)}, ${toStartCase(cardQuantity)}, ${toStartCase(cardShape)}`;
                console.info(` > Card Nº ${cardLocation} - ${cardTemplate}`);
            }
        }
    }
    console.info(`Tried ${cardsBeingChecked.size} different sets combinations! 🎲`);
};

// Adding the Solve button
const addSolverButton = () => {
    const setGameDate = document.getElementsByClassName("pz-row")[1];
    const solverButton = document.createElement("span");
    solverButton.setAttribute("class", "pz-toolbar-button pz-toolbar-button__help");
    solverButton.innerHTML = "Solve";
    setGameDate.appendChild(solverButton); // button will be to the right of "How to Play" button

    solverButton.addEventListener("click", () => {
        cardsBeingChecked.clear();
        const gameDifficulty = document.getElementsByClassName("pz-toolbar-button active")[0].getElementsByTagName("span")[0].getAttribute("data-short");
        // Basic Deck: 9 Cards, 4 Sets | Advanced Deck: 12 Cards, 6 Sets
        const cardNumbers = (gameDifficulty === "B1" || gameDifficulty === "B2") ? 9
                          : (gameDifficulty === "A1" || gameDifficulty === "A2") ? 12
                          : undefined;
        const setMatches = (cardNumbers === 9) ? 4
                         : (cardNumbers === 12) ? 6
                         : undefined;
        if (setMatches && cardNumbers) {
            setSolver(setMatches, cardNumbers, getCardsData(cardNumbers));
        } else {
            console.warn(`${setMatches} is unfamiliar number of cards 😵`);
        }
    });
};

// Waits for all the elements to be loaded
const checkNextFrame = () => new Promise((resolve) => {
    requestAnimationFrame(resolve);
});

const checkElementExist = async () => {
    while (window.gameData === null) {
        await checkNextFrame();
    }
    return true;
};

document.onreadystatechange = () => {
    if (document.readyState === "complete") {
        checkElementExist()
            .then(() => {
                addSolverButton();
            });
    }
};

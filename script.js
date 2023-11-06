const post = document.querySelector("#post");
const btnRedact = document.querySelector(".redactr_btn");
const selectedVal = [...document.querySelectorAll(".select")];
const scrambleInput = document.querySelector("#scramble_input");
const statsCont = document.querySelector(".stats_container");
const postedCommentContainer = document.querySelector(".div");
let postArr = [];

// craete a global opbject containing the index of the found array to be edited also the object will contain the flag edit and will be set to true if the edit button has been clicked

const editState = {
  currentIndex: null,
  edit: false,
};

// funtion to replace scrambled words
function Rreplace(
  sentence,
  wordsToReplace,
  selection = "*",
  selectSpan = "span-2"
) {
  const regexString = wordsToReplace; // Example regex string
  const flags = "gi"; // Flags for global and case-insensitive matching

  const regEx = new RegExp(regexString, flags);

  let wordMatch = [];
  let count = 0;
  let replacedSentence = sentence.replace(regEx, function (match) {
    count = count + 1;
    wordMatch.push(match);
    return selection.repeat(match.length);
  });
  const characters = Array.from(new Set(wordMatch.join("")));
  const char = characters.join(",");

  return {
    scrambled: replacedSentence,
    wordScanned: sentence.split(" ").length,
    matchs: count,
    scrambledChar: char,
    length: characters.length,
    actualSentence: sentence,
    selectSpanId: selectSpan,
  };
}

let select;
let selctedSpanId;
function getSelectedStyle(id) {
  selectedVal.forEach((element) => {
    if (id === element.dataset.id) {
      selctedSpanId = element.dataset.id;
      select = element.textContent;
      element.classList.add("add");
    } else {
      element.classList.remove("add");
    }
  });
}

statsCont.addEventListener("click", function (e) {
  const id = e.target.dataset.id;
  getSelectedStyle(id);
});

// funtion to display the content

function displayPost(arr) {
  const elm = arr
    .map((element) => {
      return `   <section class="section">
        <div class="input-container">
          <div class="stats">
            <span>Word scanned: ${element.wordScanned}</span>
            <span>Matches: ${element.matchs}</span>
            <span>Scrambled Characters: ${element.scrambledChar}</span>
            <span>ScramblingTime:  ${element.execution}</span>
            <span>Total Charracters Scrambled:  ${element.length}</span>
        
          </div>
          <p>
       ${element.scrambled}
          </p>
             <div class="btn-container">

              <button class="edit-btn" data-id=${element.id}>edit</button>
          </div>
      </section>`;
    })
    .join("");

  postedCommentContainer.innerHTML = elm;
}

function handleRegex(word, wordWithoutSpace) {
  if (
    !Boolean(Boolean(word.split(" ").join("")) && Boolean(wordWithoutSpace))
  ) {
    alert("please enter a word");
    return;
  }
  const scramble = wordWithoutSpace.split(",");
  let u = "";
  for (let i = 0; i < scramble.length; i++) {
    if (i === scramble.length - 1) {
      u = u + scramble[i] + "?";
    } else {
      u = u + scramble[i] + "?|";
    }
  }

  const regEx = `\\b(${u})\\b`;
  const start = performance.now();
  const show = Rreplace(word, regEx, select, selctedSpanId);
  const end = performance.now();

  const executionTime = end - start;

  const newWord = {
    ...show,

    execution: `${executionTime.toFixed(2)} milliseconds`,
  };

  return newWord;
}

btnRedact.addEventListener("click", () => {
  const word = post.value;
  const wordWithoutSpace = scrambleInput.value.split(" ").join(",");

  const newWord = handleRegex(word, wordWithoutSpace);

  if (!newWord) return;

  const adWord = {
    ...newWord,
    actualWordScanned: scrambleInput.value,
    id: editState.edit ? editState.currentIndex : postArr.length + 1,
  };
  //  if edit is false just push in to the next index meaning that u are creating a redactr
  // sendly call the handleRegex function first
  // but if edit is true then u need to run a loop first keep push the objects in the aaray to the next index until you get to the
  // you get to the current index then push that edited object to that very index were it belongs

  if (editState.edit) {
    postArr[editState.currentIndex] = adWord;

    displayPost(postArr);
    editState.currentIndex = null;
    editState.edit = false;
  } else {
    postArr = [...postArr, adWord];
    displayPost(postArr);
  }
  (post.value = ""), (scrambleInput.value = "");
});

postedCommentContainer.addEventListener("click", function (e) {
  const { id } = e.target.dataset;

  if (!id) {
    return;
  }

  const numberId = Number(id);
  const editableArray = postArr.find((post) => post.id === numberId);
  const editableArrayIndex = postArr.findIndex((post) => post.id === numberId);
  const displayedPost = postArr.filter((post) => post.id !== numberId);

  editState.currentIndex = editableArrayIndex;
  editState.edit = true;
  post.value = editableArray.actualSentence;
  scrambleInput.value = editableArray.actualWordScanned;
  getSelectedStyle(editableArray.selectSpanId);
  displayPost(displayedPost);
});

const post = document.querySelector("#post");
const btnRedact = document.querySelector(".redactr_btn");
const selectedVal = [...document.querySelectorAll(".select")];
const scrambleInput = document.querySelector("#scramble_input");
const statsCont = document.querySelector(".stats_container");
const postedCommentContainer = document.querySelector(".div");
let postArr = [];

// funtion to replace scrambled words
function Rreplace(sentence, wordsToReplace, selection = "*") {
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
  const  char  = characters.join(",")

  return {
    scrambled: replacedSentence,
    wordScanned: sentence.split(" ").length,
    matchs: count,
    scrambledChar:char,
    length: characters.length
    
  };
}

let select;
statsCont.addEventListener("click", function (e) {
  const id = e.target.dataset.id;
  selectedVal.forEach((element) => {
    if (id === element.dataset.id) {
      select = element.textContent;
      element.classList.add("add");
    } else {
      element.classList.remove("add");
    }
  });
});
// funtion to display the content

function displayPost(arr) {

    const elm = arr.map((element)=>{
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
      </section>`;
    }).join("")

  postedCommentContainer.innerHTML = elm  

    
}


btnRedact.addEventListener("click", () => {
    const word = post.value;
    if( !Boolean(Boolean(word.split(" ").join("")) && Boolean(scrambleInput.value.split(" ").join("")))){
return alert("please enter a word")
    }
const wordWithoutSpace = scrambleInput.value.split(" ").join("")

  const scramble = wordWithoutSpace.split(",")
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
  const show = Rreplace(word, regEx, select);
  const end = performance.now();

  const executionTime = end - start;

  const newWord = {
    ...show,
    id: postArr.length + 1,
    execution: `${executionTime.toFixed(2)} milliseconds`,
  };

  postArr = [...postArr, newWord];

  displayPost(postArr)

});

// manage the status bar
const numOfQuestionContainer =
  document.querySelector(".num-of-question").children[0];
const numOfQuestionsContainer =
  document.querySelector(".num-of-question").children[1];
const categoryContainer = document.querySelector(".category").children[0];
const numOfWrongsContainer =
  document.querySelector(".num-of-wrongs").children[0];
const statusBar = document.querySelector(".status");

// manage the questions area
const questionContainer = document.querySelector(".question");
const choisesContainer = document.querySelector(".choises");
const bullets = document.querySelector(".bullets");
const moreQuestionsBtn = document.querySelector(".message button");
const minutsContainer = document.querySelector(".timer").children[0];
const secondsContainer = document.querySelector(".timer").children[1];

// importing questions form json file
const data = fetch("./questions.json")
  .then((res) => res.json())
  .then((data) => {
    const arrOfQuestions = data;
    const numOfQuestions = arrOfQuestions.length;
    let numOfQuestion = localStorage.getItem("numOfQuestion");
    let numOfWrongs = localStorage.getItem("numOfWrongs");
    let numOfCorrects = localStorage.getItem("numOfCorrects");
    let notAnswerd =
      numOfQuestions - (JSON.parse(numOfCorrects) + JSON.parse(numOfWrongs));

    // create countdown timer
    let minute = 0;
    let second = 15;
    const timer = setInterval(() => {
      if (minute === 0 && second === 0) {
        if (numOfQuestion < numOfQuestions) {
          clearInterval(timer);
          numOfQuestion++;
          localStorage.setItem("numOfQuestion", numOfQuestion);
          location.reload();
        }
      }
      if (second === 0) {
        minute--;
        second = 59;
      }
      second--;
      minutsContainer.innerHTML = minute;
      secondsContainer.innerHTML = second;
    }, 1000);
    if (JSON.parse(numOfQuestion) === numOfQuestions) {
      clearInterval(timer);
    }

    // handle the message in the end of questions
    if (JSON.parse(numOfQuestion) >= numOfQuestions) {
      document.querySelector(
        ".count"
      ).innerHTML = `questions count: ${numOfQuestions}`;
      document.querySelector(
        ".correct"
      ).innerHTML = `correct answers: ${numOfCorrects}`;
      document.querySelector(
        ".wrong"
      ).innerHTML = ` Wrong answers: ${numOfWrongs}`;
      document.querySelector(
        ".not-answerd"
      ).innerHTML = ` Not answerd: ${notAnswerd}`;
      moreQuestionsBtn.style.display = "block";
      statusBar.classList.add("hidden");
      questionContainer.classList.add("hidden");
      choisesContainer.classList.add("hidden");
      bullets.classList.add("hidden");
    }
    // reset the questions and wrongs
    moreQuestionsBtn.addEventListener("click", () => {
      localStorage.setItem("numOfQuestion", 0);
      localStorage.setItem("numOfWrongs", 0);
      localStorage.setItem("numOfCorrects", 0);
      location.reload();
    });

    // handle the status bar info
    if (numOfQuestion < numOfQuestions) {
      numOfWrongsContainer.innerHTML = numOfWrongs;
      numOfQuestionContainer.innerHTML = JSON.parse(numOfQuestion) + 1;
      numOfQuestionsContainer.innerHTML = numOfQuestions;
      const category = arrOfQuestions[numOfQuestion].category;
      categoryContainer.innerHTML = category;
    }

    //handle the choises of question
    if (numOfQuestion < numOfQuestions) {
      for (let i = 0; i < arrOfQuestions[numOfQuestion].choises.length; i++) {
        const choiseContainer = document.createElement("li");
        const choise = arrOfQuestions[numOfQuestion].choises[i];
        choiseContainer.append(choise);
        choisesContainer.appendChild(choiseContainer);
      }
    }

    // handle the question
    if (numOfQuestion < numOfQuestions) {
      const question = arrOfQuestions[numOfQuestion].question;
      const answer = arrOfQuestions[numOfQuestion].answer;
      questionContainer.append(question);
      const choises = document.querySelectorAll(".choises li");
      choises.forEach((choise) => {
        choise.addEventListener("click", (e) => {
          if (e.target.innerHTML === answer) {
            numOfCorrects++;
            localStorage.setItem("numOfCorrects", numOfCorrects);
          } else {
            numOfWrongs++;
            localStorage.setItem("numOfWrongs", numOfWrongs);
          }
          numOfQuestion++;
          localStorage.setItem("numOfQuestion", numOfQuestion);
          location.reload();
        });
      });
    }

    // show the bullets as a number of questions
    for (let i = 0; i < numOfQuestions; i++) {
      const bullet = document.createElement("li");
      bullet.id = `${i}`;
      bullets.appendChild(bullet);
    }

    // handle active bullet
    let allBullets = document.querySelectorAll(".bullets li");
    allBullets.forEach((li) => {
      if (li.id === numOfQuestion.toString()) {
        li.classList.add("active");
      } else {
        li.classList.remove("active");
      }
    });
  });

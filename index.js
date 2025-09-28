// Quiz Data
const quizData = [
  { question: "What does NPS stand for?", options: ["National Payment System","National Pension Scheme","New Pension Saving","National Public Security"], answer: 1 },
  { question: "Who regulates the NPS in India?", options: ["SEBI","RBI","PFRDA","IRDAI"], answer: 2 },
  { question: "What is the minimum age to join NPS?", options: ["18 years","21 years","25 years","30 years"], answer: 0 },
  { question: "Maximum age limit for NPS entry?", options: ["55 years","60 years","65 years","70 years"], answer: 3 },
  { question: "Which account type is mandatory?", options: ["Tier I","Tier II","Both","None"], answer: 0 },
  { question: "Can NRIs invest in NPS?", options: ["Yes","No","Only with RBI approval","Only government employees"], answer: 0 },
  { question: "What is the lock-in period for NPS Tier I?", options: ["5 years","10 years","Till retirement","15 years"], answer: 2 },
  { question: "Which of these is a benefit of NPS?", options: ["Guaranteed returns","Tax benefits under Section 80C and 80CCD","Free insurance","Loan facility"], answer: 1 },
  { question: "Percentage of NPS corpus withdrawable as lump sum?", options: ["20%","40%","60%","100%"], answer: 2 },
  { question: "Investment choices in NPS?", options: ["Equity, Corporate Bonds, Government Securities","Gold, Real Estate, FD","Crypto, Forex, Equity","PPF, FD, NSC"], answer: 0 }
];

let currentQ = 0;
let correct = 0;
let wrong = 0;

// Track correctly answered questions
let correctQuestions = JSON.parse(localStorage.getItem("correctQuestions")) || [];

// Load past results
function loadPastResults(){
  const past = JSON.parse(localStorage.getItem("npsResults")) || [];
  const container = document.getElementById("past-game-data");
  if(past.length === 0){
    container.textContent = "No past game data yet.";
    return;
  }

  container.innerHTML = "<h3>Past Game Data</h3>";
  const list = document.createElement("ul");
  past.forEach((game, i)=>{
    const li = document.createElement("li");
    li.textContent = `Game ${i+1}: Total ${game.total}, Right ${game.correct}, Wrong ${game.wrong}`;
    list.appendChild(li);
  });
  container.appendChild(list);
}

// Start quiz
document.getElementById("playbtn").addEventListener("click", function(){
  currentQ = 0;
  correct = 0;
  wrong = 0;

  // Filter unanswered questions
  const unanswered = quizData.filter((q, i)=> !correctQuestions.includes(i));

  if(unanswered.length === 0){
    showAlreadyCompletedPopup();
  } else {
    showQuestion(unanswered);
  }
});

// Show question
function showQuestion(unanswered){
  const q = unanswered[currentQ];
  const quizBox = document.createElement("div");
  quizBox.id = "quizBox";
  Object.assign(quizBox.style, {
    position: "fixed",
    top: "0", left: "0",
    width: "100%", height: "100%",
    background: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    zIndex: "999",
    textAlign: "center",
    padding: "20px"
  });

  quizBox.innerHTML = `
    <h2>${q.question}</h2>
    <div id="options"></div>
    <p id="msg" style="margin-top:15px;font-weight:bold;"></p>
    <div style="margin-top:20px;">
      <button id="nextBtn" style="display:none;margin-right:10px;padding:10px 20px;font-size:16px;">Next</button>
      <button id="backBtn" style="padding:10px 20px;font-size:16px;">Back</button>
    </div>
  `;

  document.body.appendChild(quizBox);

  const optionsDiv = quizBox.querySelector("#options");
  q.options.forEach((opt, index)=>{
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.style.display = "block";
    btn.style.margin = "5px";
    btn.style.padding = "10px 15px";
    btn.style.fontSize = "16px";
    btn.addEventListener("click", ()=> checkAnswer(index, q.answer, unanswered));
    optionsDiv.appendChild(btn);
  });

  // Next button
  document.getElementById("nextBtn").addEventListener("click", ()=>{
    document.body.removeChild(quizBox);
    currentQ++;
    if(currentQ < unanswered.length){
      showQuestion(unanswered);
    } else {
      endQuiz(unanswered.length);
    }
  });

  // Back button
  document.getElementById("backBtn").addEventListener("click", ()=>{
    // Save current progress before leaving
    const totalAttempted = currentQ + 1; // questions seen so far
    const result = { total: totalAttempted, correct, wrong };
    let past = JSON.parse(localStorage.getItem("npsResults")) || [];
    past.push(result);
    localStorage.setItem("npsResults", JSON.stringify(past));

    // Remove quiz box
    document.body.removeChild(quizBox);

    // Reload past results and go "home"
    loadPastResults();
  });
}

// Check answer
function checkAnswer(selected, correctIndex, unanswered){
  const msg = document.getElementById("msg");
  if(selected === correctIndex){
    msg.textContent = "✅ Correct!";
    msg.style.color = "green";
    correct++;
    const realIndex = quizData.indexOf(unanswered[currentQ]);
    if(!correctQuestions.includes(realIndex)){
      correctQuestions.push(realIndex);
      localStorage.setItem("correctQuestions", JSON.stringify(correctQuestions));
    }
  } else {
    msg.textContent = "❌ Wrong! Correct Answer: " + unanswered[currentQ].options[correctIndex];
    msg.style.color = "red";
    wrong++;
  }
  document.querySelectorAll("#options button").forEach(btn => btn.disabled = true);
  document.getElementById("nextBtn").style.display = "block";
}

// End quiz
function endQuiz(total){
  const result = { total, correct, wrong };
  let past = JSON.parse(localStorage.getItem("npsResults")) || [];
  past.push(result);
  localStorage.setItem("npsResults", JSON.stringify(past));

  alert(`Game Over!\nTotal: ${total}, Right: ${correct}, Wrong: ${wrong}`);
  loadPastResults();
}

// Already completed popup
function showAlreadyCompletedPopup(){
  const popup = document.createElement("div");
  Object.assign(popup.style, {
    position: "fixed",
    bottom: "80px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "280px",
    background: "#B6D1FF",
    color: "#000",
    borderRadius: "15px",
    padding: "15px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
    zIndex: "100",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
    animation: "fadeIn 0.5s"
  });

  popup.innerHTML = `
    <h3 style="margin-bottom:10px;">🎉 All Questions Answered!</h3>
    <p style="font-size:14px;margin-bottom:10px;">You have already answered all questions correctly. Restart to play again.</p>
    <button id="restartBtn" style="
      padding:8px 15px;
      font-size:14px;
      font-weight:bold;
      border:none;
      border-radius:10px;
      background:#63D900;
      color:#fff;
      cursor:pointer;
    ">Restart New Game</button>
  `;

  document.body.appendChild(popup);

  document.getElementById("restartBtn").addEventListener("click", ()=>{
    localStorage.removeItem("correctQuestions");
    correctQuestions = [];
    document.body.removeChild(popup);
    document.getElementById("playbtn").click(); // Start new game
  });
}

// Menu functionality
const menuBtn = document.getElementById("menuBtn");
const gameMenu = document.getElementById("gameMenu");

menuBtn.addEventListener("click", () => {
    gameMenu.style.display = (gameMenu.style.display === "block") ? "none" : "block";
});

document.addEventListener("click", (e) => {
    if(!gameMenu.contains(e.target) && e.target !== menuBtn){
        gameMenu.style.display = "none";
    }
});

// Menu options
document.getElementById("refreshPage").addEventListener("click", ()=> location.reload());
document.getElementById("aboutUs").addEventListener("click", ()=> alert("About Us: This quiz is developed to improve financial literacy about NPS."));
document.getElementById("contactUs").addEventListener("click", ()=> window.location.href = "mailto:amankrgupta1219@gmail.com");
document.getElementById("followUs").addEventListener("click", ()=> window.open("https://www.instagram.com/aman_kr_7799", "_blank"));
document.getElementById("aboutNPS").addEventListener("click", ()=> alert("The National Pension Scheme (NPS) is a government-sponsored pension scheme to secure your retirement."));
document.getElementById("pfrdaOfficial").addEventListener("click", ()=> window.open("https://twitter.com/PFRDAOfficial", "_blank"));

// Clear all quiz data
document.getElementById("clearData").addEventListener("click", ()=>{
    if(confirm("Are you sure you want to clear all quiz data? This cannot be undone.")){
        localStorage.removeItem("correctQuestions");
        localStorage.removeItem("npsResults");
        alert("All quiz data has been cleared!");
        location.reload(); 
    }
});

// Load past results on page load
window.onload = loadPastResults;
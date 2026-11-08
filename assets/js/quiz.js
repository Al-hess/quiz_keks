// Personnalise les questions et les messages de cette présentation.
const questions = [
  "Salut et bienvenue au quiz ! Oui j'ai fait ça à la place de travailler :). Réponds aux questions librement :)",
  "D'abord, je dois m'assurer que tu sois bien Kelia... Réponds correctement aux questions suivantes et on pourra continuer !",
  "Quel est un autre mot pour décrire un temps nuageux ?",
  "De quoi Alessandro se rappellera-t-il le plus ?",
  "La nuit, tu pourrais avoir peur de..."
];

const answerChoices = {
  2: [
    { text: "Maghrébin", correct: true },
    { text: "Moche", correct: false },
    { text: "Venteux", correct: false },
    { text: "Pluvieux", correct: false }
  ],
  3: [
    { text: "Les statistiques de dribble de Mbappé TOTY sur FIFA 21", correct: true },
    { text: "La date d'anniversaire de Benley", correct: false },
    { text: "Les jours où j'ai la physio", correct: false },
    { text: "Où partent en vacances les mecs de l'armée", correct: false }

  ],
  4: [
    { text: "Des noirs", correct: true },
    { text: "Du noir", correct: false },
    { text: "Des araignées", correct: false },
    { text: "Des cauchemars", correct: false }
  ]
};

const replies = [
  null,
  {
    yes: "Siuuuu parti !",
    no: "Comment ça non ?!"
  },
  {
    yes: "Première question !",
    no: "M'en fou"
  },
  {
    yes: "Bien joué !",
    no: "Essaie de nouveau !"
  },
  {
    yes: "Exactement !",
    no: "Essaie de nouveau !"
  }
];

const dateSteps = [
  {
    title: "Qu’est-ce qui te ferait plaisir à manger ?",
    options: ["Ramen avec shashu", "Burger avec patates", "Quantité impressionante de sushis", "Pates au choix"]
  },
  {
    title: "Qu’est-ce qu’on pourrait faire ensemble ?",
    options: ["Aller jouer au foot", "Aller au jumppark", "Dessiner ou peindre", "Autres"]
  },
  {
    title: "Selectionne l'après repas :",
    options: ["Film cosy", "Massage ++", "Manger un brownie sur tes fesses", "Tous les trois"]
  }
];

const app = document.getElementById('app');
let questionIndex = 0;
let previousAnswer = null;
let datePlan = [];

function createSlide() {
  const slide = document.createElement('div');
  slide.className = 'slide';
  app.replaceChildren(slide);
  return slide;
}

function addProgress(slide, index) {
  const progress = document.createElement('p');
  progress.className = 'progress';
  progress.textContent = `${index + 1} sur ${questions.length}`;
  slide.appendChild(progress);
}

function renderWelcome() {
  const slide = createSlide();
  slide.innerHTML = `
    <div class="heart" aria-hidden="true">♥</div>
    <p class="eyebrow">Salut keliaaa bienvenue au premier organisateur de date ! </p>
    <h1>Siuuuu hihi</h1>
    <p>J'ai quelques questions très importantes à te poser.</p>
    <button id="startBtn" class="btn primary">C'est parti</button>`;
  document.getElementById('startBtn').addEventListener('click', () => {
    questionIndex = 0;
    previousAnswer = null;
    datePlan = [];
    renderQuestion();
  });
}

function renderQuestion(retryMessage = '') {
  const slide = createSlide();
  if (retryMessage) {
    const retry = document.createElement('p');
    retry.className = 'reply-message';
    retry.textContent = retryMessage;
    slide.appendChild(retry);
  }

  if (!retryMessage && questionIndex > 0 && previousAnswer) {
    const reply = document.createElement('p');
    reply.className = 'reply-message';
    reply.textContent = replies[questionIndex][previousAnswer];
    slide.appendChild(reply);
  }

  const heading = document.createElement('h1');
  heading.textContent = questions[questionIndex];
  slide.appendChild(heading);
  addProgress(slide, questionIndex);

  const answers = document.createElement('div');
  const choices = answerChoices[questionIndex] || [
    { text: 'Oui', value: 'yes' },
    { text: 'Non', value: 'no' }
  ];
  answers.className = answerChoices[questionIndex] ? 'answers multiple-choice' : 'answers';
  choices.forEach(({ text, value, correct }) => {
    const button = document.createElement('button');
    button.className = `answer btn ${answerChoices[questionIndex] ? 'choice' : value}`;
    button.textContent = text;
    button.addEventListener('click', () => {
      answers.querySelectorAll('button').forEach((answerButton) => {
        answerButton.disabled = true;
      });
      button.classList.add('selected');
      setTimeout(() => {
        if (answerChoices[questionIndex] && !correct) {
          renderQuestion('Essaie de nouveau !');
          return;
        }

        const answer = answerChoices[questionIndex] ? 'yes' : value;
        previousAnswer = answer;
        if (questionIndex === questions.length - 1) {
          renderInvitation();
        } else {
          questionIndex += 1;
          renderQuestion();
        }
      }, 350);
    });
    answers.appendChild(button);
  });
  slide.appendChild(answers);
}

function renderInvitation() {
  const slide = createSlide();
  slide.innerHTML = `
    <div class="heart" aria-hidden="true">♥</div>
    <p class="eyebrow">Cooool c'est vraiment toi !</p>
    <h1>Veux-tu sortir avec moi ?</h1>
    <div class="answers">
      <button class="answer btn yes magnetic-yes" data-answer="yes">Oui</button>
      <button class="answer btn no" data-answer="no">Non</button>
    </div>`;
  slide.querySelectorAll('[data-answer]').forEach((button) => {
    button.addEventListener('click', () => {
      removeMagnetListeners();
      renderDateInvitation();
    });
  });

  const yesButton = slide.querySelector('.magnetic-yes');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const initialBounds = yesButton.getBoundingClientRect();
  const handlePointerMove = (event) => {
    if (event.pointerType !== 'mouse' || reduceMotion.matches) return;

    const bounds = yesButton.getBoundingClientRect();
    const deltaX = bounds.left + bounds.width / 2 - event.clientX;
    const deltaY = bounds.top + bounds.height / 2 - event.clientY;
    const distance = Math.hypot(deltaX, deltaY);
    const radius = 700;

    if (distance < radius && distance > 0) {
      const directionX = deltaX / distance;
      const directionY = deltaY / distance;
      const margin = 12;
      let maxDistance = Infinity;

      if (directionX > 0) {
        maxDistance = Math.min(maxDistance, (window.innerWidth - margin - initialBounds.right) / directionX);
      } else if (directionX < 0) {
        maxDistance = Math.min(maxDistance, (margin - initialBounds.left) / directionX);
      }

      if (directionY > 0) {
        maxDistance = Math.min(maxDistance, (window.innerHeight - margin - initialBounds.bottom) / directionY);
      } else if (directionY < 0) {
        maxDistance = Math.min(maxDistance, (margin - initialBounds.top) / directionY);
      }

      const strength = ((radius - distance) / radius) * maxDistance;
      yesButton.style.setProperty('--magnet-x', `${directionX * strength}px`);
      yesButton.style.setProperty('--magnet-y', `${directionY * strength}px`);
      return;
    }

    resetYesButtonPosition();
  };
  const resetYesButtonPosition = () => {
    yesButton.style.setProperty('--magnet-x', '0px');
    yesButton.style.setProperty('--magnet-y', '0px');
  };
  const handlePointerOut = (event) => {
    if (event.relatedTarget === null) {
      resetYesButtonPosition();
    }
  };
  const removeMagnetListeners = () => {
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerout', handlePointerOut);
  };

  window.addEventListener('pointermove', handlePointerMove);
  window.addEventListener('pointerout', handlePointerOut);
}

function renderDateInvitation() {
  const slide = createSlide();
  slide.innerHTML = `
    <div class="heart" aria-hidden="true">♥</div>
    <p class="eyebrow">Petite blague !</p>
    <h1>Vraiment cette fois : veux-tu sortir avec moi ?</h1>
    <div class="answers">
      <button class="answer btn yes" data-answer="yes">Oui</button>
      <button class="answer btn no" data-answer="no">Non</button>
    </div>`;
  slide.querySelectorAll('[data-answer]').forEach((button) => {
    button.addEventListener('click', () => {
      if (button.dataset.answer === 'yes') {
        datePlan = [];
        renderDateStep(0);
      } else {
        showFinal('no');
      }
    });
  });
}

function renderDateStep(stepIndex) {
  const step = dateSteps[stepIndex];
  const slide = createSlide();
  const eyebrow = document.createElement('p');
  eyebrow.className = 'eyebrow';
  eyebrow.textContent = 'Préparons notre date';
  slide.appendChild(eyebrow);

  const heading = document.createElement('h1');
  heading.textContent = step.title;
  slide.appendChild(heading);

  const progress = document.createElement('p');
  progress.className = 'progress';
  progress.textContent = `${stepIndex + 1} sur ${dateSteps.length}`;
  slide.appendChild(progress);

  const answers = document.createElement('div');
  answers.className = 'answers multiple-choice date-options';
  step.options.forEach((option) => {
    const button = document.createElement('button');
    button.className = 'answer btn choice';
    button.textContent = option;
    button.addEventListener('click', () => {
      datePlan[stepIndex] = option;
      if (stepIndex === dateSteps.length - 1) {
        showFinal('yes');
      } else {
        renderDateStep(stepIndex + 1);
      }
    });
    answers.appendChild(button);
  });
  slide.appendChild(answers);
}

function showFinal(answer) {
  const slide = createSlide();
  slide.innerHTML = `
    <div class="heart" aria-hidden="true">${answer === 'yes' ? '♥' : '♡'}</div>
    <p class="eyebrow">${answer === 'yes' ? 'Ça me fait plaisir' : 'Aucun souci'}</p>
    <h1>${answer === 'yes' ? 'Ce sera fait !' : 'Abuse'}</h1>
    <p>${answer === 'yes'
      ? 'J’ai déjà hâte :))'
      : 'Aucune pression. J’espère que ce petit quiz t’aura fait sourire.'}</p>
    <div class="final-message">
      <strong>${answer === 'yes' ? 'Voilà le programme que tu as choisi :' : 'Peut-être une autre fois ?'}</strong>
    </div>
    <button id="restartBtn" class="btn secondary">Recommencer</button>`;
  if (answer === 'yes') {
    const summary = document.createElement('ul');
    summary.className = 'date-summary';
    dateSteps.forEach((step, index) => {
      const item = document.createElement('li');
      item.textContent = `${step.title} ${datePlan[index]}`;
      summary.appendChild(item);
    });
    slide.querySelector('.final-message').appendChild(summary);
  }

  document.getElementById('restartBtn').addEventListener('click', () => {
    questionIndex = 0;
    previousAnswer = null;
    datePlan = [];
    renderWelcome();
  });
}

renderWelcome();

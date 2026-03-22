const fs = require("fs");
const path = require("path");

const subjectsSingular = [
  "She", "He", "John", "Mary", "The teacher", "My boss", "The manager", "The CEO", "Tom", "Alice",
  "The dog", "The cat", "My mother", "His father", "Our neighbor", "The president", "A student", "Someone", "Nobody", "Everyone"
];

const subjectsPlural = [
  "They", "We", "My friends", "The students", "The workers", "Our neighbors", "The players", "People", "My parents", "The dogs"
];

const timeExpressionsPast = [
  "yesterday", "last week", "a few days ago", "in 1999", "when I was young", "last night"
];

const timeExpressionsFuture = [
  "tomorrow", "next week", "by next year", "in the future", "soon", "later"
];

const templates = [
  // 1. Conditional Type 1
  (sS, sP, tP, tF) => ({
    q: `If ${sS} ___ hard, ${sS.toLowerCase()} will pass the exam.`,
    options: ["study", "studies", "will study", "studied"],
    answer: 1
  }),
  // 2. Conditional Type 2
  (sS, sP, tP, tF) => ({
    q: `If ${sP} ___ enough money, they would travel the world.`,
    options: ["having", "have", "would have", "had"],
    answer: 3
  }),
  // 3. Conditional Type 3
  (sS, sP, tP, tF) => ({
    q: `If ${sS} had known about the traffic, ${sS.toLowerCase()} ___ earlier.`,
    options: ["would left", "would leave", "would have left", "had left"],
    answer: 2
  }),
  // 4. Future Perfect
  (sS, sP, tP, tF) => ({
    q: `By this time ${tF}, ${sS} ___ the project.`,
    options: ["will finish", "finishes", "is going to finish", "will have finished"],
    answer: 3
  }),
  // 5. Present Perfect
  (sS, sP, tP, tF) => ({
    q: `${sS} ___ to Paris three times so far.`,
    options: ["has been", "went", "was", "had been"],
    answer: 0
  }),
  // 6. Gerunds after "use to"
  (sS, sP, tP, tF) => ({
    q: `${sS} is used ___ up early in the morning.`,
    options: ["to wake", "to waking", "waking", "wake"],
    answer: 1
  }),
  // 7. Passive voice
  (sS, sP, tP, tF) => ({
    q: `The building ___ ${tP}.`,
    options: ["was destroyed", "destroyed", "has destroyed", "is destroying"],
    answer: 0
  }),
  // 8. Wish (present)
  (sS, sP, tP, tF) => ({
    q: `${sS} wishes ${sS.toLowerCase()} ___ a car.`,
    options: ["has", "have", "had", "will have"],
    answer: 2
  }),
  // 9. Wish (past)
  (sS, sP, tP, tF) => ({
    q: `${sS} wishes ${sS.toLowerCase()} ___ to that party ${tP}.`,
    options: ["didn't go", "wouldn't go", "hasn't gone", "hadn't gone"],
    answer: 3
  }),
  // 10. Modals of deduction
  (sS, sP, tP, tF) => ({
    q: `${sS} isn't answering the phone. ${sS} ___ be asleep.`,
    options: ["must", "can", "could", "should"],
    answer: 0
  }),
  // 11. Relative clauses
  (sS, sP, tP, tF) => ({
    q: `He is the man ___ car was stolen.`,
    options: ["who", "whom", "whose", "that"],
    answer: 2
  }),
  // 12. Adjectives
  (sS, sP, tP, tF) => ({
    q: `${sS} looked at me ___.`,
    options: ["angry", "angrily", "anger", "angryly"],
    answer: 1
  }),
  // 13. Prepositions
  (sS, sP, tP, tF) => ({
    q: `${sS} is strictly opposed ___ the idea.`,
    options: ["with", "for", "to", "against"],
    answer: 2
  }),
  // 14. Phrasal verbs
  (sS, sP, tP, tF) => ({
    q: `The meeting was called ___ due to the weather.`,
    options: ["out", "of", "off", "up"],
    answer: 2
  }),
  // 15. Inversion
  (sS, sP, tP, tF) => ({
    q: `Rarely ___ such a beautiful sight.`,
    options: ["I have seen", "have I seen", "I saw", "saw I"],
    answer: 1
  }),
  // 16. Subjunctive
  (sS, sP, tP, tF) => ({
    q: `It is essential that ${sS} ___ on time.`,
    options: ["be", "is", "was", "are"],
    answer: 0
  }),
  // 17. Present Perfect Continuous
  (sS, sP, tP, tF) => ({
    q: `${sS} ___ for three hours.`,
    options: ["is studying", "studies", "has been studying", "studied"],
    answer: 2
  }),
  // 18. Past Perfect
  (sS, sP, tP, tF) => ({
    q: `By the time ${sP.toLowerCase()} arrived, the train ___.`,
    options: ["left", "has left", "was leaving", "had left"],
    answer: 3
  }),
  // 19. Causative
  (sS, sP, tP, tF) => ({
    q: `${sS} had her hair ___ yesterday.`,
    options: ["cut", "cutting", "to cut", "cutted"],
    answer: 0
  }),
  // 20. Neither...nor
  (sS, sP, tP, tF) => ({
    q: `Neither the principal nor the teachers ___ present.`,
    options: ["was", "were", "is", "be"],
    answer: 1
  })
];

let generatedQuestions = [];
let idCounter = 1;

while (generatedQuestions.length < 2000) {
  for (let template of templates) {
    if (generatedQuestions.length >= 2000) break;
    
    let sS = subjectsSingular[Math.floor(Math.random() * subjectsSingular.length)];
    let sP = subjectsPlural[Math.floor(Math.random() * subjectsPlural.length)];
    let tP = timeExpressionsPast[Math.floor(Math.random() * timeExpressionsPast.length)];
    let tF = timeExpressionsFuture[Math.floor(Math.random() * timeExpressionsFuture.length)];

    let qObj = null;
    try {
      qObj = template(sS, sP, tP, tF);
    } catch(e) {
      qObj = template(sS, sP, tP, tF);
    }
    
    generatedQuestions.push(qObj);
  }
}

// Write to file
const outPath = path.join(__dirname, "..", "data", "placementQuestions.ts");
const content = `// Auto-generated 2000 Placement Test Questions
export const QUESTION_BANK = ${JSON.stringify(generatedQuestions, null, 2)};
`;

fs.writeFileSync(outPath, content, "utf8");
console.log("Successfully generated", generatedQuestions.length, "questions to", outPath);

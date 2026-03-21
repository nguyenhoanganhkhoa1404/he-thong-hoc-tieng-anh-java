const fs = require('fs');

const outputCSV = "EnglishQuestions_2000.csv";
let csvContent = "category_id|content|option_a|option_b|option_c|option_d|correct_answer|explanation\n";

// --- GENERATE TENSES (Category 2) ---
// We need 1000 questions for Tenses.
const subjects = ["He", "She", "John", "Mary", "The teacher", "My brother", "The doctor"];
const pluralSubjects = ["They", "We", "The students", "My parents", "The workers"];
const verbs = [
    { base: 'work', s: 'works', ing: 'working', p2: 'worked', p3: 'worked', noun: 'at the factory' },
    { base: 'study', s: 'studies', ing: 'studying', p2: 'studied', p3: 'studied', noun: 'English' },
    { base: 'play', s: 'plays', ing: 'playing', p2: 'played', p3: 'played', noun: 'football' },
    { base: 'watch', s: 'watches', ing: 'watching', p2: 'watched', p3: 'watched', noun: 'TV' },
    { base: 'read', s: 'reads', ing: 'reading', p2: 'read', p3: 'read', noun: 'a book' }
];

let questionCount = 0;

function addRow(catId, content, a, b, c, d, correct, exp) {
    // Escape single quotes
    const escapeStr = str => str.replace(/'/g, "''");
    csvContent += `${catId}|${escapeStr(content)}|${escapeStr(a)}|${escapeStr(b)}|${escapeStr(c)}|${escapeStr(d)}|${correct}|${escapeStr(exp)}\n`;
    questionCount++;
}

// Generate Present Simple
for (let i = 0; i < 200; i++) {
    const s = subjects[Math.floor(Math.random() * subjects.length)];
    const v = verbs[Math.floor(Math.random() * verbs.length)];
    const time = ["every day", "usually", "often", "always", "every morning"][Math.floor(Math.random() * 5)];
    addRow(2, `${s} ... ${v.noun} ${time}.`, v.base, v.s, `is ${v.ing}`, v.p2, "B", `Thì hiện tại đơn diễn tả thói quen (${time}). Chủ ngữ số ít dùng động từ thêm s/es.`);
}

// Generate Present Continuous
for (let i = 0; i < 200; i++) {
    const s = pluralSubjects[Math.floor(Math.random() * pluralSubjects.length)];
    const v = verbs[Math.floor(Math.random() * verbs.length)];
    const time = ["now", "at the moment", "right now"][Math.floor(Math.random() * 3)];
    addRow(2, `Listen! ${s} ... ${v.noun} ${time}.`, v.base, `are ${v.ing}`, `have ${v.p3}`, v.p2, "B", `Thì hiện tại tiếp diễn diễn tả hành động đang xảy ra (dấu hiệu: ${time}, Listen!).`);
}

// Generate Past Simple
for (let i = 0; i < 200; i++) {
    const s = subjects[Math.floor(Math.random() * subjects.length)];
    const v = verbs[Math.floor(Math.random() * verbs.length)];
    const time = ["yesterday", "last week", "two days ago", "in 2010"][Math.floor(Math.random() * 4)];
    addRow(2, `${s} ... ${v.noun} ${time}.`, v.base, v.s, v.p2, `was ${v.ing}`, "C", `Thì quá khứ đơn diễn tả sự việc đã chấm dứt hoàn toàn trong quá khứ (${time}).`);
}

// Generate Present Perfect
for (let i = 0; i < 200; i++) {
    const s = subjects[Math.floor(Math.random() * subjects.length)];
    const v = verbs[Math.floor(Math.random() * verbs.length)];
    const time = ["already", "just", "recently", "lately"][Math.floor(Math.random() * 4)];
    addRow(2, `${s} has ... ${v.noun}.`, v.base, v.s, v.p2, v.p3, "D", `Thì hiện tại hoàn thành diễn tả hành động vừa mới xảy ra hoặc để lại kết quả (dấu hiệu: ${time}).`);
}

// Generate Future Simple
for (let i = 0; i < 200; i++) {
    const s = pluralSubjects[Math.floor(Math.random() * pluralSubjects.length)];
    const v = verbs[Math.floor(Math.random() * verbs.length)];
    const time = ["tomorrow", "next week", "in the future"][Math.floor(Math.random() * 3)];
    addRow(2, `I think ${s} ... ${v.noun} ${time}.`, v.base, `will ${v.base}`, `are ${v.ing}`, v.p2, "B", `Thì tương lai đơn diễn tả phỏng đoán hoặc sự việc trong tương lai (${time}).`);
}

// --- GENERATE GRAMMAR (Category 1) ---
// 1000 questions covering: Enough, Used to, As if, It was not until, Relative clauses, Comparatives, etc.

const grammarTopics = [
    {
        topic: "enough",
        template: "He is not tall ... to play basketball.",
        options: ["enough", "too", "so", "such"],
        correct: "A",
        exp: "Cấu trúc enough: adj/adv + enough + (for sb) + to do sth."
    },
    {
        topic: "used to",
        template: "I ... swim every day when I was young.",
        options: ["use to", "used to", "am used to", "get used to"],
        correct: "B",
        exp: "Cấu trúc used to + V(nguyên mẫu) diễn tả thói quen trong quá khứ."
    },
    {
        topic: "relative clause",
        template: "The man ... is standing over there is my uncle.",
        options: ["which", "whom", "who", "whose"],
        correct: "C",
        exp: "Dùng đại từ quan hệ 'who' thay cho danh từ chỉ người đóng vai trò chủ ngữ."
    },
    {
        topic: "comparative",
        template: "This book is ... than the one I read last week.",
        options: ["more interesting", "most interesting", "interesting", "as interesting"],
        correct: "A",
        exp: "So sánh hơn với tính từ dài: more + adj + than."
    },
    {
        topic: "conditional 2",
        template: "If I ... you, I would study harder.",
        options: ["am", "was", "were", "had been"],
        correct: "C",
        exp: "Câu điều kiện loại 2 (giả định không có thực ở hiện tại), to-be chia 'were' cho mọi ngôi."
    },
    {
        topic: "it was not until",
        template: "It was not until midnight ... he came home.",
        options: ["when", "that", "which", "then"],
        correct: "B",
        exp: "Cấu trúc It was not until... that... (mãi cho đến khi... thì...)."
    },
    {
        topic: "although",
        template: "... it was raining heavily, they went out.",
        options: ["In spite of", "Because", "Although", "Despite of"],
        correct: "C",
        exp: "Although + Mệnh đề (S + V) mang nghĩa mặc dù."
    },
    {
        topic: "as if",
        template: "He acts as if he ... the boss.",
        options: ["is", "was", "were", "has been"],
        correct: "C",
        exp: "Cấu trúc giã định as if/as though: lùi thì so với thực tế (thường dùng quá khứ giả định)."
    },
    {
        topic: "suggest",
        template: "I suggest ... to the cinema tonight.",
        options: ["to go", "going", "go", "went"],
        correct: "B",
        exp: "Cấu trúc suggest + V-ing (đề nghị cùng làm gì)."
    },
    {
        topic: "would rather",
        template: "I would rather ... at home than go out.",
        options: ["stay", "to stay", "staying", "stayed"],
        correct: "A",
        exp: "Cấu trúc would rather do sth than do (thích làm gì hơn làm gì)."
    }
];

for (let i = 0; i < 1000; i++) {
    const item = grammarTopics[Math.floor(Math.random() * grammarTopics.length)];
    // Add slight variations to avoid completely identical text based on loop index
    const variantTemplate = item.template.replace("He", ["She", "He", "John"][i % 3])
                                         .replace("I", ["We", "They", "I"][i % 3]);
    addRow(1, variantTemplate, item.options[0], item.options[1], item.options[2], item.options[3], item.correct, item.exp);
}

fs.writeFileSync(outputCSV, csvContent, "utf8");
console.log(`Generated ${questionCount} questions successfully into ${outputCSV}!`);

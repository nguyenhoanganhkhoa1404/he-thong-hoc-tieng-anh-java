const fs = require('fs');

const csvFile = 'EnglishQuestions_2000.csv';
const sqlFile = 'database_setup.sql';

let csvData = fs.readFileSync(csvFile, 'utf8');
let lines = csvData.split('\n');

let sqlContent = `\n\n-- =========================================\n`;
sqlContent += `-- TẠO BẢNG ENGLISH_QUESTIONS VÀ NẠP 2000 CÂU\n`;
sqlContent += `-- =========================================\n`;
sqlContent += `CREATE TABLE IF NOT EXISTS EnglishQuestions (\n`;
sqlContent += `    id BIGINT AUTO_INCREMENT PRIMARY KEY,\n`;
sqlContent += `    category_id INT,\n`;
sqlContent += `    content TEXT,\n`;
sqlContent += `    option_a VARCHAR(255),\n`;
sqlContent += `    option_b VARCHAR(255),\n`;
sqlContent += `    option_c VARCHAR(255),\n`;
sqlContent += `    option_d VARCHAR(255),\n`;
sqlContent += `    correct_answer VARCHAR(5),\n`;
sqlContent += `    explanation TEXT\n`;
sqlContent += `);\n\n`;

for (let i = 1; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line) continue;
    let parts = line.split('|');
    if (parts.length === 8) {
        let catId = parts[0];
        let content = parts[1];
        let a = parts[2];
        let b = parts[3];
        let c = parts[4];
        let d = parts[5];
        let correct = parts[6];
        let exp = parts[7];
        sqlContent += `INSERT IGNORE INTO EnglishQuestions (category_id, content, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES (${catId}, '${content}', '${a}', '${b}', '${c}', '${d}', '${correct}', '${exp}');\n`;
    }
}

fs.appendFileSync(sqlFile, sqlContent, 'utf8');
console.log('Successfully appended 2000 insert statements to database_setup.sql!');

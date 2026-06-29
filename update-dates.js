const fs = require('fs');
let code = fs.readFileSync('./src/data/articles.ts', 'utf8');
const ids = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,51,52,53,54,62,69,81,94];
ids.forEach(id => {
    const regex = new RegExp(`(id:\\s*${id},[\\s\\S]*?date:\\s*")\\d{4}-\\d{2}-\\d{2}(")`, 'g');
    code = code.replace(regex, `$12026-06-17$2`);
});
fs.writeFileSync('./src/data/articles.ts', code);
console.log("Updated dates!");

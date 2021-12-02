const { pool } = require("../../../config/database");

// 모든 유저 조회
async function getLineUpLists(connection) {
    const Query = `
        SELECT name,imgUrl,siteUrl,nameEng from LineUp order by createdAt desc limit 5;
    `;
    const [userRows] = await connection.query(Query);
    return userRows;
}

module.exports = {
    getLineUpLists,
    
};

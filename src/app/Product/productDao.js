const { pool } = require("../../../config/database");

// 모든 유저 조회

async function getProductById(connection, idx) {
    const Query = `
        SELECT name,nameEng,qrUrl,snsTag,snsTagEng from Product where productIdx = ?;
    `;
    const [Row] = await connection.query(Query, idx);
    return Row;
}

async function getProductInfo(connection, idx, lang) {
    const Query = `
        select videoUrl, thumbnail, content, contentEng, category
        from Media where productIdx = ? order by category;
    `;
    const Query2 = `
        select videoUrl,thumbnail from RelatedMedia 
        where productIdx = ? and status = 'N';
    `;
    const Query3 = `
        select imgUrl,content,contentEng from RelatedPicture 
        where productIdx = ? and status = 'N';
    `;
    var obj = {};
    const [Row] = await connection.query(Query, idx);
    const [Row2] = await connection.query(Query2, idx);
    const [Row3] = await connection.query(Query3, idx);
    for (let i = 0; i < Row.length; i++) {
        if (lang === 'ko') { delete Row[i].contentEng; }
        else if (lang === 'en') {
            Row[i].content = Row[i].contentEng;
            delete Row[i].contentEng;
        }
    }
    for (let i = 0; i < Row3.length; i++) {
        if (lang === 'ko') { delete Row3[i].contentEng; }
        else if (lang === 'en') {
            var tmp = Row3[i].contentEng;
            Row3[i].content = Row3[i].contentEng;
            delete Row3[i].contentEng;
        }
    }
    obj.assemblingMedia = Row[0];
    obj.VRMedia = Row[1];
    obj.relatedMediaLists = Row2;
    obj.relatedPictureLists = Row3;

    return obj;
}

async function getVRlists(connection, page) {
    const Query = `
        SELECT videoUrl,thumbnail,content,contentEng,name,nameEng from CategoryMedia 
        where status = 'N' and type = 'V'
        order by categoryMediaIdx desc limit ?, 20;
    `;
    const [userRows] = await connection.query(Query, page);
    return userRows;
}

async function getMedialists(connection, page) {
    const Query = `
        SELECT videoUrl,thumbnail,content,contentEng,name,nameEng from CategoryMedia 
        where status = 'N' and type = 'M'
        order by categoryMediaIdx desc limit ?, 20;
    `;
    const [userRows] = await connection.query(Query, page);
    return userRows;
}

async function getPicturelists(connection, page) {
    const Query = `
        SELECT imgUrl,content,contentEng,name,nameEng from CategoryPicture 
        where status = 'N'
        order by categoryPictureIdx desc limit ?, 20;
    `;
    const [userRows] = await connection.query(Query, page);
    return userRows;
}


module.exports = {
    getProductById,
    getProductInfo,
    getVRlists,
    getMedialists,
    getPicturelists,


};

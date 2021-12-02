//라인업 조회
async function selectLineUpList(connection){
  const query = `
  SELECT lineUpIdx, name, nameEng, imgUrl, siteUrl FROM LineUp
  WHERE status = 'N'
  ORDER BY createdAt DESC;
  `;
  const [rows] = await connection.query(query);
  return rows;
}

//라인업 생성
async function createNewLineUp(connection, params){
  const query = `
  INSERT INTO LineUp(name, nameEng, imgUrl, siteUrl)
  VALUES (?, ?, ?, ?);
  `;
  const [rows] = await connection.query(query, params);
  return rows;
}

//라인업 유효한 id인지
async function selectValidLineUpId(connection, params){
  const query = `
  SELECT EXISTS(SELECT lineUpIdx
    FROM LineUp
    WHERE status = 'N' && lineUpIdx = ?) as isExist
  `;
  const [rows] = await connection.query(query, params);
  return rows[0]['isExist'];
}

//라인업 삭제
async function deleteLineUp(connection, params){
  const query = `
  UPDATE LineUp
  SET status = 'D'
  WHERE lineUpIdx = ?
  `;
  const [rows] = await connection.query(query, params);
  return rows;
}


module.exports = {
  selectLineUpList,
  createNewLineUp,
  selectValidLineUpId,
  deleteLineUp,
}
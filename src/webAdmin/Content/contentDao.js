async function selectCategoryVrOrVideo(connection, params){
  const query = `
  SELECT categoryMediaIdx, name, nameEng, videoUrl, thumbnail, content, contentEng, DATE_FORMAT(createdAt, '%Y.%m.%d') as createdAt
  FROM CategoryMedia
  WHERE type = ? && status = 'N'
  ORDER BY CategoryMedia.createdAt DESC, CategoryMedia.categoryMediaIdx DESC
  `;
  const [rows] = await connection.query(query, params);
  return rows;
}

async function selectCategoryImage(connection){
  const query = `
  SELECT categoryPictureIdx, name, nameEng, imgUrl, content, contentEng, DATE_FORMAT(createdAt, '%Y.%m.%d') as createdAt
  FROM CategoryPicture
  WHERE status = 'N'
  ORDER BY CategoryPicture.createdAt DESC, CategoryPicture.categoryPictureIdx DESC
  `;
  const [rows] = await connection.query(query);
  return rows;
}

async function createCategoryVrOrVideo(connection, params){
  const query = `
  INSERT INTO CategoryMedia(name, nameEng, content, contentEng, videoUrl, thumbnail, type)
  VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const [rows] = await connection.query(query, params);
  return rows;
}

async function createCategoryImage(connection, params){
  const query = `
  INSERT INTO CategoryPicture(name, nameEng, content, contentEng, imgUrl)
  VALUES (?, ?, ?, ?, ?)
  `;
  const [rows] = await connection.query(query, params);
  return rows;
}

async function isValidCategoryMediaId(connection, params){
  const query = `
  SELECT EXISTS(SELECT categoryMediaIdx
    FROM CategoryMedia
    WHERE type = ? && status = 'N' && categoryMediaIdx = ?) as isExist;
  `;
  const [rows] = await connection.query(query, params);
  return rows[0]['isExist'];
}

async function isValidCategoryImageId(connection, params){
  const query = `
  SELECT EXISTS(SELECT categoryPictureIdx
    FROM CategoryPicture
    WHERE status = 'N' && categoryPictureIdx = ?) as isExist;
  `;
  const [rows] = await connection.query(query, params);
  return rows[0]['isExist'];
}

async function selectCategoryMediaDetail(connection, params){
  const query = `
  SELECT categoryMediaIdx, name, nameEng, thumbnail, videoUrl, content, contentEng,DATE_FORMAT(createdAt, '%Y.%m.%d') as createdAt
  FROM CategoryMedia
  WHERE status = 'N' && type = ? && categoryMediaIdx = ?
  `;
  const [rows] = await connection.query(query, params);
  return rows[0];
}

async function selectCategoryImageDetail(connection, params){
  const query = `
  SELECT categoryPictureIdx, name, nameEng, imgUrl, content, contentEng, DATE_FORMAT(createdAt, '%Y.%m.%d') as createdAt
  FROM CategoryPicture
  WHERE status = 'N' && categoryPictureIdx = ?
  `;
  const [rows] = await connection.query(query, params);
  return rows[0];
}

async function updateCategoryMedia(connection, params){
  const query = `
  UPDATE CategoryMedia
  SET name = IFNULL(?, name),
      nameEng = IFNULL(?, nameEng),
      thumbnail = IFNULL(?, thumbnail),
      content = IFNULL(?, content),
      contentEng = IFNULL(?, contentEng),
      videoUrl = IFNULL(?, videoUrl)
  WHERE categoryMediaIdx = ?
  `;
  const [rows] = await connection.query(query, params);
  return rows;
}

async function updateCategoryImage(connection, params){
  const query = `
  UPDATE CategoryPicture
  SET name = IFNULL(?, name),
      nameEng = IFNULL(?, nameEng),
      imgUrl = IFNULL(?, imgUrl),
      content = IFNULL(?, content),
      contentEng = IFNULL(?, contentEng)
  WHERE categoryPictureIdx = ?
  `;
  const [rows] = await connection.query(query, params);
  return rows;
}

async function deleteCategoryMedia(connection, params){
  const query = `
  UPDATE CategoryMedia
  SET status = 'D'
  WHERE categoryMediaIdx = ?
  `;
  const [rows] = await connection.query(query, params);
  return rows;
}

async function deleteCategoryImage(connection, params){
  const query = `
  UPDATE CategoryPicture
  SET status = 'D'
  WHERE categoryPictureIdx = ?
  `;
  const [rows] = await connection.query(query, params);
  return rows;
}


module.exports = {
  selectCategoryVrOrVideo,
  selectCategoryImage,
  createCategoryVrOrVideo,
  createCategoryImage,
  isValidCategoryMediaId,
  isValidCategoryImageId,
  selectCategoryMediaDetail,
  selectCategoryImageDetail,
  updateCategoryMedia,
  updateCategoryImage,
  deleteCategoryMedia,
  deleteCategoryImage,
}
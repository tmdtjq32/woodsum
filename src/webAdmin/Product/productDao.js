// 전체 상품 가져오기
async function selectProduct(connection){
  const query = `
  SELECT productIdx,
    name,
    qrUrl,
    snsTag,
    nameEng,
    snsTagEng,
    date_format(createdAt, '%Y.%m.%d') as createdAt
  FROM Product
  WHERE status = 'N'
  ORDER BY Product.createdAt DESC;
  `;
  const [rows] = await connection.query(query);
  return rows;
}

//유효한 상품 id인지
async function selectValidProductId(connection, params){
  const query = `
  SELECT EXISTS(SELECT productIdx
  FROM Product
  WHERE status = 'N' && productIdx = ?) as isExist
  `;
  const [rows] = await connection.query(query, params);
  return rows[0]['isExist'];
}

//특정 상품 정보, 메뉴얼, vr 영상 가져오기
async function selectProductMenualVr(connection, params){
  const query = `
  SELECT P.productIdx,
        P.name,
        P.qrUrl,
        P.snsTag,
        P.nameEng,
        P.snsTagEng,
        MM.mediaIdx as menualIdx,
        MM.thumbnail as menualThumbnail,
        MM.videoUrl as menualVideoUrl,
        MM.content as menualContent,
        MM.contentEng as menualContentEng,
        VM.mediaIdx as vrIdx,
        VM.thumbnail as vrThumbnail,
        VM.videoUrl as vrVideoUrl,
        VM.content as vrContent,
        VM.contentEng as vrContentEng
  FROM Product P
      LEFT JOIN Media MM on P.productIdx = MM.productIdx && MM.status = 'N' && MM.category = 'A'
      LEFT JOIN Media VM on P.productIdx = VM.productIdx && VM.status = 'N' && VM.category = 'V'
  WHERE P.status = 'N' && P.productIdx = ?
  ORDER BY P.createdAt;
  `;
  const [rows] = await connection.query(query, params);
  return rows[0];
}

//특정 상품의 관련 동영상 가져오기 (최대 5개)
async function selectProductRelatedVideo(connection, params){
  const query = `
  SELECT P.productIdx,
        RM.relatedMediaIdx,
        RM.videoUrl,
        RM.thumbnail
  FROM Product P
          JOIN RelatedMedia RM ON P.productIdx = RM.productIdx && RM.status = 'N'
  WHERE P.status = 'N' && P.productIdx = ?
  ORDER BY RM.createdAt
  LIMIT 5;
  `;
  const [rows] = await connection.query(query, params);
  return rows;
}

//특정 상품의 관련 사진 가져오기 (최대 5개)
async function selectProductRelatedImg(connection, params){
  const query = `
  SELECT P.productIdx,
        RP.relatedPictureIdx,
        RP.imgUrl,
        RP.content,
        RP.contentEng
  FROM Product P
          JOIN RelatedPicture RP ON P.productIdx = RP.productIdx && RP.status = 'N'
  WHERE P.status = 'N' && P.productIdx = ?
  ORDER BY RP.createdAt
  LIMIT 5;
  `;
  const [rows] = await connection.query(query, params);
  return rows;
}

//제품 생성
async function createProduct(connection, params){
  const query = `
  INSERT INTO Product(name, nameEng, snsTag, snsTagEng, qrUrl)
  VALUES (?, ?, ?, ?, ?);
  `;
  const [rows] = await connection.query(query, params);
  return rows;
}

//제품 생성 - 영상 넣기
async function createProductMedia(connection, params){
  const query = `
  INSERT INTO Media(productIdx, videoUrl, thumbnail, content, contentEng, category)
  VALUES (?, ?, ?, ?, ?, ?);
  `;
  const [rows] = await connection.query(query, params);
  return rows;
}

//제품 생성 - qrUrl 넣기
async function updateProductQrUrl(connection, params){
  const query = `
  UPDATE Product SET qrUrl = ?
  WHERE productIdx = ?
  `;
  const [rows] = await connection.query(query, params);
  return rows;
}

//제품 생성 - 관련 영상 넣기
async function createProductRelatedVideo(connection, params){
  const query = `
  INSERT INTO RelatedMedia (productIdx, videoUrl, thumbnail)
  VALUES (?, ?, ?)
  `;
  const [rows] = await connection.query(query, params);
  return rows;
}

//제품 생성 - 관련 사진 넣기
async function createProductRelatedImage(connection, params){
  const query = `
  INSERT INTO RelatedPicture (productIdx, imgUrl, content, contentEng)
  VALUES (?, ?, ?, ?)
  `;
  const [rows] = await connection.query(query, params);
  return rows;
}

//----------------------상품 수정 관련----------------------
async function selectOriginalRelatedVideoLength(connection, params){
  const query = `
  SELECT COUNT(relatedMediaIdx) as cnt FROM RelatedMedia
  WHERE productIdx = ? && status = 'N';
  `;
  const [rows] = await connection.query(query, params);
  return rows[0]['cnt'];
}

async function selectOriginalRelatedImageLength(connection, params){
  const query = `
  SELECT COUNT(relatedPictureIdx) as cnt FROM RelatedPicture
  WHERE productIdx = ? && status = 'N';
  `;
  const [rows] = await connection.query(query, params);
  return rows[0]['cnt'];
}

async function updateProductNomal(connection, params){
  const query = `
  UPDATE Product
  SET name      = IFNULL(?, name),
      nameEng   = IFNULL(?, nameEng),
      snsTag    = IFNULL(?, snsTag),
      snsTagEng = IFNULL(?, snsTagEng)
  WHERE productIdx = ? && status = 'N';
  `;
  const [rows] = await connection.query(query, params);
  return rows;
}

async function updateProductNomalMedia(connection, params){
  const query = `
  UPDATE Media
  SET videoUrl   = IFNULL(?, videoUrl),
      thumbnail  = IFNULL(?, thumbnail),
      content    = IFNULL(?, content),
      contentEng = IFNULL(?, contentEng)
  WHERE productIdx = ? && category = ? && status = 'N';
  `;
  const [rows] = await connection.query(query, params);
  return rows;
}

async function deleteExistRelatedVideo(connection, params){
  const query = `
  UPDATE RelatedMedia
  SET status = 'D'
  WHERE productIdx = ? && status = 'N';
  `;
  const [rows] = await connection.query(query, params);
  return rows;
}

async function insertRelatedVideo(connection, params){
  const query = `
  INSERT INTO RelatedMedia(productIdx, videoUrl, thumbnail)
  VALUES (?, ?, ?);
  `;
  const [rows] = await connection.query(query, params);
  return rows;
}

async function getExistRelatedVideoId(connection, params){
  const query = `
  SELECT relatedMediaIdx FROM RelatedMedia
  WHERE productIdx = ? && status = 'N'
  ORDER BY createdAt DESC
  `;
  const [rows] = await connection.query(query, params);
  return rows;
}

async function updateProductRelatedVideo(connection, params){
  const query = `
  UPDATE RelatedMedia
  SET videoUrl   = IFNULL(?, videoUrl),
      thumbnail  = IFNULL(?, thumbnail)
  WHERE relatedMediaIdx = ? && status = 'N';
  `;
  const [rows] = await connection.query(query, params);
  return rows;
}

async function deleteExistRelatedImage(connection, params){
  const query = `
  UPDATE RelatedPicture
  SET status = 'D'
  WHERE productIdx = ? && status = 'N';
  `;
  const [rows] = await connection.query(query, params);
  return rows;
}

async function insertRelatedImage(connection, params){
  const query = `
  INSERT INTO RelatedPicture(productIdx, imgUrl, content, contentEng)
  VALUES (?, ?, ?, ?)
  `;
  const [rows] = await connection.query(query, params);
  return rows;
}

async function getExistRelatedImageId(connection, params){
  const query = `
  SELECT relatedPictureIdx FROM RelatedPicture
  WHERE productIdx = ? && status = 'N'
  ORDER BY createdAt DESC
  `;
  const [rows] = await connection.query(query, params);
  return rows;
}

async function updateProductRelatedImage(connection, params){
  const query = `
  UPDATE RelatedPicture
  SET imgUrl     = IFNULL(?, imgUrl),
      content    = IFNULL(?, content),
      contentEng = IFNULL(?, contentEng)
  WHERE relatedPictureIdx = ? && status = 'N';
  `;
  const [rows] = await connection.query(query, params);
  return rows;
}


//상품 삭제하기
async function deleteProduct(connection, params){
  const query = `
  UPDATE Product
  SET status = 'D'
  WHERE productIdx = ?
  `;
  const [rows] = await connection.query(query, params);
  return rows;
}

module.exports ={
  selectProduct,
  selectValidProductId,
  selectProductMenualVr,
  selectProductRelatedVideo,
  selectProductRelatedImg,
  createProduct,
  createProductMedia,
  updateProductQrUrl,
  createProductRelatedVideo,
  createProductRelatedImage,
  selectOriginalRelatedVideoLength,
  selectOriginalRelatedImageLength,
  updateProductNomal,
  updateProductNomalMedia,
  deleteExistRelatedVideo,
  insertRelatedVideo,
  getExistRelatedVideoId,
  updateProductRelatedVideo,
  deleteExistRelatedImage,
  insertRelatedImage,
  getExistRelatedImageId,
  updateProductRelatedImage,
  deleteProduct,
}
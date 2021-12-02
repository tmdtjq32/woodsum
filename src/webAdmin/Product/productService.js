const {pool} = require("../../../config/database");
const {logger} = require("../../../config/winston");
const productDao = require("./productDao");
const productProvider = require("./productProvider");
const baseResponse = require("../../../config/baseResponseStatus");
const {errResponse} = require("../../../config/response");

exports.addNewProduct = async function(nomalParams, menualParams, vrParams, relatedVideoParams, relatedImageParams){
  try{
    const connection = await pool.getConnection(async conn => conn);
    try{
      await connection.beginTransaction();
      const newProduct = await productDao.createProduct(connection, nomalParams);
      const productIdx = newProduct.insertId;

      //qrUrl 수정
      let qrUrl = `https://woodsumexe.page.link/execution?productIdx=${productIdx}`;
      const updateQuUrlParams = [qrUrl, productIdx];
      await productDao.updateProductQrUrl(connection, updateQuUrlParams);

      //조립 영상 추가
      menualParams.unshift(productIdx);
      await productDao.createProductMedia(connection, menualParams);

      //360vr 영상 추가
      vrParams.unshift(productIdx);
      await productDao.createProductMedia(connection, vrParams);

      //관련 동영상 추가
      //relatedVideoParams = [relatedVideoUrl, relatedVideoThumbnail];
      if (relatedVideoParams.length !== 0){
        let relatedVideoItemParams;
        for (let i=0; i<relatedVideoParams[0].length; i++){
          relatedVideoItemParams = [productIdx, relatedVideoParams[0][i], relatedVideoParams[1][i]];
          await productDao.createProductRelatedVideo(connection, relatedVideoItemParams);
        }
      }
      
      //관련 사진 추가
      //relatedImageParams = [relatedVideoUrl, relatedVideoThumbnail];
      if (relatedImageParams.length !== 0){
        let relatedImageItemParams;
        for (let i=0; i<relatedImageParams[0].length; i++){
          relatedImageItemParams = [productIdx, relatedImageParams[0][i], relatedImageParams[1][i], relatedImageParams[1][i]];
          await productDao.createProductRelatedImage(connection, relatedImageItemParams);
        }
      }
      await connection.commit();
      connection.release();
      return productIdx;

    }catch(err){
      await connection.rollback();
      connection.release();
      logger.error(`addNewProduct transaction Query Error: ${err}`);
      return false;
    }
  }catch(err){
    logger.error(`addNewProduct transaction DB Connection Error: ${err}`);
    return false;
  }
}


exports.deleteProduct = async function(params){
  try{
    const connection = await pool.getConnection(async conn => conn);
    try{
      await connection.beginTransaction();
      const result = await productDao.deleteProduct(connection, params);
      await connection.commit();
      connection.release();
      return result;
    }catch(err){
      await connection.rollback();
      connection.release();
      logger.error(`deleteProduct transaction Query Error: ${err}`);
    }
  }catch(err){
    logger.error(`deleteProduct transaction DB Connection Error: ${err}`);
  }
}


exports.updateProduct = async function(nomalParams, menualParams, vrParams, relatedVideoParams, relatedImageParams){
  try{
    const connection = await pool.getConnection(async conn => conn);
    try{
      await connection.beginTransaction();
      //기본 정보 변경
      if (nomalParams.length !== 0){
        //nomalParams = [name, nameEng, snsTag, snsTagEng, id]
        await productDao.updateProductNomal(connection, nomalParams);
      }
      //메뉴얼 정보 변경
      if (menualParams.length !== 0){
        //menualParams = [menualUrl, menualThumbnail, menualContent, menualContentEng, id, 'A']
        await productDao.updateProductNomalMedia(connection, menualParams);
      }
      //vr 정보 변경
      if (vrParams.length !== 0){
        //vrParams = [vrUrl, vrThumbnail, vrContent, vrContentEng, id, 'V']
        await productDao.updateProductNomalMedia(connection, vrParams);
      }


      //관련 동영상 변경
      //relatedVideoParams = [id, relatedVideoUrl, relatedVideoThumbnail]
      const videoUrlListLength = relatedVideoParams[1].length;
      const videoThumbnailListLength = relatedVideoParams[2].length;

      //관련 동영상 전체(url, thumbnail) 변경
      if (videoUrlListLength !== 0 && videoThumbnailListLength !== 0){
        //기존 관련 동영상 삭제
        let params;
        params = [relatedVideoParams[0]];
        await productDao.deleteExistRelatedVideo(connection, params);
        //관련 동영상 등록
        for (let i=0; i<videoUrlListLength; i++){
          params = [relatedVideoParams[0], relatedVideoParams[1][i], relatedVideoParams[2][i]];
          await productDao.insertRelatedVideo(connection, params);
        }
      }
      else if(videoUrlListLength !== 0 || videoThumbnailListLength !== 0){
        //id(relatedVideoIdx) 등록 순서대로 받아오기 (createdAt DESC)
        let params;
        params = [relatedVideoParams[0]];
        const existRelatedVideoId = await productProvider.getExistRelatedVideoId(params);
        if (existRelatedVideoId === false) return res.send(errResponse(baseResponse.DB_ERROR));
        let existRelatedVideoIdList = [];
        existRelatedVideoId.forEach(item => existRelatedVideoIdList.push(item.relatedMediaIdx));

        for (let i=0; i<existRelatedVideoIdList.length; i++){
          params = [
            (videoUrlListLength === 0) ? null : relatedVideoParams[1][i],
            (videoThumbnailListLength === 0) ? null : relatedVideoParams[2][i],
            existRelatedVideoIdList[i]
          ];

          await productDao.updateProductRelatedVideo(connection, params);
        }
      }

      //관련 이미지 변경
      //relatedImageParams = [id, relatedImgUrl, relatedImgContent, relatedImgContentEng]
      const imgUrlListLength = relatedImageParams[1].length;
      const imgContentListLength = relatedImageParams[2].length;
      const imgContentEngListLength = relatedImageParams[3].length;

      //관련 이미지 전체(url, content, contentEng) 변경
      if (imgUrlListLength !== 0 && imgContentListLength !== 0 && imgContentEngListLength !== 0){
        //기존 관련 이미지 삭제
        let params;
        params = [relatedImageParams[0]];
        await productDao.deleteExistRelatedImage(connection, params);

        //관련 이미지 등록
        for (let i=0; i<imgUrlListLength; i++){
          params = [relatedImageParams[0], relatedImageParams[1][i], relatedImageParams[2][i], relatedImageParams[3][i]];
          await productDao.insertRelatedImage(connection, params);
        }
      }
      else if ((imgUrlListLength !== 0 && imgContentListLength !== 0) ||
        (imgUrlListLength !== 0 && imgContentEngListLength !== 0) ||
        (imgContentListLength !== 0 && imgContentEngListLength !== 0) ||
        imgUrlListLength !== 0 || imgContentListLength !== 0 || imgContentEngListLength !== 0){
          //id(relatedVideoIdx) 등록 순서대로 받아오기 (createdAt DESC)
          let params;
          params = [relatedImageParams[0]];
          const existRelatedImageId = await productProvider.getExistRelatedImageId(params);
          if (existRelatedImageId === false) return res.send(errResponse(baseResponse.DB_ERROR));

          let existRelatedImageIdList = [];
          existRelatedImageId.forEach(item => existRelatedImageIdList.push(item.relatedPictureIdx));

          for (let i=0; i<existRelatedImageIdList.length; i++){
            params = [
              (imgUrlListLength === 0) ? null : relatedImageParams[1][i],
              (imgContentListLength === 0) ? null : relatedImageParams[2][i],
              (imgContentEngListLength === 0) ? null : relatedImageParams[3][i],
              existRelatedImageIdList[i]
            ];

            await productDao.updateProductRelatedImage(connection, params);
          }
      }
      await connection.commit();
      connection.release();

    }catch(err){
      await connection.rollback();
      connection.release();
      logger.error(`updateProduct transaction Query Error: ${err}`);
      return false;
    }
  }catch(err){
    logger.error(`updateProduct transaction DB Connection Error: ${err}`);
    return false;
  }
}
const productService = require('../../webAdmin/Product/productService');
const productProvider = require('../../webAdmin/Product/productProvider');
const baseResponse = require('../../../config/adminBaseResponseStatus');
const {response, errResponse} = require('../../../config/response');

//상품 전체 조회
//[GET] /admin/products
exports.getProducts = async function(req, res){
  const {language} = req.query;
  if (language){
    if (language!=='ko' && language!=='en'){
      return res.send(errResponse(baseResponse.INVALID_LANGUAGE));
    }
  }

  const productResultList = await productProvider.retrieveProductList();
  if (!productResultList){
    return res.send(errResponse(baseResponse.DB_ERROR));
  }
  if (productResultList.length === 0){
    return res.send(errResponse(baseResponse.PRODUCT_EMPTY));
  }

  let result = {};
  result.product = [];

  productResultList.forEach(product => {
    result.product.push({
      'id': product.productIdx,
      'name': (language === 'en') ? product.nameEng : product.name,
      'snsTag': (language === 'en') ? product.snsTagEng : product.snsTag,
      'qrUrl': product.qrUrl,
      'createdAt': product.createdAt
    });
  })

  return res.send(response(baseResponse.SUCCESS, result));
}

//상품 상세 조회
//[GET] /admin/products/:id
exports.getProductDetail = async function(req, res){
  const {id} = req.params;
  if (!id) return res.send(errResponse(baseResponse.EMPTY_PRODUCT_ID));

  let params = [id];

  const validId = await productProvider.retrieveValidProductId(params);
  if (validId === false){
    return res.send(errResponse(baseResponse.DB_ERROR));
  }
  if (validId === 0){
    return res.send(errResponse(baseResponse.INVALD_PRODUCT_ID));
  }

  const productMenualVrtList = await productProvider.retrieveProductMenualVrList(params);
  if (!productMenualVrtList){
    return res.send(errResponse(baseResponse.DB_ERROR));
  }
  let result = {};
  result.product = {};

  result.product = {
    'id': productMenualVrtList.productIdx,
      'name': productMenualVrtList.name,
      'nameEng': productMenualVrtList.nameEng,
      'snsTag': productMenualVrtList.snsTag,
      'snsTagEng': productMenualVrtList.snsTagEng,
      'qrUrl': productMenualVrtList.qrUrl,
      'menual': {
        'id': productMenualVrtList.menualIdx,
        'url': productMenualVrtList.menualVideoUrl,
        'thumbnail': productMenualVrtList.menualThumbnail,
        'cautions': productMenualVrtList.menualContent,
        'cautionsEng': productMenualVrtList.menualContentEng
      },
      'contentVideo': {
        'vrVideo': {
          'id': productMenualVrtList.vrIdx,
          'url': productMenualVrtList.vrVideoUrl,
          'thumbnail': productMenualVrtList.vrThumbnail,
          'content': productMenualVrtList.vrContent,
          'contentEng': productMenualVrtList.vrContentEng
        }
      }
  };

  const productRelatedVideoList = await productProvider.retrieveProductRelatedVideoList(params);
  if (!productRelatedVideoList){
    return res.send(errResponse(baseResponse.DB_ERROR));
  }

  const productRelatedImgList = await productProvider.retrieveProductRelatedImgList(params);
  if (!productRelatedImgList){
    return res.send(errResponse(baseResponse.DB_ERROR));
  }

  if (productRelatedVideoList.length > 0){
    result.product.contentVideo.relatedVideo = [];
    productRelatedVideoList.forEach(relatedVideo => {
      result.product.contentVideo.relatedVideo.push({
        'id': relatedVideo.relatedMediaIdx,
        'url': relatedVideo.videoUrl,
        'thumbnail': relatedVideo.thumbnail
      })
    })
  }
  
  if (productRelatedImgList.length > 0){
    result.product.contentVideo.relatedImage = [];
    productRelatedImgList.forEach(relatedImage => {
      result.product.contentVideo.relatedImage.push({
        'id': relatedImage.relatedPictureIdx,
        'url': relatedImage.imgUrl,
        'content': relatedImage.content,
        'contentEng': relatedImage.contentEng
      })
    })
  }

  return res.send(response(baseResponse.SUCCESS, result));
}

//상품 등록
//[POST] /admin/products
exports.uploadProducts = async function(req, res){
  const {
    name,
    nameEng,
    menualThumbnail,
    menualUrl,
    menualContent,
    menualContentEng,
    vrThumbnail,
    vrUrl,
    vrContent,
    vrContentEng,
    snsTag,
    snsTagEng
  } = req.body;

  let {
    relatedVideoUrl,
    relatedVideoThumbnail,
    relatedImgUrl,
    relatedImgContent,
    relatedImgContentEng
  } = req.body;

  if (!name) return res.send(errResponse(baseResponse.EMPTY_PRODUCT_NAME));
  else if (!nameEng) return res.send(errResponse(baseResponse.EMPTY_PRODUCT_NAME_ENG));
  else if (!menualThumbnail) return res.send(errResponse(baseResponse.EMPTY_MENUAL_THUMBNAIL));
  else if (!menualUrl) return res.send(errResponse(baseResponse.EMPTY_MENUAL_URL));
  else if (!menualContent) return res.send(errResponse(baseResponse.EMPTY_MENUAL_CATIONS));
  else if (!menualContentEng) return res.send(errResponse(baseResponse.EMPTY_MENUAL_CATIONS_ENG));
  else if (!vrThumbnail) return res.send(errResponse(baseResponse.EMPTY_VR_THUMBNAIL));
  else if (!vrUrl) return res.send(errResponse(baseResponse.EMPTY_VR_URL));
  else if (!vrContent) return res.send(errResponse(baseResponse.EMPTY_VR_CONTENT));
  else if (!vrContentEng) return res.send(errResponse(baseResponse.EMPTY_VR_CONTENT_ENG));
  else if (!snsTag) return res.send(errResponse(baseResponse.EMPTY_SNS_TAG));
  else if (!snsTagEng) return res.send(errResponse(baseResponse.EMPTY_SNS_TAG_ENG));

  if (name.length >= 200) return res.send(errResponse(baseResponse.EXCEED_PRODUCT_NAME));
  else if (nameEng.length >= 200) return res.send(errResponse(baseResponse.EXCEED_PRODUCT_NAME_ENG));
  else if (menualContent.length >= 2000) return res.send(errResponse(baseResponse.EXCEED_MENUAL_CATIONS));
  else if (menualContentEng.length >= 2000) return res.send(errResponse(baseResponse.EXCEED_MENUAL_CATIONS_ENG));
  else if (vrContent.length >= 2000) return res.send(errResponse(baseResponse.EXCEED_VR_CONTENT));
  else if (vrContentEng.length >= 2000) return res.send(errResponse(baseResponse.EXCEED_VR_CONTENT_ENG));
  else if (snsTag.length >= 2000) return res.send(errResponse(baseResponse.EXCEED_MENUAL_SNS_TAG));
  else if (snsTagEng.length >= 2000) return res.send(errResponse(baseResponse.EXCEED_MENUAL_SNS_TAG_ENG));

  if (relatedVideoUrl){
    try{
      relatedVideoUrl = JSON.parse(relatedVideoUrl);
      if (!Array.isArray(relatedVideoUrl)) return res.send(errResponse(baseResponse.INVALID_RELTAED_VIDEO_URL_FORMAT));
      if (relatedVideoUrl.length > 5) return res.send(errResponse(baseResponse.NUMBER_EXCEED_RELATED_VIDEO));
    }catch(err){
      return res.send(errResponse(baseResponse.INVALID_RELTAED_VIDEO_URL_FORMAT));
    }
  }

  if(relatedVideoThumbnail){
    try{
      relatedVideoThumbnail = JSON.parse(relatedVideoThumbnail);
      if (!Array.isArray(relatedVideoThumbnail)) return res.send(errResponse(baseResponse.INVALID_RELATED_VIDEO_THUMBNAIL_FORMAT));
    }catch(err){
      return res.send(errResponse(baseResponse.INVALID_RELATED_VIDEO_THUMBNAIL_FORMAT));
    }
  }

  if(relatedImgUrl){
    try{
      relatedImgUrl = JSON.parse(relatedImgUrl);
      if (!Array.isArray(relatedImgUrl)) return res.send(errResponse(baseResponse.INAVLID_RELATED_IMAGE_URL_FORMAT));
      if (relatedImgUrl.length > 5) return res.send(errResponse(baseResponse.NUMBER_EXCEED_RELATED_IMAGE));
    }catch(err){
      return res.send(errResponse(baseResponse.INAVLID_RELATED_IMAGE_URL_FORMAT));
    }
  }

  if(relatedImgContent){
    try{
      relatedImgContent = JSON.parse(relatedImgContent);
      if (!Array.isArray(relatedImgContent)) return res.send(errResponse(baseResponse.INVALID_RELTAED_IMAGE_CONTENT_FORMAT));
    }catch(err){
      return res.send(errResponse(baseResponse.INVALID_RELTAED_IMAGE_CONTENT_FORMAT));
    }
  }

  if(relatedImgContentEng){
    try{
      relatedImgContentEng = JSON.parse(relatedImgContentEng);
      if (!Array.isArray(relatedImgContentEng)) return res.send(errResponse(baseResponse.INVALID_RELTAED_IMAGE_CONTENT_ENG_FORMAT));
    }catch(err){
      return res.send(errResponse(baseResponse.INVALID_RELTAED_IMAGE_CONTENT_ENG_FORMAT));
    }
  }

  if (relatedVideoUrl && !relatedVideoThumbnail) return res.send(errResponse(baseResponse.EMPTY_RELATED_VIDEO_THUMBNAIL));
  if (!relatedVideoUrl && relatedVideoThumbnail) return res.send(errResponse(baseResponse.EMPTY_RELATED_VIDEO_URL));

  if (relatedImgUrl){
    if (!relatedImgContent) return res.send(errResponse(baseResponse.EMPTY_RELATED_IMAGE_CONTENT));
    if (!relatedImgContentEng) return res.send(errResponse(baseResponse.EMPTY_RELATED_IMAGE_CONTENT_ENG));
  }
  if(relatedImgContent){
    if(!relatedImgUrl) return res.send(errResponse(baseResponse.EMPTY_RELATED_IMAGE_URL));
    if(!relatedImgContentEng) return res.send(errResponse(baseResponse.EMPTY_RELATED_IMAGE_CONTENT_ENG));
  }
  if(relatedImgContentEng){
    if(!relatedImgUrl) return res.send(errResponse(baseResponse.EMPTY_RELATED_IMAGE_URL));
    if(!relatedImgContent) return res.send(errResponse(baseResponse.EMPTY_RELATED_IMAGE_CONTENT));
  }

  if (relatedVideoUrl){
    if (relatedVideoUrl.length !== relatedVideoThumbnail.length) return res.send(errResponse(baseResponse.RELATED_VIDEO_THUMBNAIL_LENGTH_NOT_MATCHED));
  }

  if (relatedImgUrl){
    if (relatedImgUrl.length !== relatedImgContent.length) return res.send(errResponse(baseResponse.RELATED_IMAGE_CONTENT_LENGTH_NOT_MATCHED));
    else if (relatedImgContent.length !== relatedImgContentEng.length) return res.send(errResponse(baseResponse.RELATED_IMAGE_CONTENT_ENG_LENGTH_NOT_MATCHED));
  }

  let qrUrl = '-';
  let nomalParams = [name, nameEng, snsTag, snsTagEng, qrUrl];
  let menualParams = [menualUrl, menualThumbnail, menualContent, menualContentEng, 'A'];
  let vrParams = [vrUrl, vrThumbnail, vrContent, vrContentEng, 'V'];
  let relatedVideoParams = [];
  if (relatedVideoUrl && relatedVideoThumbnail){
    relatedVideoParams = [relatedVideoUrl, relatedVideoThumbnail];
  }
  let relatedImageParams = [];
  if (relatedImgUrl && relatedImgContent && relatedImgContentEng){
    relatedImageParams = [relatedImgUrl, relatedImgContent, relatedImgContentEng];
  }

  const newProductIdx = await productService.addNewProduct(nomalParams, menualParams, vrParams, relatedVideoParams, relatedImageParams);
  if (!newProductIdx) return res.send(errResponse(baseResponse.DB_ERROR));

  const result = {
    'id': newProductIdx
  }
  
  return res.send(response(baseResponse.SUCCESS, result));
}

//상품 수정
//[PATCH] /admin/products/:id
exports.updateProduct = async function(req, res){
  const {id} = req.params;
  let params;
  params = [id];
  const isValidProductId = await productProvider.isValidProductId(params);
  if (isValidProductId === 0) return res.send(errResponse(baseResponse.INVALD_PRODUCT_ID));
  else if (isValidProductId === false) return res.send(errResponse(baseResponse.DB_ERROR));

  const {
    name,
    nameEng,
    menualThumbnail,
    menualUrl,
    menualContent,
    menualContentEng,
    vrThumbnail,
    vrUrl,
    vrContent,
    vrContentEng,
    snsTag,
    snsTagEng
  } = req.body;

  let {
    relatedVideoThumbnail,
    relatedVideoUrl,
    relatedImgUrl,
    relatedImgContent,
    relatedImgContentEng,
  } = req.body;

  if (!(name || nameEng || menualThumbnail || menualUrl || menualContent || menualContentEng || vrThumbnail ||
      vrUrl || vrContent || vrContentEng || snsTag || snsTagEng || relatedVideoThumbnail || relatedVideoUrl ||
      relatedImgUrl || relatedImgContent || relatedImgContentEng)){
      return res.send(errResponse(baseResponse.EMPTY_UPDATE_CONTENT));
  }

  if (name && name.length > 200) return res.send(errResponse(baseResponse.EXCEED_PRODUCT_NAME));
  else if (nameEng && nameEng.length > 200) return res.send(errResponse(baseResponse.EXCEED_PRODUCT_NAME_ENG));
  else if (menualContent && menualContent.length > 2000) return res.send(errResponse(baseResponse.EXCEED_MENUAL_CATIONS));
  else if (menualContentEng && menualContentEng.length > 2000) return res.send(errResponse(baseResponse.EXCEED_MENUAL_CATIONS_ENG));
  else if (vrContent && vrContent.length > 2000) return res.send(errResponse(baseResponse.EXCEED_VR_CONTENT));
  else if (vrContentEng && vrContentEng.length > 2000) return res.send(errResponse(baseResponse.EXCEED_VR_CONTENT_ENG));
  else if (snsTag && snsTag.length > 200) return res.send(errResponse(baseResponse.EXCEED_MENUAL_SNS_TAG));
  else if (snsTagEng && snsTagEng.length > 200) return res.send(errResponse(baseResponse.EXCEED_MENUAL_SNS_TAG_ENG));

  //관련동영상 / 관련사진 형식, 개수 확인
  if (relatedVideoUrl){
    try{
      relatedVideoUrl = JSON.parse(relatedVideoUrl);
      if (!Array.isArray(relatedVideoUrl)) return res.send(errResponse(baseResponse.INVALID_RELTAED_VIDEO_URL_FORMAT));
      if (relatedVideoUrl.length > 5) return res.send(errResponse(baseResponse.NUMBER_EXCEED_RELATED_VIDEO));
    }catch(err){
      return res.send(errResponse(baseResponse.INVALID_RELTAED_VIDEO_URL_FORMAT));
    }
  }

  if(relatedVideoThumbnail){
    try{
      relatedVideoThumbnail = JSON.parse(relatedVideoThumbnail);
      if (!Array.isArray(relatedVideoThumbnail)) return res.send(errResponse(baseResponse.INVALID_RELATED_VIDEO_THUMBNAIL_FORMAT));
      if (relatedVideoThumbnail.length > 5) return res.send(errResponse(baseResponse.NUMBER_EXCEED_RELATED_VIDEO_THUMBNAIL));
    }catch(err){
      return res.send(errResponse(baseResponse.INVALID_RELATED_VIDEO_THUMBNAIL_FORMAT));
    }
  }

  if(relatedImgUrl){
    try{
      relatedImgUrl = JSON.parse(relatedImgUrl);
      if (!Array.isArray(relatedImgUrl)) return res.send(errResponse(baseResponse.INAVLID_RELATED_IMAGE_URL_FORMAT));
      if (relatedImgUrl.length > 5) return res.send(errResponse(baseResponse.NUMBER_EXCEED_RELATED_IMAGE));
    }catch(err){
      return res.send(errResponse(baseResponse.INAVLID_RELATED_IMAGE_URL_FORMAT));
    }
  }

  if(relatedImgContent){
    try{
      relatedImgContent = JSON.parse(relatedImgContent);
      if (!Array.isArray(relatedImgContent)) return res.send(errResponse(baseResponse.INVALID_RELTAED_IMAGE_CONTENT_FORMAT));
      if (relatedImgContent.length > 5) return res.send(errResponse(baseResponse.NUMBER_EXCEED_RELATED_IMAGE_CONTENT));
    }catch(err){
      return res.send(errResponse(baseResponse.INVALID_RELTAED_IMAGE_CONTENT_FORMAT));
    }
  }

  if(relatedImgContentEng){
    try{
      relatedImgContentEng = JSON.parse(relatedImgContentEng);
      if (!Array.isArray(relatedImgContentEng)) return res.send(errResponse(baseResponse.INVALID_RELTAED_IMAGE_CONTENT_ENG_FORMAT));
      if (relatedImgContentEng.length > 5) return res.send(errResponse(baseResponse.NUMBER_EXCEED_RELATED_IMAGE_CONTENT_ENG));
    }catch(err){
      return res.send(errResponse(baseResponse.INVALID_RELTAED_IMAGE_CONTENT_ENG_FORMAT));
    }
  }

  //개수 예외처리(관련 영상)
  params = [id];
  const originalRelatedVideoLength = await productProvider.getOriginalRelatedVideoLength(params);
  if (originalRelatedVideoLength === false) return res.send(errResponse(baseResponse.DB_ERROR));

  if (relatedVideoUrl && relatedVideoThumbnail){
    if (relatedVideoUrl.length > relatedVideoThumbnail.length) return res.send(errResponse(baseResponse.RELATED_VIDEO_THUMBNAIL_LENGTH_NOT_MATCHED));
    else if (relatedVideoUrl.length < relatedVideoThumbnail.length)return res.send(errResponse(baseResponse.RELATED_VIDEO_URL_LENGTH_NOT_MATCHED));
    }
  else if (relatedVideoUrl){
    if (originalRelatedVideoLength === 0){
      return res.send(errResponse(baseResponse.RELATED_VIDEO_THUMBNAIL_LENGTH_NOT_MATCHED));
    }
    if (relatedVideoUrl.length !== originalRelatedVideoLength) return res.send(errResponse(baseResponse.RELATED_VIDEO_URL_LENGTH_NOT_MATCHED));
  }
  else if (relatedVideoThumbnail){
    if (originalRelatedVideoLength === 0){
      return res.send(errResponse(baseResponse.RELATED_VIDEO_URL_LENGTH_NOT_MATCHED));
    }
    if (relatedVideoThumbnail.length !== originalRelatedVideoLength) return res.send(errResponse(baseResponse.RELATED_VIDEO_THUMBNAIL_LENGTH_NOT_MATCHED));
  }

  //개수 예외처리(관련 이미지)
  parmas = [id];
  const originalRelatedImageLength = await productProvider.getOriginalRelatedImageLength(params);
  if (originalRelatedImageLength === false) return res.send(errResponse(baseResponse.DB_ERROR));

  if (relatedImgUrl && relatedImgContent && relatedImgContentEng){
    const maxLength = Math.max(relatedImgUrl.length, relatedImgContent.length, relatedImgContentEng.length);
    if (relatedImgUrl.length !== maxLength) return res.send(errResponse(baseResponse.RELATED_IMAGE_URL_LENGTH_NOT_MATCHED));
    if (relatedImgContent.length !== maxLength) return res.send(errResponse(baseResponse.RELATED_IMAGE_CONTENT_LENGTH_NOT_MATCHED));
    if (relatedImgContentEng.length !== maxLength) return res.send(errResponse(baseResponse.RELATED_IMAGE_CONTENT_ENG_LENGTH_NOT_MATCHED));
  }
  else if (relatedImgUrl && relatedImgContent){
    if (originalRelatedImageLength === 0){
      return res.send(errResponse(baseResponse.RELATED_IMAGE_CONTENT_ENG_LENGTH_NOT_MATCHED));
    }
    if (relatedImgUrl.length !== originalRelatedImageLength) return res.send(errResponse(baseResponse.RELATED_IMAGE_URL_LENGTH_NOT_MATCHED));
    if (relatedImgContent.length !== originalRelatedImageLength) return res.send(errResponse(baseResponse.RELATED_IMAGE_CONTENT_LENGTH_NOT_MATCHED));
  }
  else if (relatedImgUrl && relatedImgContentEng){
    if (originalRelatedImageLength === 0){
      return res.send(errResponse(baseResponse.RELATED_IMAGE_CONTENT_LENGTH_NOT_MATCHED));
    }
    if (relatedImgUrl.length !== originalRelatedImageLength) return res.send(errResponse(baseResponse.RELATED_IMAGE_URL_LENGTH_NOT_MATCHED));
    if (relatedImgContentEng.length !== originalRelatedImageLength)  return res.send(errResponse(baseResponse.RELATED_IMAGE_CONTENT_ENG_LENGTH_NOT_MATCHED));
  }
  else if (relatedImgContent && relatedImgContentEng){
    if (originalRelatedImageLength === 0){
      return res.send(errResponse(baseResponse.RELATED_IMAGE_URL_LENGTH_NOT_MATCHED));
    }
    if (relatedImgContent.length !== originalRelatedImageLength) return res.send(errResponse(baseResponse.RELATED_IMAGE_URL_LENGTH_NOT_MATCHED));
    if (relatedImgContentEng.length !== originalRelatedImageLength)  return res.send(errResponse(baseResponse.RELATED_IMAGE_CONTENT_ENG_LENGTH_NOT_MATCHED));
  }
  else if (relatedImgUrl){
    if (originalRelatedImageLength === 0){
      return res.send(errResponse(baseResponse.RELATED_IMAGE_CONTENT_LENGTH_NOT_MATCHED));
    }
    if (relatedImgUrl.length !== originalRelatedImageLength) return res.send(errResponse(baseResponse.RELATED_IMAGE_URL_LENGTH_NOT_MATCHED));
  }
  else if (relatedImgContent){
    if (originalRelatedImageLength === 0){
      return res.send(errResponse(baseResponse.RELATED_IMAGE_URL_LENGTH_NOT_MATCHED));
    }
    if (relatedImgContent.length !== originalRelatedImageLength) return res.send(errResponse(baseResponse.RELATED_IMAGE_CONTENT_LENGTH_NOT_MATCHED));
  }
  else if (relatedImgContentEng){
    if (originalRelatedImageLength === 0){
      return res.send(errResponse(baseResponse.RELATED_IMAGE_URL_LENGTH_NOT_MATCHED));
    }
    if (relatedImgContentEng.length !== originalRelatedImageLength) return res.send(errResponse(baseResponse.RELATED_IMAGE_CONTENT_ENG_LENGTH_NOT_MATCHED));
  }

  let nomalParams = [];
  if (name || nameEng || snsTag || snsTagEng){
    nomalParams = [name, nameEng, snsTag, snsTagEng, id];
  }
  let menualParams = [];
  if (menualUrl || menualThumbnail || menualContent || menualContentEng){
    menualParams = [menualUrl, menualThumbnail, menualContent, menualContentEng, id, 'A'];
  }
  let vrParams = [];
  if (vrUrl || vrThumbnail || vrContent || vrContentEng){
    vrParams = [vrUrl, vrThumbnail, vrContent, vrContentEng, id, 'V'];
  }

  let relatedVideoParams = [];
  if (!relatedVideoUrl) relatedVideoUrl = [];
  if (!relatedVideoThumbnail) relatedVideoThumbnail = [];
  relatedVideoParams = [id, relatedVideoUrl, relatedVideoThumbnail];

  let relatedImageParams = [];
  if (!relatedImgUrl) relatedImgUrl = [];
  if (!relatedImgContent) relatedImgContent = [];
  if (!relatedImgContentEng) relatedImgContentEng = [];
  relatedImageParams = [id, relatedImgUrl, relatedImgContent, relatedImgContentEng];

  const updateProduct = await productService.updateProduct(
    nomalParams, menualParams, vrParams, relatedVideoParams, relatedImageParams);
  if (updateProduct === false) return res.send(errResponse(baseResponse.DB_ERROR));

  return res.send(response(baseResponse.SUCCESS));
}

//상품 삭제
//[DELETE] /admin/products/:id
exports.deleteProduct = async function(req, res){
  const {id} = req.params;
  let params = [id];
  const isValidProductId = await productProvider.isValidProductId(params);
  if (isValidProductId === 0) return res.send(errResponse(baseResponse.INVALD_PRODUCT_ID));
  else if (isValidProductId === false) return res.send(errResponse(baseResponse.DB_ERROR));

  const deleteProduct = await productService.deleteProduct(params);
  if (!deleteProduct) return res.send(errResponse(baseResponse.DB_ERROR));

  return res.send(response(baseResponse.SUCCESS));
}
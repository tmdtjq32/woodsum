const contentProvider = require("../../webAdmin/Content/contentProvider");
const contentService = require("../../webAdmin/Content/contentService");
const baseResponse = require("../../../config/adminBaseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

//컨텐츠 조회
//[GET] admin/contents
exports.getCategory = async function(req, res){
  const {title, language} = req.query;
  if (!title){
    return res.send(errResponse(baseResponse.EMPTY_CATEGORY));
  }
  if (title !== 'vr' && title !== 'video' && title !== 'image'){
    return res.send(errResponse(baseResponse.INVALID_CATEGORY));
  }

  if (language){
    if (language!=='ko' && language!=='en'){
      return res.send(errResponse(baseResponse.INVALID_LANGUAGE));
    }
  }

  let content = [];
  let params;
  let categoryList;

  if (title === 'vr' || title === 'video'){
    (title === 'vr') ? params = ['V'] : params = ['M'];

    categoryList = await contentProvider.retrieveCategoryVrOrVideoList(params);

    if (!categoryList) return res.send(errResponse(baseResponse.DB_ERROR));
    if (categoryList.length === 0) {
      if (title === 'vr') return res.send(errResponse(baseResponse.CATEGORY_VR_EMPTY));
      else if (title === 'video') res.send(errResponse(baseResponse.CATEGORY_VIDEO_EMPTY));
    }

    categoryList.forEach(item => {
      content.push({
        'id': item.categoryMediaIdx,
        'name': (language === 'en') ? item.nameEng : item.name,
        'categoryTitle': title,
        'createdAt': item.createdAt
      })
    })
  }
  else if (title === 'image'){
    categoryList = await contentProvider.retrieveCategoryImageList();
    if (!categoryList) return res.send(errResponse(baseResponse.DB_ERROR));
    if (categoryList.length === 0) res.send(errResponse(baseResponse.CATEGORY_IMAGE_EMPTY));

    categoryList.forEach(item => {
      content.push({
        'id': item.categoryPictureIdx,
        'name': (language === 'en') ? item.nameEng : item.name,
        'categoryTitle': title,
        'createdAt': item.createdAt
      })
    })
  }

  let result = {content};

  return res.send(response(baseResponse.SUCCESS, result));
}

//컨텐츠 상세 조회
//[GET] admin/contents/:id
exports.getCategoryDetail = async function(req, res){
  const {title} = req.query;
  const {id} = req.params;

  if (!title) return res.send(errResponse(baseResponse.EMPTY_CATEGORY));

  if (title !== 'vr' && title !== 'video' && title !== 'image'){
    return res.send(errResponse(baseResponse.INVALID_CATEGORY));
  }

  let isValidCategoryId;
  let params;

  if (title === 'vr'){
    params = ['V', id];
    isValidCategoryId = await contentProvider.isValidCategoryMediaId(params);
  }
  else if (title === 'video'){
    params = ['M', id];
    isValidCategoryId = await contentProvider.isValidCategoryMediaId(params);
  }
  else if (title === 'image'){
    params = [id];
    isValidCategoryId = await contentProvider.isValidCategoryImageId(params);
  }

  if (isValidCategoryId === false) return res.send(errResponse(baseResponse.DB_ERROR));
  if (isValidCategoryId === 0){
    if (title === 'vr') return res.send(errResponse(baseResponse.INVALID_CATEGORY_VR_ID));
    else if (title === 'video') return res.send(errResponse(baseResponse.INVALID_CATEGORY_VIDEO_ID));
    else if (title === 'image') return res.send(errResponse(baseResponse.INVALID_CATEGORY_IMAGE_ID));
  }

  let result = {};
  let vr = {};
  let video = {};
  let image = {};
  let categoryDetail;

  if (title === 'vr'){
    parmas = ['V', id];
    categoryDetail = await contentProvider.getCategoryMediaDetail(params);
    if (!categoryDetail) return res.send(errResponse(baseResponse.DB_ERROR));

    vr.id = categoryDetail.categoryMediaIdx;
    vr.name = categoryDetail.name;
    vr.nameEng = categoryDetail.nameEng;
    vr.thumbnail = categoryDetail.thumbnail;
    vr.videoUrl = categoryDetail.videoUrl;
    vr.content = categoryDetail.content;
    vr.contentEng = categoryDetail.contentEng;
    vr.createdAt = categoryDetail.createdAt;
    
    result = {vr};
  }
  else if (title === 'video'){
    params = ['M', id];
    categoryDetail = await contentProvider.getCategoryMediaDetail(params);
    if (!categoryDetail) return res.send(errResponse(baseResponse.DB_ERROR));

    video.id = categoryDetail.categoryMediaIdx;
    video.name = categoryDetail.name;
    video.nameEng = categoryDetail.nameEng;
    video.thumbnail = categoryDetail.thumbnail;
    video.videoUrl = categoryDetail.videoUrl;
    video.content = categoryDetail.content;
    video.contentEng = categoryDetail.contentEng;
    video.createdAt = categoryDetail.createdAt;

    result = {video};
  }
  else if (title === 'image'){
    params = [id];
    categoryDetail = await contentProvider.getCategoryImageDetail(params);
    if (!categoryDetail) return res.send(errResponse(baseResponse.DB_ERROR));

    image.id = categoryDetail.categoryPictureIdx;
    image.name = categoryDetail.name;
    image.nameEng = categoryDetail.nameEng;
    image.imgUrl = categoryDetail.imgUrl;
    image.content = categoryDetail.content;
    image.contentEng = categoryDetail.contentEng;
    image.createdAt = categoryDetail.createdAt;

    result = {image};
  }
  return res.send(response(baseResponse.SUCCESS, result));
}

//컨텐츠 등록
//[POST] admin/contents
exports.uploadCategory = async function(req, res){
  const {title, name, nameEng, imageUrl, content, contentEng, videoUrl} = req.body;

  if (!title) return res.send(errResponse(baseResponse.EMPTY_CATEGORY));
  else if (!(title === 'vr' || title === 'video' || title === 'image')) return res.send(errResponse(baseResponse.INVALID_CATEGORY));
  else if (!name) return res.send(errResponse(baseResponse.EMPTY_CATEGORY_NAME));
  else if (!nameEng) return res.send(errResponse(baseResponse.EMPTY_CATEGORY_NAMEENG));
  else if (!imageUrl){
    if (title === 'vr' || title === 'video') return res.send(errResponse(baseResponse.EMPTY_CATEGORY_THUMBNAIL));
    else if (title === 'image') return res.send(errResponse(baseResponse.EMPTY_CATEGORY_IMAGEURL));
  }
  else if (!content) return res.send(errResponse(baseResponse.EMPTY_CATEGORY_CONTENT));
  else if (!contentEng) return res.send(errResponse(baseResponse.EMPTY_CATEGORY_CONTENTENG));
  
  if (name.length > 200) return res.send(errResponse(baseResponse.EXCEED_CATEGORY_NAME));
  else if (nameEng.length > 200) return res.send(errResponse(baseResponse.EXCEED_CATEGORY_NAMEENG));
  else if (content.length > 2000) return res.send(errResponse(baseResponse.EXCEED_CATEGORY_CONTENT));
  else if (contentEng.length > 200) return res.send(errResponse(baseResponse.EXCEED_CATEGORY_CONTENTENG));

  let params;

  if (title === 'vr'){
    if (!videoUrl) return res.send(errResponse(baseResponse.EMPTY_CATEGORY_VIDEOURL));

    params = [name, nameEng, content, contentEng, videoUrl, imageUrl, 'V'];

    const newCategoryVr = await contentService.uploadCategoryVrOrVideo(params);
    if (!newCategoryVr){
      return res.send(errResponse(baseResponse.DB_ERROR));
    }
    return res.send(response(baseResponse.SUCCESS));
  }
  else if (title === 'video'){
    if (!videoUrl) return res.send(errResponse(baseResponse.EMPTY_CATEGORY_VIDEOURL));
    
    params = [name, nameEng, content, contentEng, videoUrl, imageUrl, 'M'];

    const newCategoryVideo = await contentService.uploadCategoryVrOrVideo(params);
    if (!newCategoryVideo){
      return res.send(errResponse(baseResponse.DB_ERROR));
    }
    return res.send(response(baseResponse.SUCCESS));
  }
  else if (title === 'image'){
    params = [name, nameEng, content, contentEng, imageUrl];

    const newCategoryImage = await contentService.uploadCategoryImage(params);
    if (!newCategoryImage){
      return res.send(errResponse(baseResponse.DB_ERROR));
    }
    return res.send(response(baseResponse.SUCCESS));
  }
}

//컨텐츠 수정
//[PATCH] admin/contents/:id
exports.updateCategory = async function(req, res){
  const {id} = req.params;
  const {title} = req.body;
  if (!title) return res.send(errResponse(baseResponse.EMPTY_CATEGORY));
  if (!(title === 'vr' || title === 'video' || title === 'image')) return res.send(errResponse(baseResponse.INVALID_CATEGORY));
  
  let validCategoryId;
  let params;

  if (title === 'vr'){
    params = ['V', id];

    validCategoryId = await contentProvider.isValidCategoryMediaId(params);
    if (validCategoryId === 0) return res.send(errResponse(baseResponse.INVALID_CATEGORY_VR_ID));
  }
  else if (title === 'video'){
    params = ['M', id];

    validCategoryId = await contentProvider.isValidCategoryMediaId(params);
    if (validCategoryId === 0) return res.send(errResponse(baseResponse.INVALID_CATEGORY_VIDEO_ID));
  }
  else if (title === 'image'){
    params = [id];

    validCategoryId = await contentProvider.isValidCategoryImageId(params);
    if (validCategoryId === 0) return res.send(errResponse(baseResponse.INVALID_CATEGORY_IMAGE_ID));
  }

  if (validCategoryId === false) return res.send(errResponse(baseResponse.DB_ERROR));

  const {name, nameEng, imageUrl, content, contentEng, videoUrl} = req.body;
  if (!(name || nameEng || imageUrl || content || contentEng || videoUrl)) return res.send(errResponse(baseResponse.EMPTY_UPDATE_CONTENT));
  
  if (name && name.length > 200) return res.send(errResponse(baseResponse.EXCEED_CATEGORY_NAME));
  else if (nameEng && nameEng.length > 200) return res.send(errResponse(baseResponse.EXCEED_CATEGORY_NAMEENG));
  else if (content && content.length > 2000) return res.send(errResponse(baseResponse.EXCEED_CATEGORY_CONTENT));
  else if (contentEng && contentEng.length > 2000) return res.send(errResponse(baseResponse.EXCEED_CATEGORY_CONTENTENG));
  
  if (name === '') return res.send(errResponse(baseResponse.EMPTY_CATEGORY_NAME));
  else if (nameEng === '') return res.send(errResponse(baseResponse.EMPTY_CATEGORY_NAMEENG));
  else if (content === '') return res.send(errResponse(baseResponse.EMPTY_CATEGORY_CONTENT));
  else if (contentEng === '') return res.send(errResponse(baseResponse.EMPTY_CATEGORY_CONTENTENG));
  
  if (title === 'vr' || title === 'video'){
    if (imageUrl === '') return res.send(errResponse(baseResponse.EMPTY_CATEGORY_THUMBNAIL));
    else if (videoUrl === '') return res.send(errResponse(baseResponse.EMPTY_CATEGORY_VIDEOURL));

    params = [name, nameEng, imageUrl, content, contentEng, videoUrl, id];
    const updateCategoryVrOrVideo = await contentService.updateCategoryMedia(params);
    if (!updateCategoryVrOrVideo) return res.send(errResponse(baseResponse.DB_ERROR));

    return res.send(response(baseResponse.SUCCESS));
  }
  else if (title === 'image'){
    if (imageUrl === '') return res.send(errResponse(baseResponse.EMPTY_CATEGORY_IMAGEURL));

    params = [name, nameEng, imageUrl, content, contentEng, id];
    const updateCategoryImage = await contentService.updateCategoryImage(params);
    if (!updateCategoryImage) return res.send(errResponse(baseResponse.DB_ERROR));

    return res.send(response(baseResponse.SUCCESS));
  }
}

//컨텐츠 삭제
//[DELETE] admin/contents/:id
exports.deleteCategory = async function(req, res){
  const {id} = req.params;
  const {title} = req.body;

  if (!title) return res.send(errResponse(baseResponse.EMPTY_CATEGORY));
  if (!(title === 'vr' || title === 'video' || title === 'image')) return res.send(errResponse(baseResponse.INVALID_CATEGORY));
  
  let validCategoryId;
  let params;

  if (title === 'vr'){
    params = ['V', id];

    validCategoryId = await contentProvider.isValidCategoryMediaId(params);
    if (validCategoryId === 0) return res.send(errResponse(baseResponse.INVALID_CATEGORY_VR_ID));
  }
  else if (title === 'video'){
    params = ['M', id];

    validCategoryId = await contentProvider.isValidCategoryMediaId(params);
    if (validCategoryId === 0) return res.send(errResponse(baseResponse.INVALID_CATEGORY_VIDEO_ID));
  }
  else if (title === 'image'){
    params = [id];

    validCategoryId = await contentProvider.isValidCategoryImageId(params);
    if (validCategoryId === 0) return res.send(errResponse(baseResponse.INVALID_CATEGORY_IMAGE_ID));
  }

  if (validCategoryId === false) return res.send(errResponse(baseResponse.DB_ERROR));

  let deleteCategory;
  params = [id];

  if (title == 'vr' || title === 'video'){
    deleteCategory = await contentService.deleteCategoryMedia(params);
  }
  else if (title === 'image'){
    deleteCategory = await contentService.deleteCategoryImage(params);
  }

  if (!deleteCategory) return res.send(errResponse(baseResponse.DB_ERROR));
  return res.send(response(baseResponse.SUCCESS));
}
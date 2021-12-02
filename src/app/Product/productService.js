const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const jwt = require("jsonwebtoken");
const secret_config = require("../../../config/secret");
const userProvider = require("./productProvider");
const userDao = require("./productDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");
const {connect} = require("http2");
const security = require("../../../utils/security");

// Service Create, Update, Delete 의 로직 처리

exports.createUser = async function (email, password, nickname) {
    try {
        // 이메일 중복 확인
        const emailRows = await userProvider.emailCheck(email);
        if (emailRows.length > 0) return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);

        // 닉네임 중복 확인
        const nicknameRows = await userProvider.nicknameCheck(nickname);
        console.log(nicknameRows)
        if (nicknameRows.length > 0)
            return errResponse(baseResponse.SIGNUP_REDUNDANT_NICKNAME);

        // 비밀번호 암호화
        // TODO: 비밀번호 Hashing 로직 추가
        const securityData = security.saltHashPassword(password);

        const userHashedPassword = securityData.hashedPassword;
        const userSalt = securityData.salt;

        // TODO: hashedPassword, salt 모두 집어넣기
        const insertUserInfoParams = [email, userHashedPassword, nickname];

        // Transaction 예제
        // 회원가입 동시에 Level 테이블에도 컬럼 추가
        const connection = await pool.getConnection(async (conn) => conn);
        try {
            await connection.beginTransaction(); // START TRANSACTION

            // 1) UserInfo 테이블에 데이터 추가
            const userIdResult = await userDao.insertUserInfo(connection, insertUserInfoParams);
            const userIdx = userIdResult[0].insertId;

            console.log(`추가된 회원 : ${userIdResult[0].insertId}`)

            // 2) UserSalt 테이블에 데이터 추가
            const insertUserSaltParams = [userIdx, userSalt];
            await userDao.insertUserSalt(connection, insertUserSaltParams);

            // 3) Level 테이블 추가
            // await userDao.insertUserLevel(connection, userIdResult[0].insertId);


            await connection.commit(); // COMMIT
            connection.release();
            return response(baseResponse.SUCCESS);

        } catch (err) {
            connection.rollback(); //ROLLBACK
            connection.release();
            logger.error(`App - createUser Transaction error\n: ${err.message}`);
            return errResponse(baseResponse.DB_ERROR);
        }
    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.postSignIn = async function (email, password) {
    try {
        // 이메일 확인
        const emailRows = await userProvider.emailCheck(email);
        if (emailRows.length < 1) return errResponse(baseResponse.SIGNIN_USERINFO_WRONG)

        // TODO: userIdx 가져오기
        const userIdx = emailRows[0].userIdx

        // 계정 상태 확인
        const userInfoRows = await userProvider.accountCheck(email);

        if (userInfoRows[0].status === "INACTIVE") {
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        } else if (userInfoRows[0].status === "DELETED") {
            return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
        }

        const userSecurityData = await userProvider.retrieveUserHashedPasswordAndSalt(userIdx);

        const salt = userSecurityData.salt;
        const hashedPassword = userSecurityData.hashedPassword;

        const isValidate = security.validatePassword(password, salt, hashedPassword);
        if (isValidate === false) {
            return errResponse(baseResponse.SIGNIN_USERINFO_WRONG);
        }

        console.log(userInfoRows[0].userIdx)
        //토큰 생성 Service
        let token = await jwt.sign(
            {
                userInfo: userInfoRows[0].userIdx,
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀 키
            {
                expiresIn: "365d",
                subject: "userInfo",
            } // 유효 시간은 365일
        );

        return response(baseResponse.SUCCESS, token);

    } catch (err) {
        logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.editUser = async function (userIdx, nickname) {
    try {
        console.log(userIdx)
        const connection = await pool.getConnection(async (conn) => conn);
        const editUserResult = await userDao.updateUserInfo(connection, userIdx, nickname)
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.editUserStatus = async function (userIdx, status) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const editUserStatusResult = await userDao.updateUserStatus(connection, userIdx, status)
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editUserStatus Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}


exports.getUserFindById = async function (userIdx) {
    try {
        // 이메일 중복 확인
        const userInfo = await userProvider.findByUserId(userIdx);
        if (userInfo.length === 0) return errResponse(baseResponse.USER_USERID_NOT_EXIST);

        return response(baseResponse.SUCCESS, userInfo);

    } catch (err) {
        logger.error(`App - getUserFindById Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.getUserFindByEmail = async function (email) {
    try {
        // 이메일 확인
        const userInfo = await userProvider.findByUserEmail(email);
        if (userInfo.length === 0) return errResponse(baseResponse.USER_USEREMAIL_NOT_EXIST);

        return response(baseResponse.SUCCESS, userInfo);

    } catch (err) {
        logger.error(`App - getUserFindByEmail Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }

}
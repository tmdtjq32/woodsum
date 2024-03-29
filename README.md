# Folder Structure

```
.
├── config                  			# 설정 파일들이 들어가 있는 폴더
│   ├── database.js         			# 데이터베이스 관련 설정
│   ├── express.js           
│   ├── jwtMiddleware.js            
│   ├── secret.js              
│   ├── winston.js 						# 로거 라이브러리 설정
    ├── log                     		# 생성된 로그 파일 
├── node_modules                    	# 노드 모듈  
├── src                     			# 
│   ├── app              				# 앱에 대한 코드 작성
│ 	│   ├── User            			# User 관련 코드
│   │ 	│   ├── userDao.js          	# User 관련 데이터베이스
│ 	│ 	│   ├── userController.js 		# req, res 처리
│ 	│ 	│   ├── userProvider.js   		# R에 해당하는 서버 로직 처리
│ 	│ 	│   ├── userService.js   		# CUD에 해당하는 서버 로직 처리
│   ├── web              				# 웹 서버 생성시에 작성 (기본 구조는 app과 같이 진행)         
│   ├── webAdmin             			# 웹 어드민 서버 생성시에 작성(기본 구조는 app과 같이 진행)
├── utils
│   ├── security.js              		# 비밀번호 암호화(SHA512, Salt, HASH) 관련 모듈                     		     
├── .gitignore                     		# git 에 포함되지 않아야 하는 폴더, 파일들을 작성 해놓는 곳
├── index.js                     		
├── package-lock.json              	 
├── package.json                    # 프로그램 이름, 버전, 필요한 모듈 등 노드 프로그램의 정보를 기술
└── README.md
```

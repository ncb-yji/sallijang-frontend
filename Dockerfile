# 1단계: 빌드 단계 (Build Stage)
FROM node:20-alpine AS build

WORKDIR /app

# 의존성 설치 (캐시 활용을 위해 package.json 먼저 복사)
COPY package*.json ./
RUN npm install

# 소스 코드 복사 및 빌드
COPY . .
RUN npm run build

# 2단계: 실행 단계 (Production Stage)
FROM nginx:stable-alpine

# 빌드 단계에서 생성된 정적 파일들을 Nginx의 기본 배포 경로로 복사
# (일반적으로 dist 또는 build 폴더입니다. 프로젝트 설정에 맞춰 수정하세요)
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx 기본 포트인 80번 오픈
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
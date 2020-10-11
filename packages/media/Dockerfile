#BUILDER
FROM node:12.16.1-alpine3.9 as builder

COPY ./media-backend /workspace/media-backend
COPY ./media-frontend /workspace/media-frontend

#API
WORKDIR /workspace/media-backend
RUN npm install
RUN npm run build

#Frontend
WORKDIR /workspace/media-frontend
RUN npm install
RUN npm run build

#RUNNER
FROM node:12.16.1-alpine3.9

RUN apk add bash
RUN npm install pm2 -g

COPY --from=builder /workspace/media-backend/dist /app
COPY --from=builder /workspace/media-frontend/dist /app/web

WORKDIR /app
RUN npm install --only=production

ENTRYPOINT ["pm2-runtime", "start", "index.js", "--name", "dracul-media"]
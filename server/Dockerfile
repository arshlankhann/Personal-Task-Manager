FROM node

ENV MONGODB_USERNAME=admin \
    MONGODB_PASSEORD=qwerty

RUN mkdir -p PersonalTaskManager/server

COPY . /PersonalTaskManager/server

CMD ["node", "/PersonalTaskManager/server/index.js"]
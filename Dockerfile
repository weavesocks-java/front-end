FROM iad.ocir.io/odx-stateservice/test/coherence:14.1.1.0.0-b74871
ENV NODE_ENV "production"
ENV PORT 8079
EXPOSE 8079

USER root

# Prepare app directory
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
#COPY yarn.lock /usr/src/app/
RUN npm install

COPY . /usr/src/app

# Start the app
CMD ["/usr/bin/npm", "start"]

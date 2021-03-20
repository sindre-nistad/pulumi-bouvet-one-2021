FROM asciidoctor/docker-asciidoctor AS compile

COPY . /documents

RUN mkdir -p dist && \
    asciidoctor-revealjs *.adoc && \
    mv *.html dist

FROM node:lst-alpine AS prod

RUN npm install -g serve

USER node
COPY --from=compile --chown=node:node /documents/dist .

CMD ["serve", "dist"]

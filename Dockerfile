FROM node:alpine
WORKDIR /app
RUN mkdir /codedir
COPY . .
EXPOSE 8080
ENTRYPOINT ["node", "a.js"]
CMD ["/codedir"]

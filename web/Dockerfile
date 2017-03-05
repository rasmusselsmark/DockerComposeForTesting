# our base image
FROM node:7.4

# environment
ENV WORK_DIR /DockerForTesting
WORKDIR $WORK_DIR

# files included in image/container
# as Docker caches the intermediate built images, order matters
COPY package.json $WORK_DIR/
RUN  npm install

COPY server/ $WORK_DIR/server/
COPY Makefile $WORK_DIR/

# we're by default using port 8888
EXPOSE 8888

# the command invoked when calling `docker run`
ENTRYPOINT ["make", "run-server"]

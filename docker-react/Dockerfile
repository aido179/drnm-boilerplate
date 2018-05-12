FROM node:8

# Set the working directory to /app
WORKDIR /app
# Define environment variable
ENV NODE_ENV production

#copy package first, so caching is more efficient
COPY package.json package.json
# Make port 3000 available to the world outside this container
EXPOSE 5000

RUN npm install react-scripts@1.1.1 -g --quiet
RUN npm install serve -g --quiet
RUN npm install --quiet

# Copy the current directory contents into the container at /app
ADD . /app
# Build the app
RUN npm run build

# Run app when the container launches
CMD ["serve", "-s", "build"]

USER node

FROM node:8
# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
ADD . /app

#install pm2 to manage node processes
RUN npm install pm2 -g
# Install any needed packages specified in requirements.txt
RUN npm install --production

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Define environment variable
ENV NODE_ENV production

# Run app when the container launches
CMD ["pm2-runtime", "src/index.js"]

USER node

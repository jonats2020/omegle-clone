# Omegle Clone

Clone of Omegle web app, a popular random video chat

## Development
1. Clone the repository to your computer
2. Go to the root folder and install the node modules
```
cd omegle-clone && npm install
```
3. Run the server
```
nodemon index.js
```
4. Open another terminal and go to the client folder under the root folder and install the packages
```
cd client && npm install
```
5. In App.js, change the following URL to http://localhost:5000
```
const socket = io(URL);
```

```
const callRandomUser = async () => {
    const response = await fetch(URL);
    ...
}
```
6. Run the React app by running npm start in the terminal
```
npm start
```

## Contributing
So you want to contribute? Yay! Great! Fun! I love seeing new PRs for this project. That being said, not every pull request will be merged. The general guidelines I'll follow are:

Does it make developing the project easier?
Does it fix a bug?
Does it break anything?
Does it stick to the original goal of the project?
Does it reduce the build size?
Is it necessary?
Regarding that last point, I don't expect all pull requests to be absolutely necessary. New features are good. That being said, if the new features make the app unnecessarily complex in some way without bringing value to the users, it won't be merged.

Please don't be hurt if your PR isn't merged. I appreciate you for working on it. If you are thinking about working on something, feel free to make an issue beforehand so that you can make sure it'll be worth your time!

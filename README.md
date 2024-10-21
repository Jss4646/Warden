<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="readme-images/WARDEN.svg" alt="Logo" width="400">
  </a>

<h3 align="center">Warden</h3>

  <p align="center">
    A visual regression tool used to compare screenshots of web pages. 
</div>

<!-- ABOUT THE PROJECT -->
## About The Project

![](/readme-images/dashboard.png "Dashboard screenshot")

Warden is a screenshot regression tool that can be used to crawl a staging site for pages and compare them against the 
live site checking for irregularities. It uses [puppeteer](https://pptr.dev/) to take screenshots then compares them
using a library called [img-diff-js](https://github.com/reg-viz/img-diff-js). The other major library I used was 
[puppeteer cluster](https://github.com/thomasdondorf/puppeteer-cluster) which acts like a queue for the requested
screenshots. I hope to expand this queue functionality to something like kubernetes to allow for more parallelism 
when running comparisons on multiple sites.

<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites
- [Node v16+](https://nodejs.org/en/)
- [MongoDB](https://www.mongodb.com/try/download/community)

### Installation
1. Clone the repo
   ```sh
   git clone https://git.synotio.se/angrycreative/warden.synotio.se.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Install client dependencies
   ```sh
   cd client && npm install && cd ..
   ```
4. You can run all services at once using `npm start` or I like to run the server in debug mode separately
   ```sh
   npm run server
   npm run css:watch
   npm run database
   npm run client
   ```
5. You should then be able to access the site at `http://localhost:3000`

<!-- CONTACT -->
## Contact

Jack Sandeman - jacksandeman@hotmail.co.uk

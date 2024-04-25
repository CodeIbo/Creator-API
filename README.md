# Creator777 - Full Stack Application

> The goal of application was create ecosystem which one can create content to pages without deploying changes and be scalable as easy as possible. Stack of application include Backend ( **Mysql 8.033** , **Node.js & express** suported via **sequelizer** ). Admin Panel ( **React 18.2** ). Front-End ( **Angular 14.06** ) . Stack is [dockerized](https://www.docker.com/ "dockerized"), for more accessability in diffrent enviroment. Every section is described in separate repository

1. [Panel Admin - Gtihub](https://github.com/Ibonom/Creator777-Admin-panel)
2. [Front-end - Gtihub](https://github.com/Ibonom/Creator777-Front-end)

<br>

# Description Backend (API)

This API project is built on the Node.js with Express framework and supported with Sequelize ORM. It utilizes a MySQL database, version 8.033. This system offers content management capabilities with various endpoints for data handling.

### General Access Structure

All endpoints are publicly accessible, but operations such as modification, addition, or deletion require authentication. The system uses CORS (Cross-Origin Resource Sharing) with appropriate credentials settings to manage access.

### List of Endpoints

- `/auth` - Authentication and user session management.
- `/users` - Managing user information.
- `/pages` - Handling pages within the system.
- `/blog` - Managing blogs and blog posts.
- `/article` - Handling articles.
- `/podcast` - Managing podcasts.
- `/episode` - Handling podcast episodes.
- `/image` - Managing images.
- `/url` - Handling routing in front-end application.

### Security

Authorization for modifications, additions, and deletions is managed through token mechanisms. Users must be logged in to receive a token, which then must be included in request headers.

### API Testing with Postman

For efficient testing of API endpoints, I have prepared a Postman collection file named `api.postman_collection.json`. This file contains pre-configured requests that you can use directly after importing it into Postman. The requests are organized into folders for ease of navigation, and each request is set up with JWT authorization where necessary to ensure you can test secured endpoints effectively.

## Installation

### Step by Step

1. Clone the repository:&nbsp; `git clone [repository-url]`
2. Create file **.env** based on **env.example** and fill all positions. If you don't have install [Docker Engine](https://docs.docker.com/get-docker/ )
3. Create containers based on docker-compose.yml:&nbsp; `docker compose up`
4. Attach shell to container **blogapi-node-server**:&nbsp; `docker exec -it `
5. Install dependencies
6. Execute commands:&nbsp; `npm run db-dev:seed` &nbsp; `npm run start:dev`
7. Start Server:&nbsp; `npm run start:dev`

Now you can work on development enviroment, server is autorefreshing always when detect changes in files.

❗**WARNING** sometimes after first time instalation packages you will get error (*error:something went wrong installing the "sharp" module cannot find module*). Just use command: `npm rebuild --verbose sharp` . More information about this issue, you can find [there](https://github.com/gatsbyjs/gatsby/issues/24559)

### Importing the Collection into Postman

1. Open Postman
2. Click on `File` in the top left corner.
3. Select `Import....`
4. Choose File and drag the `api.postman_collection.json` file or use the file picker to locate and select the file.
5. Once imported, you will see all the organized requests grouped by folders in the Postman sidebar.

## TODO

- [ ] **Writing Tests**: Develop and write tests to ensure all components function correctly and meet expected behaviors. This will improve reliability and stability across the application.

- [ ] **Spotify API Integration**: Develop a solution for integrating the Spotify API with the application. This includes combining Spotify data with data from the 'podcast' and 'episodes' tables to create a cohesive experience.

- [ ] **Database Seeding Improvements**: Improve the seed:all command to ensure proper integration with Sequelize. This task focuses on enhancing data seeding processes to be more reliable and efficient.

- [ ] **Webpack Configuration**: Set up and configure Webpack to optimize the bundling process. This will streamline the development and deployment of resources, enhancing performance and maintainability.

- [ ] **Server Deployment Experience**: Enhance the server deployment process to increase automation using specific commands. The goal is to make deployment smoother and more predictable, reducing manual intervention.

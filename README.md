# Creator777 - Full Stack Application

> The goal of application was create ecosystem which one can create content to pages without deploying changes and be scalable as easy as possible. Stack of application include Backend ( **Mysql 8.033** , **Node.js & express** suported via **sequelizer** ). Admin Panel ( **React 18.2** ). Front-End ( **Angular 14.06** ) . Stack is [dockerized](https://www.docker.com/ "dockerized"), for more accessability in diffrent enviroment. Every section is described in separate repository

1. [Panel Admin - Gtihub](https://github.com/Ibonom/BlogPanel)
2. [Front-end - Gtihub](https://github.com/Ibonom/BlogFrontEnd)

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

## Installation

### Step by Step

1. Clone the repository: &nbsp; `git clone [repository-url]`
2. Create file **.env** based on **env.example** and fill all positions (:heavy_exclamation_mark:Important). If you don't have install [Docker Engine](https://docs.docker.com/get-docker/)
3. Create containers based on docker-compose.yml:&nbsp; `docker compose up`
4. Attach shell to container **blogapi-node-server**:&nbsp; `docker exec -it `
5. Install dependencies
6. Execute commands:&nbsp; `npm run db-dev:seed` &nbsp; `npm run start:dev`
7. Start Server:&nbsp; `npm run start:dev`

Now you can work on development enviroment, server is autorefreshing always when detect changes in files.

:heavy_exclamation_mark:**WARNING** sometimes after first time instalation packages you will get error (_error:something went wrong installing the "sharp" module cannot find module_). Just use command: `npm rebuild --verbose sharp` . More information about this issue, you can find [there](https://github.com/gatsbyjs/gatsby/issues/24559)

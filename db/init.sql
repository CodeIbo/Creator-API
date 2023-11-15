CREATE DATABASE IF NOT EXISTS coredb;
USE coredb;
DROP 
  TABLE IF EXISTS core;
DROP 
  TABLE IF EXISTS users;
DROP 
  TABLE IF EXISTS blog;
CREATE TABLE core (
  id char(36) NOT NULL DEFAULT (UUID()), 
  category VARCHAR(255) DEFAULT NULL, 
  PRIMARY KEY (id), 
  CONSTRAINT UQ_Core_Category UNIQUE (category)
);

INSERT INTO core (category) VALUES ('users');
INSERT INTO core (category) VALUES ('pages');
INSERT INTO core (category) VALUES ('blog');

CREATE TABLE users (
  id char(36) NOT NULL DEFAULT (UUID()), 
  category_name VARCHAR(255) DEFAULT 'users', 
  nick_name VARCHAR(255) DEFAULT NULL, 
  email VARCHAR(255) DEFAULT NULL, 
  user_password VARCHAR(255) DEFAULT NULL,
  access_lvl VARCHAR(255) DEFAULT NULL,
  refresh_token VARCHAR(255) DEFAULT NULL, 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
  PRIMARY KEY (id), 
  CONSTRAINT UQ_Users_Email UNIQUE (email), 
  FOREIGN KEY (category_name) REFERENCES core(category) ON DELETE CASCADE
);
  
CREATE TABLE pages (
  id char(36) NOT NULL DEFAULT (UUID()), 
  category_name VARCHAR(255) DEFAULT 'pages', 
  page_name VARCHAR(255) DEFAULT NULL, 
  page_content TEXT DEFAULT NULL, 
  meta_data_title TEXT DEFAULT NULL, 
  meta_data_description TEXT DEFAULT NULL, 
  page_url VARCHAR(255) DEFAULT NULL, 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
  PRIMARY KEY (id), 
  CONSTRAINT UQ_Pages_Url UNIQUE (page_url), 
  FOREIGN KEY (category_name) REFERENCES core(category) ON DELETE CASCADE
);

CREATE TABLE blog (
  id char(36) NOT NULL DEFAULT (UUID()), 
  category_name VARCHAR(255) DEFAULT 'blog', 
  post_name VARCHAR(255) DEFAULT NULL, 
  post_content TEXT DEFAULT NULL, 
  meta_data_title TEXT DEFAULT NULL, 
  meta_data_description TEXT DEFAULT NULL, 
  post_url VARCHAR(255) DEFAULT NULL,
  post_author VARCHAR(255) DEFAULT NULL,
  post_tags TEXT DEFAULT NULL,  
  publication_date DATE DEFAULT NULL, 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id), 
  CONSTRAINT UQ_Post_Url UNIQUE (post_url), 
  FOREIGN KEY (category_name) REFERENCES core(category) ON DELETE CASCADE
);

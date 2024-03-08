CREATE DATABASE IF NOT EXISTS coredb;
USE coredb ;

-- -----------------------------------------------------
-- Table `users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS coredb.users (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  email VARCHAR(255) NULL DEFAULT NULL,
  nick_name VARCHAR(255) NULL DEFAULT NULL,
  user_password VARCHAR(255) NULL DEFAULT NULL,
  access_lvl VARCHAR(255) NULL DEFAULT NULL,
  refresh_token VARCHAR(255) NULL DEFAULT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE INDEX email_UNIQUE (email ASC) VISIBLE,
  PRIMARY KEY (id) );


-- -----------------------------------------------------
-- Table urls
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS coredb.urls (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  url VARCHAR(255) NOT NULL,
  page_category VARCHAR(255) NOT NULL,
  name VARCHAR(255) NULL,
  meta_data_title VARCHAR(255) NULL,
  meta_data_description VARCHAR(255) NULL,
  keywords VARCHAR(255) NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE INDEX url_UNIQUE (url ASC) VISIBLE,
  UNIQUE INDEX ID_UNIQUE (id ASC) VISIBLE);


-- -----------------------------------------------------
-- Table pages
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS coredb.pages (
  id CHAR(36) NOT NULL,
  page_content TEXT NULL,
  page_type VARCHAR(45) NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX url_id_UNIQUE (id ASC) VISIBLE,
  CONSTRAINT url_id
    FOREIGN KEY (id)
    REFERENCES urls (ID)
    ON DELETE CASCADE
    ON UPDATE CASCADE);


-- -----------------------------------------------------
-- Table blogs
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS coredb.blogs (
  id CHAR(36) NOT NULL,
  blog_title VARCHAR(255) NULL,
  blog_key VARCHAR(36) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX blog_key_UNIQUE (blog_key ASC) VISIBLE,
  CONSTRAINT blog_url
    FOREIGN KEY (id)
    REFERENCES urls (ID)
    ON DELETE CASCADE
    ON UPDATE CASCADE);


-- -----------------------------------------------------
-- Table articles
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS coredb.articles (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  blog_key VARCHAR(36) NOT NULL,
  url VARCHAR(255) NOT NULL,
  author VARCHAR(255) NULL,
  article_title TEXT NULL,
  `lead` TEXT NULL,
  post_tags JSON NOT NULL DEFAULT (CAST('[]' AS JSON)),
  article_content TEXT NULL,
  photo_url VARCHAR(255) NULL,
  date DATE NULL,
  meta_data_title VARCHAR(255) NULL,
  meta_data_description VARCHAR(255) NULL,
  keywords VARCHAR(255) NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE INDEX Id_UNIQUE (id ASC) VISIBLE,
  UNIQUE INDEX url_UNIQUE (url ASC) VISIBLE,
  CONSTRAINT article_key
    FOREIGN KEY (blog_key)
    REFERENCES blogs (blog_key)
    ON DELETE CASCADE
    ON UPDATE CASCADE);

-- -----------------------------------------------------
-- Table podcasts
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS coredb.podcasts (
  id CHAR(36) NOT NULL,
  podcast_key VARCHAR(36) NOT NULL,
  podcast_title VARCHAR(255) NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE,
  UNIQUE INDEX podcast_key_UNIQUE (podcast_key ASC) VISIBLE,
  CONSTRAINT podcast_key_url
    FOREIGN KEY (id)
    REFERENCES urls (ID)
    ON DELETE CASCADE
    ON UPDATE CASCADE);


-- -----------------------------------------------------
-- Table episodes
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS coredb.episodes (
  id CHAR(36) NOT NULL,
  episode_title VARCHAR(255) NULL,
  episode_content TEXT NULL,
  announcement_url VARCHAR(255) NULL,
  url VARCHAR(255) NOT NULL,
  photo_url VARCHAR(255) NULL,
  date DATE NULL,
  author VARCHAR(255) NULL,
  episode_tags JSON NOT NULL DEFAULT (CAST('[]' AS JSON)),
  podcast_key VARCHAR(36) NOT NULL,
  meta_data_title VARCHAR(255) NULL,
  meta_data_description VARCHAR(255) NULL,
  keywords VARCHAR(255) NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX Id_UNIQUE (id ASC) VISIBLE,
  UNIQUE INDEX url_UNIQUE (url ASC) VISIBLE,
  CONSTRAINT episode_key
    FOREIGN KEY (podcast_key)
    REFERENCES podcasts (podcast_key)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
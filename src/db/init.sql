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
  meta_data_description TEXT NULL,
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
  CONSTRAINT page_url
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
  post_tags TEXT NOT NULL DEFAULT('[]'),
  article_content TEXT NULL,
  photo_url VARCHAR(255) NULL,
  date DATE NULL,
  meta_data_title VARCHAR(255) NULL,
  meta_data_description TEXT NULL,
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
  episode_tags TEXT NOT NULL DEFAULT('[]'),
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

-- -----------------------------------------------------
-- Table images
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS coredb.images (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  original_name VARCHAR(36) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  mine_type VARCHAR(255) NOT NULL,
  size VARCHAR(255) NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE,
  UNIQUE INDEX file_name_UNIQUE (file_name ASC) VISIBLE );

-- -----------------------------------------------------
-- Table menu
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS coredb.menu (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  url_id VARCHAR(36) DEFAULT NULL,
  menu_order VARCHAR(255) NOT NULL,
  label VARCHAR(255) NOT NULL,
  parent_id VARCHAR(255) DEFAULT NULL,
  `type` ENUM('parent', 'internal', 'external', 'url') NOT NULL, 
  external_url VARCHAR(255) DEFAULT NULL,
  internal_url VARCHAR(255) DEFAULT NULL,
  target_blank TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE,
    CONSTRAINT menu_url
    FOREIGN KEY (url_id)
    REFERENCES urls (ID)
    ON DELETE CASCADE
    ON UPDATE CASCADE);


-- -----------------------------------------------------
-- Table social_media
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS coredb.social_media (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  `name` VARCHAR(255) NOT NULL,
  available TINYINT(1) NOT NULL DEFAULT(0),
  link VARCHAR(255) DEFAULT NULL,
  title VARCHAR(255) DEFAULT NULL,
  icon VARCHAR(255) NOT NULL,
  `order` INT NOT NULL
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE,
  UNIQUE INDEX icon_UNIQUE (icon ASC) VISIBLE);

-------------------------------------------------------
-- Table settings
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS coredb.settings (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  company_name VARCHAR(255) DEFAULT null,
  logo VARCHAR(255) DEFAULT null,
  logo_alt VARCHAR(255) DEFAULT NULL,
  meta_data_title_global TEXT,
  meta_data_description_global TEXT,
  keywords_global VARCHAR(255) DEFAULT NULL,
  meta_data_suffix_global VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE);

-------------------------------------------------------
-- Table ui_settings
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS coredb.ui_settings (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  element_key VARCHAR(255) NOT NULL,
  element_value: TEXT,
  element_type: VARCHAR(255) NOT NULL,
  element_css: TEXT,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),

)
-- 自定义打卡表迁移脚本
-- 使用方法: mysql -u root -p tutu_db < scripts/add-custom-checkins-table.sql

USE tutu_db;

CREATE TABLE IF NOT EXISTS custom_check_ins (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SELECT 'custom_check_ins 表创建完成！' AS message;

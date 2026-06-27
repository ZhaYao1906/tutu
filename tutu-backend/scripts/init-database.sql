-- 拓图数据库初始化脚本
-- 使用方法: mysql -u root -p < init-database.sql

CREATE DATABASE IF NOT EXISTS tutu_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tutu_db;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(255) DEFAULT '🧭',
    level INT DEFAULT 1,
    title VARCHAR(50) DEFAULT '新手',
    xp INT DEFAULT 0,
    total_xp INT DEFAULT 0,
    spots_visited INT DEFAULT 0,
    quests_completed INT DEFAULT 0,
    achievements_unlocked INT DEFAULT 0,
    streak_days INT DEFAULT 0,
    home_name VARCHAR(100),
    home_location VARCHAR(200),
    company_name VARCHAR(100),
    company_location VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 地点表
CREATE TABLE IF NOT EXISTS spots (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    icon VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    sub VARCHAR(100),
    description TEXT,
    rating INT DEFAULT 0,
    xp INT DEFAULT 0,
    score VARCHAR(10),
    price VARCHAR(50),
    time VARCHAR(50),
    tags JSON,
    type VARCHAR(20) NOT NULL,
    coordinates_x INT NOT NULL,
    coordinates_y INT NOT NULL,
    personal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 用户地点关联表
CREATE TABLE IF NOT EXISTS user_spots (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    spot_id BIGINT NOT NULL,
    visited BOOLEAN DEFAULT FALSE,
    visited_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (spot_id) REFERENCES spots(id),
    UNIQUE KEY unique_user_spot (user_id, spot_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 任务表
CREATE TABLE IF NOT EXISTS quests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    xp INT DEFAULT 0,
    difficulty VARCHAR(20) DEFAULT 'easy',
    category VARCHAR(20) DEFAULT 'work',
    status VARCHAR(20) DEFAULT 'available',
    date VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 记账表
CREATE TABLE IF NOT EXISTS accounts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    type VARCHAR(20) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    note VARCHAR(200),
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 成就表
CREATE TABLE IF NOT EXISTS achievements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    icon VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    xp INT DEFAULT 0,
    category VARCHAR(20) NOT NULL,
    total INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 用户成就关联表
CREATE TABLE IF NOT EXISTS user_achievements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    achievement_id BIGINT NOT NULL,
    progress INT DEFAULT 0,
    unlocked BOOLEAN DEFAULT FALSE,
    unlocked_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (achievement_id) REFERENCES achievements(id),
    UNIQUE KEY unique_user_achievement (user_id, achievement_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 论坛帖子表
CREATE TABLE IF NOT EXISTS forum_posts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    category VARCHAR(50),
    likes INT DEFAULT 0,
    comments INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 帖子点赞表
CREATE TABLE IF NOT EXISTS post_likes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    post_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (post_id) REFERENCES forum_posts(id),
    UNIQUE KEY unique_user_post (user_id, post_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 插入地点数据
INSERT IGNORE INTO spots (icon, name, sub, description, rating, xp, score, price, time, tags, type, coordinates_x, coordinates_y, personal) VALUES
('🏛️', '天安门', '东城区 · 景点', '中华人民共和国的象征，世界上最大的城市广场之一', 5, 100, '5.0', '免费', '2-3小时', '["历史","地标","必去"]', 'scenic', 450, 320, false),
('🏯', '故宫', '东城区 · 景点', '明清两代皇宫，世界文化遗产', 5, 150, '4.9', '60元', '半天', '["历史","文化","必去"]', 'scenic', 450, 315, false),
('🌳', '天坛', '东城区 · 景点', '明清皇帝祭天的场所，世界文化遗产', 5, 120, '4.8', '15元', '2-3小时', '["历史","建筑","公园"]', 'scenic', 520, 380, false),
('🏔️', '八达岭长城', '延庆区 · 景点', '世界七大奇迹之一，中华民族的象征', 5, 200, '4.9', '45元', '全天', '["历史","世界遗产","必去"]', 'scenic', 330, 180, false),
('🌊', '后海', '西城区 · 景点', '北京著名的酒吧街，夜景迷人', 4, 80, '4.5', '免费', '晚上', '["夜生活","酒吧","湖景"]', 'scenic', 360, 350, false),
('🏟️', '鸟巢', '朝阳区 · 景点', '2008年北京奥运会主体育场', 4, 90, '4.6', '50元', '2小时', '["奥运","建筑","地标"]', 'scenic', 560, 340, false),
('💧', '水立方', '朝阳区 · 景点', '2008年北京奥运会游泳馆', 4, 80, '4.5', '30元', '1-2小时', '["奥运","建筑","游泳"]', 'scenic', 565, 335, false),
('🏯', '颐和园', '海淀区 · 景点', '中国现存规模最大、保存最完整的皇家园林', 5, 130, '4.8', '30元', '半天', '["园林","历史","必去"]', 'scenic', 400, 275, false),
('🏛️', '圆明园', '海淀区 · 景点', '清代皇家园林，历史的见证', 4, 100, '4.5', '25元', '半天', '["历史","园林","遗址"]', 'scenic', 395, 280, false),
('🏔️', '香山公园', '海淀区 · 景点', '秋季赏红叶胜地，皇家园林', 4, 80, '4.6', '10元', '半天', '["公园","红叶","登山"]', 'scenic', 320, 420, false),
('🌿', '北京植物园', '海淀区 · 景点', '北方最大的植物园，科研与游览胜地', 4, 70, '4.4', '10元', '3小时', '["植物","科普","自然"]', 'scenic', 325, 175, false),
('🦆', '北京动物园', '西城区 · 景点', '中国最早开放的动物园，熊猫馆闻名', 4, 60, '4.3', '20元', '半天', '["动物","亲子","熊猫"]', 'scenic', 355, 355, false),
('🌊', '玉渊潭公园', '海淀区 · 景点', '春季赏樱花胜地，中央电视塔旁', 4, 50, '4.2', '10元', '2-3小时', '["樱花","公园","湖泊"]', 'scenic', 370, 300, false),
('🏞️', '奥林匹克森林公园', '朝阳区 · 景点', '北京最大的城市公园，跑步健身胜地', 4, 60, '4.4', '免费', '半天', '["公园","健身","跑步"]', 'scenic', 560, 280, false),
('🏯', '北海公园', '西城区 · 景点', '现存最古老、最完整的皇家园林', 5, 90, '4.7', '10元', '2-3小时', '["园林","历史","白塔"]', 'scenic', 365, 345, false),
('🛤️', '景山公园', '西城区 · 景点', '俯瞰故宫全景的最佳地点', 4, 70, '4.5', '10元', '1-2小时', '["俯瞰","公园","故宫"]', 'scenic', 450, 310, false),
('🌊', '什刹海', '西城区 · 景点', '老北京胡同文化聚集地，体验传统生活', 4, 75, '4.6', '免费', '下午', '["胡同","文化","湖泊"]', 'scenic', 365, 352, false),
('🍜', '簋街', '东城区 · 美食', '北京最著名的美食街，以小龙虾闻名', 4, 70, '4.4', '人均100元', '晚上', '["美食","夜宵","小龙虾"]', 'food', 420, 380, false),
('🥟', '南锣鼓巷', '东城区 · 美食', '北京最古老的街区之一，各种特色小吃', 4, 60, '4.3', '人均50元', '下午', '["小吃","胡同","文艺"]', 'food', 420, 375, false),
('🛍️', '王府井小吃街', '东城区 · 美食', '北京最繁华的商业街，小吃街闻名', 4, 80, '4.5', '人均80元', '全天', '["购物","美食","商业"]', 'food', 420, 385, false),
('🎉', '三里屯', '朝阳区 · 美食', '北京时尚地标，酒吧和餐厅聚集地', 4, 75, '4.4', '人均150元', '晚上', '["酒吧","时尚","夜生活"]', 'food', 520, 380, false),
('🥩', '牛街', '西城区 · 美食', '北京最正宗的清真美食街', 5, 65, '4.7', '人均60元', '全天', '["清真","小吃","传统"]', 'food', 390, 390, false),
('🥘', '东来顺', '东城区 · 美食', '北京老字号火锅，涮羊肉正宗', 5, 80, '4.8', '人均120元', '晚上', '["火锅","老字号","涮羊肉"]', 'food', 430, 365, false),
('🥡', '全聚德', '东城区 · 美食', '北京最著名的烤鸭店', 5, 90, '4.7', '人均150元', '全天', '["烤鸭","老字号","必吃"]', 'food', 425, 370, false),
('☕', '护国寺小吃', '西城区 · 美食', '北京传统小吃聚集地', 4, 50, '4.3', '人均30元', '早上', '["小吃","传统","早点"]', 'food', 385, 360, false),
('🎨', '798艺术区', '朝阳区 · 文化', '当代艺术聚集地，文艺青年必去', 4, 85, '4.6', '免费', '半天', '["艺术","文艺","拍照"]', 'culture', 600, 280, false),
('🏛️', '国家博物馆', '东城区 · 文化', '世界上单体建筑面积最大的博物馆', 5, 100, '4.8', '免费', '半天', '["博物馆","历史","文化"]', 'culture', 455, 325, false),
('🎭', '北京人艺', '东城区 · 文化', '中国话剧艺术的殿堂', 5, 90, '4.7', '80-280元', '晚上', '["话剧","艺术","演出"]', 'culture', 415, 390, false),
('📚', '首都图书馆', '朝阳区 · 文化', '北京市最大的公共图书馆', 4, 50, '4.4', '免费', '全天', '["图书馆","阅读","学习"]', 'culture', 530, 365, false),
('🏛️', '中国美术馆', '东城区 · 文化', '中国唯一的国家级美术博物馆', 5, 80, '4.6', '免费', '半天', '["美术","艺术","展览"]', 'culture', 460, 335, false),
('🎭', '梅兰芳大剧院', '西城区 · 文化', '京剧表演圣地', 5, 100, '4.7', '100-500元', '晚上', '["京剧","戏曲","传统文化"]', 'culture', 380, 365, false),
('📖', '孔庙国子监', '东城区 · 文化', '元明清三代国家最高学府', 5, 90, '4.6', '30元', '2小时', '["教育","历史","儒家"]', 'culture', 440, 355, false),
('🌊', '雁栖湖', '怀柔区 · 景点', '风景秀丽的湖泊景区', 4, 100, '4.5', '40元', '全天', '["湖泊","度假","风景"]', 'scenic', 450, 180, false),
('🏞️', '十渡', '房山区 · 景点', '北京最大的自然风景区', 4, 90, '4.4', '免费', '全天', '["自然","漂流","峡谷"]', 'scenic', 300, 520, false),
('🏔️', '百花山', '门头沟区 · 景点', '高山草甸，夏季避暑胜地', 4, 80, '4.3', '40元', '全天', '["登山","自然","避暑"]', 'scenic', 375, 475, false),
('🌊', '密云水库', '密云区 · 景点', '亚洲最大的人工湖', 4, 70, '4.2', '免费', '半天', '["水库","风景","自然"]', 'scenic', 530, 180, false),
('🛤️', '古北水镇', '密云区 · 景点', '江南水乡风情的古镇', 5, 150, '4.8', '140元', '全天', '["古镇","水乡","度假"]', 'scenic', 535, 200, false),
('🌊', '金海湖', '平谷区 · 景点', '平谷区最大的人工湖', 4, 60, '4.3', '30元', '半天', '["湖泊","风景","度假"]', 'scenic', 595, 275, false),
('✈️', '大兴机场', '大兴区 · 景点', '世界最大的单体航站楼', 5, 100, '4.7', '免费参观', '2小时', '["机场","建筑","现代"]', 'scenic', 600, 480, false),
('🎢', '环球影城', '通州区 · 景点', '亚洲第三家环球影城', 5, 180, '4.9', '400元', '全天', '["主题公园","娱乐","必去"]', 'scenic', 640, 560, false),
('🏭', '首钢园', '石景山区 · 景点', '工业遗址改造的文创园区', 4, 70, '4.4', '免费', '半天', '["工业","文创","滑雪"]', 'scenic', 330, 420, false),
('🏠', '我的家', '朝阳区 · 个人', '温馨的家', 5, 0, '5.0', '-', '-', '["家","个人"]', 'personal', 560, 330, true),
('🏢', '我的公司', '海淀区 · 个人', '奋斗的地方', 4, 0, '4.0', '-', '-', '["工作","个人"]', 'personal', 420, 290, true);

-- 插入成就数据
INSERT IGNORE INTO achievements (icon, name, description, xp, category, total) VALUES
('🗺️', '初探京城', '探索第一个北京景点', 50, 'explore', 1),
('🏃', '健身达人', '完成10次健身任务', 100, 'challenge', 10),
('📚', '学霸之路', '完成20个学习任务', 150, 'challenge', 20),
('🍜', '美食家', '打卡5个美食地点', 80, 'explore', 5),
('🏛️', '文化探索者', '参观3个文化场所', 100, 'explore', 3),
('⭐', '连续打卡', '连续7天打卡', 200, 'life', 7),
('🎯', '任务达人', '完成50个任务', 300, 'challenge', 50),
('💬', '社交达人', '在论坛发布10个帖子', 150, 'social', 10),
('🏔️', '长城英雄', '打卡长城', 200, 'explore', 1),
('🌟', '北京通', '探索所有北京景点', 500, 'explore', 43);

-- 每日记录表（心情/日记）
CREATE TABLE IF NOT EXISTS daily_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    date VARCHAR(20) NOT NULL,
    mood VARCHAR(50),
    mood_score INT,
    diary TEXT,
    weather VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY unique_user_date (user_id, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 插入测试用户（密码: 123456）
INSERT IGNORE INTO users (username, email, password, avatar, level, title, xp, total_xp) VALUES
('城市探险家', 'test@tutu.com', '$2a$10$N.ZOn9G6/YLFixAOPMg/h.z7wCu6.vX5eJ3JxZxVfEj6Z5iF8XG.K', '🧭', 15, '探索者', 2400, 15000);

SELECT '数据库初始化完成！' AS message;
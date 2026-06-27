package com.tutu.service;

import com.tutu.entity.ForumPost;
import com.tutu.entity.PostLike;
import com.tutu.entity.User;
import com.tutu.repository.ForumPostRepository;
import com.tutu.repository.PostLikeRepository;
import com.tutu.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ForumService {

    private final ForumPostRepository forumPostRepository;
    private final PostLikeRepository postLikeRepository;
    private final UserRepository userRepository;

    public ForumService(ForumPostRepository forumPostRepository,
                        PostLikeRepository postLikeRepository,
                        UserRepository userRepository) {
        this.forumPostRepository = forumPostRepository;
        this.postLikeRepository = postLikeRepository;
        this.userRepository = userRepository;
    }

    public List<Map<String, Object>> getAllPosts() {
        List<ForumPost> posts = forumPostRepository.findAllByOrderByCreatedAtDesc();
        return posts.stream().map(this::convertToMap).toList();
    }

    public List<Map<String, Object>> getPostsByCategory(String category) {
        List<ForumPost> posts = forumPostRepository.findByCategoryOrderByCreatedAtDesc(category);
        return posts.stream().map(this::convertToMap).toList();
    }

    public Map<String, Object> getPostById(Long id) {
        ForumPost post = forumPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("帖子不存在"));
        return convertToMap(post);
    }

    public Map<String, Object> createPost(String title, String content, String category, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        ForumPost post = new ForumPost();
        post.setTitle(title);
        post.setContent(content);
        post.setCategory(category);
        post.setUser(user);
        ForumPost saved = forumPostRepository.save(post);
        return convertToMap(saved);
    }

    public Map<String, Object> toggleLike(Long userId, Long postId) {
        ForumPost post = forumPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("帖子不存在"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        Optional<PostLike> existing = postLikeRepository.findByUserIdAndPostId(userId, postId);
        boolean liked;
        if (existing.isEmpty()) {
            PostLike like = new PostLike();
            like.setUser(user);
            like.setPost(post);
            postLikeRepository.save(like);
            post.setLikes(post.getLikes() + 1);
            liked = true;
        } else {
            postLikeRepository.delete(existing.get());
            post.setLikes(post.getLikes() - 1);
            liked = false;
        }
        forumPostRepository.save(post);

        Map<String, Object> result = new HashMap<>();
        result.put("liked", liked);
        result.put("likes", post.getLikes());
        return result;
    }

    private Map<String, Object> convertToMap(ForumPost post) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", post.getId());
        map.put("title", post.getTitle());
        map.put("content", post.getContent());
        map.put("category", post.getCategory());
        map.put("likes", post.getLikes());
        map.put("comments", post.getComments());
        map.put("createdAt", post.getCreatedAt());
        if (post.getUser() != null) {
            map.put("author", post.getUser().getUsername());
            map.put("avatar", post.getUser().getAvatar());
        }
        return map;
    }
}

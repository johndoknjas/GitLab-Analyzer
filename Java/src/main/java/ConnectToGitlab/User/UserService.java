package main.java.ConnectToGitlab.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getUsers() {
        return userRepository.findAll();
    }

    public void createUserAccount(User user) {
        userRepository.createUserAccount(user);
    }

    public User retrieveUserInfo(String username) {
        return userRepository.retrieveUserInfo(username);
    }
}

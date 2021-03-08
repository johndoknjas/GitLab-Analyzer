package main.java.DatabaseClasses.Repository;

import main.java.Model.User;
import main.java.Model.UserQuery;

/**
 * Is used to help integrate the custom functions that are already written working with UserRepository,
 * UserRepositoryCustom and UserRepositoryCustomImpl to allow for there integration with the spring MongoDB driver
 * and Java mongoDB driver
 */
public interface UserRepositoryCustom {

    void createUserAccount(User user);
    void changePassword(User user);
    void changeToken(User user);
    void setToken(User user);

    User retrieveUserInfo(String username);

    UserQuery findUserSettingsForProject(String username, int projectId);

}


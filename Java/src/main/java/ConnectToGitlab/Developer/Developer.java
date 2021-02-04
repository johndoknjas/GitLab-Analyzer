package main.java.ConnectToGitlab.Developer;

/**
 *  Class hold information about the different users on gitlab used to convert JSON to an object with spring
 *  We call this class developer to not get confused between the user of our product and gitlab users. So we
 *  call gitlab users developers
 */
public class Developer {
    private int id;
    private String name;
    private String username;
    private String state;
    private String avatar_url;
    private String web_url;
    private String email;

    public Developer() {
    }

    public Developer(int id) {
        this.id = id;
    }

    public Developer(int id, String name, String username, String state, String avatar_url, String web_url, String email) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.state = state;
        this.avatar_url = avatar_url;
        this.web_url = web_url;
        this.email = email;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "Developer{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", name='" + name + '\'' +
                ", state='" + state + '\'' +
                ", avatar_url='" + avatar_url + '\'' +
                ", web_url='" + web_url + '\'' +
                '}';
    }
}
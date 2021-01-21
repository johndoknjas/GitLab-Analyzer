package main.java;
import main.java.ConnectToGitlab.ConnectToGitlab;

import java.io.IOException;


public class Main {
    public static void main() {
        System.out.println("Hello");

        try {
            ConnectToGitlab.connectGitlab("");//Create an access token on your gitlab account and pass it in. Remove when pushing to avoid extra conflicts
        }catch(IOException exception){
            System.out.println(exception.getMessage());
        }

    }
}

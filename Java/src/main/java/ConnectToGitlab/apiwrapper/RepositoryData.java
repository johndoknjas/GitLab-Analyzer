package main.java.ConnectToGitlab.apiwrapper;

import org.gitlab.api.GitlabAPI;
import org.gitlab.api.models.GitlabCommit;
import org.gitlab.api.models.GitlabCommitDiff;
import org.gitlab.api.models.GitlabMergeRequest;
import org.gitlab.api.models.GitlabProject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

//contains gitlabProject objects and methods to operate on them
public class RepositoryData {

    public static List<GitlabProject> gitlabMembershipProjects;
    public static List<GitProject> gitProjects = new ArrayList<>();
    public static GitProject gitCurrentProject;

    //Get projects that user is a member of
    public static void collectMembershipProjects(GitlabAPI api) throws IOException {
       gitlabMembershipProjects = api.getMembershipProjects();
       createGitProjects(api);
    }

    //Create project objects
    public static void createGitProjects(GitlabAPI api) throws IOException {
        for(int i = 0; i < gitlabMembershipProjects.size(); i++){
            if(gitlabMembershipProjects.get(i).getName().equals("Testproject2")) {
                GitProject gitProject = new GitProject(gitlabMembershipProjects.get(i).getId());
                gitProject.gitProject = gitlabMembershipProjects.get(i);
                gitProject.gitlabProjectName = gitlabMembershipProjects.get(i).getName();
                gitProject.gitlabProjectMembers = api.getProjectMembers(gitlabMembershipProjects.get(i));
                gitProject.gitlabAllCommits = api.getAllCommits(gitlabMembershipProjects.get(i).getId());
                gitProject.gitAllIssues = api.getIssues(gitlabMembershipProjects.get(i));
                gitProject.gitlabMergedMergeRequests = api.getMergedMergeRequests(gitlabMembershipProjects.get(i));
                gitProjects.add(gitProject);
            }
        }
    }

    //Calculates a single commit diffs score
    public static double calculateCommitScoreSingleDiff(GitlabCommitDiff gitlabCommitDiff){
        double score = 0.0;
        for(int j = 0; j < gitlabCommitDiff.getDiff().length(); j++){
            if(gitlabCommitDiff.getDiff().charAt(j) == '\n' && j < gitlabCommitDiff.getDiff().length()-2){
                j++;
                if(gitlabCommitDiff.getDiff().charAt(j) == '+'){
                    j++;
                    while(gitlabCommitDiff.getDiff().charAt(j) == ' ' || gitlabCommitDiff.getDiff().charAt(j) == '\t'){
                        j++;
                    }
                    if(gitlabCommitDiff.getDiff().charAt(j) == '\n'){
                        j--;
                    }else if(gitlabCommitDiff.getDiff().charAt(j) == '/'){
                        score += 0.0;

                    }else if(gitlabCommitDiff.getDiff().charAt(j) == '}' || gitlabCommitDiff.getDiff().charAt(j) == '{'){
                        score += 0.2;
                    }else{
                        score += 1.0;
                    }
                }
                if(gitlabCommitDiff.getDiff().charAt(j) == '-'){
                    score += 0.2;
                }
            }
        }
        return Math.round(score * 100.0) / 100.0;
    }

    //Calculates score of list of commit diffs (in other words: a single commit)
    public static double calculateCommitScoreTotal(List <GitlabCommitDiff> gitlabCommitDiffs){
        double score = 0.0;
        for(int i = 0; i < gitlabCommitDiffs.size(); i++) {
            score += calculateCommitScoreSingleDiff(gitlabCommitDiffs.get(i));
        }
        return Math.round(score * 100.0) / 100.0;
    }

    //Get a list of all user commits
    public static List<GitlabCommit> getAllUserCommits(GitlabAPI api, String username ) throws IOException {
        List <GitlabCommit> userAllGitlabCommitsFromProject = api.getAllCommits(gitCurrentProject.gitProject.getId());
        for(int i = 0; i < userAllGitlabCommitsFromProject.size(); i++){
            if(userAllGitlabCommitsFromProject.get(i).getAuthorName().equals(username)){//user user
                //System.out.println(userAllGitlabCommitsFromProject.get(i).getTitle());
            }
        }
        return userAllGitlabCommitsFromProject;
    }

    //Get commits in a merge branch
    public static List<GitlabCommit> getMergeCommits(GitlabAPI api, GitlabMergeRequest gitlabMergeRequest) throws IOException {
        return api.getCommits(gitlabMergeRequest);
    }

    //Get all user commits in all merge branches
    public static List<GitlabCommit> getUserMergeCommits(GitlabAPI api, String username) throws IOException {
        List<GitlabCommit> userGitlabMergeCommits = new ArrayList<>();
        for(int i = 0; i < gitCurrentProject.gitlabMergedMergeRequests.size(); i++){
            List<GitlabCommit> userGitlabSingleMergeCommits = new ArrayList<>();
            userGitlabSingleMergeCommits = getMergeCommits(api, gitCurrentProject.gitlabMergedMergeRequests.get(i));
            for(int j = 0; j < userGitlabSingleMergeCommits.size(); j++){
                if(userGitlabSingleMergeCommits.get(j).getAuthorName().equals(username)  && !userGitlabSingleMergeCommits.get(j).getTitle().startsWith("Merge 'master'")) {
                    userGitlabMergeCommits.add(userGitlabSingleMergeCommits.get(j));
                }
            }
        }
        return userGitlabMergeCommits;
    }

    //Get a list of a user's merge requests (where user has atleast one commit)
    public static List<GitlabMergeRequest> getUserMergeRequests(GitlabAPI api, String username) throws IOException {
        List<GitlabMergeRequest> userGitlabMergeRequests = new ArrayList<>();
        for(int i = 0; i < gitCurrentProject.gitlabMergedMergeRequests.size(); i++){
            if(isUserPartOfMerge(api, username, gitCurrentProject.gitlabMergedMergeRequests.get(i))){
                userGitlabMergeRequests.add(gitCurrentProject.gitlabMergedMergeRequests.get(i));
                //System.out.println(gitlabMergeRequests.get(i).getTitle());
            }
        }
        return userGitlabMergeRequests;
    }

    //Find out if user is part of a merge branch
    public static boolean isUserPartOfMerge(GitlabAPI api, String username, GitlabMergeRequest gitlabMergeRequest) throws IOException {
        List<GitlabCommit> gitlabMergeCommits = getMergeCommits(api, gitlabMergeRequest);
        for(int i = 0; i < gitlabMergeCommits.size(); i++){
            if(gitlabMergeCommits.get(i).getAuthorName().equals(username)){
                return true;
            }
        }
        return false;
    }

    //Search projects by name
    public static GitProject searchForProjectByName(String name){
        for (GitProject gitProject : gitProjects) {
            if (gitProject.gitlabProjectName.equals(name)) {
                gitCurrentProject = gitProject;
                return gitCurrentProject;
            }
        }
        return null;
    }


}
package main.java.ConnectToGitlab;//package main.java.ConnectToGitlab.MergeRequests;

import main.java.Model.*;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class MergeRequestConnection {

    public static List<MergeRequest> getProjectMergeRequestsFromGitLab(int projectId) {
        User user = User.getInstance();
        RestTemplate restTemplate = new RestTemplate();
        String pageNumber = "1";
        List<MergeRequest> mergeRequests = new ArrayList<>();
        do {
            String myUrl = user.getServerUrl() +"projects/" + projectId
                    + "/merge_requests?state=merged&all=true&per_page=100&page=" + pageNumber + "&access_token="
                    + user.getToken();

            ResponseEntity<List<MergeRequest>> mergeRequestsResponse = restTemplate.exchange(myUrl,
                HttpMethod.GET, null, new ParameterizedTypeReference<List<MergeRequest>>() {
                });
            mergeRequests.addAll(Objects.requireNonNull(mergeRequestsResponse.getBody()));
            HttpHeaders headers = mergeRequestsResponse.getHeaders();
            pageNumber = headers.getFirst("X-Next-Page");
        }while (!pageNumber.equals(""));

        for (MergeRequest mergeRequest : mergeRequests) {
            mergeRequest.setContributors(getMergeRequestContributors(projectId, mergeRequest.getMergeRequestIdForASpecificProject()));
            mergeRequest.setDiffs(getMergeDiffs(projectId, mergeRequest.getMergeRequestIdForASpecificProject()));
            mergeRequest.setMrScore(calcMergeRequestScore(mergeRequest.getDiffs())); // must be done after diffs
            mergeRequest.setMergeRequestNotes(getMergeRequestNotes(projectId, mergeRequest.getMergeRequestIdForASpecificProject()));
            mergeRequest.setCommits(getMergeRequestCommits(projectId, mergeRequest.getMergeRequestIdForASpecificProject()));
        }
        return mergeRequests;
    }

    public static Instant

    public static List<Developer> getMergeRequestContributors(int projectId, int mergeRequestIdForASpecificProject) {
        User user = User.getInstance();
        RestTemplate restTemplate = new RestTemplate();
        String url = user.getServerUrl() +"projects/" + projectId + "/merge_requests/" + mergeRequestIdForASpecificProject
                + "/participants?access_token=" + user.getToken();

        ResponseEntity<List<Developer>> commitsResponse = restTemplate.exchange(url,
                HttpMethod.GET, null, new ParameterizedTypeReference<List<Developer>>() {});
        return commitsResponse.getBody();
    }

    public static List<Commit> getMergeRequestCommits(int projectId, int mergeRequestIdForASpecificProject) {
        User user = User.getInstance();
        RestTemplate restTemplate = new RestTemplate();
        String url = (user.getServerUrl() + "projects/"  + projectId  + "/merge_requests/" + mergeRequestIdForASpecificProject + "/commits"
                + "?access_token=" + user.getToken());

        ResponseEntity<List<Commit>> commitsResponse = restTemplate.exchange(url,
            HttpMethod.GET, null, new ParameterizedTypeReference<List<Commit>>() {});
        List<Commit> mergeCommits = commitsResponse.getBody();

        for (Commit singleCommit : mergeCommits) {
            singleCommit.setProjectId(projectId); // sets projectId if removing set project id a different way
            singleCommit.setDiffs(CommitConnection.getSingleCommitDiffs(projectId, singleCommit.getId()));
            singleCommit.calculateAndSetCommitScore(); // done after getting commits
        }
        return mergeCommits;
    }

    public static double calcMergeRequestScore(List<Diff> diffs) {
        double score = 0;
        for (Diff diff: diffs) {
            score += diff.getDiffScore();
        }
        return score;
    }

    public static List<Note> getMergeRequestNotes(int projectId, int mergeRequestIdForASpecificProject) {
        User user = User.getInstance();
        RestTemplate restTemplate = new RestTemplate();
        String pageNumber = "1";
        List<Note> mergeNotes = new ArrayList<>();
        do {
            String url = (user.getServerUrl() + "projects/" + projectId + "/merge_requests/" + mergeRequestIdForASpecificProject + "/notes"
                    + "?per_page=100&page=" + pageNumber +"&access_token=" + user.getToken());

            ResponseEntity<List<Note>> mergeNoteResponse = restTemplate.exchange(url,
                    HttpMethod.GET, null, new ParameterizedTypeReference<List<Note>>() {
                    });

            mergeNotes.addAll(Objects.requireNonNull(mergeNoteResponse.getBody()));
            HttpHeaders headers = mergeNoteResponse.getHeaders();
            pageNumber = headers.getFirst("X-Next-Page");
        }while(!pageNumber.equals(""));

        for (Note note : mergeNotes) {
            note.setIssueNote(false);
            note.setWordCount(note.countWords(note.getBody()));
        }
        return mergeNotes;
    }

    public static List<Diff> getMergeDiffs(int projectId, int mergeRequestIdForASpecificProject) {
        User user = User.getInstance();
        RestTemplate restTemplate = new RestTemplate();
        String pageNumber = "1";
        List<MergeRequestDiff> mergeRequestDiff = new ArrayList<>();
        do {
            String url = (user.getServerUrl() + "projects/" + projectId + "/merge_requests/" + mergeRequestIdForASpecificProject +
                    "/changes?per_page=100&page=" + pageNumber +"&access_token=" + user.getToken());
            ResponseEntity<MergeRequestDiff> mergeDiffResponse = restTemplate.exchange(url,
                    HttpMethod.GET, null, new ParameterizedTypeReference<MergeRequestDiff>() {
                    });
            mergeRequestDiff.add(mergeDiffResponse.getBody());
            HttpHeaders headers = mergeDiffResponse.getHeaders();
            pageNumber = headers.getFirst("X-Next-Page");
        }while((!Objects.equals(pageNumber, "")) && pageNumber != null);

        List<Diff> mrDiffs = new ArrayList<>();
        for(MergeRequestDiff singleMergeDiff: mergeRequestDiff) {
            mrDiffs.addAll(singleMergeDiff.getChanges());
        }

        for (Diff diff : mrDiffs) {
            diff.calculateAndSetDiffScore();
        }
        return mrDiffs;
    }

}

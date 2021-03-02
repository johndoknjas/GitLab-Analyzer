package main.java.DatabaseClasses.Model;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class MergeRequestDateScore {

    private LocalDate date;
    private double mergeRequestScore;
    private String authorName;
    private int numMergeRequests;
    private List<Integer> mergeRequestId;

    public MergeRequestDateScore() {
    }


    public LocalDate getDate() {
        return date;
    }


    public String getAuthorName() {
        return authorName;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }


    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public double getMergeRequestScore() {
        return mergeRequestScore;
    }

    public void setMergeRequestScore(double mergeRequestScore) {
        this.mergeRequestScore = mergeRequestScore;
    }

    public int getNumMergeRequests() {
        return numMergeRequests;
    }

    public void setNumMergeRequests(int numMergeRequests) {
        this.numMergeRequests = numMergeRequests;
    }

    public List<Integer> getMergeRequestId() {
        return mergeRequestId;
    }

    public void setMergeRequestId(List<Integer> mergeRequestId) {
        this.mergeRequestId = mergeRequestId;
    }

    public void addToMergeRequestScore(Double score) {
        this.mergeRequestScore = this.mergeRequestScore + score;
    }

    public void incrementNumMergeRequests() {
        this.numMergeRequests = this.numMergeRequests + 1;
    }


    @Override
    public String toString() {
        return "DateScore{" +
                "date=" + date +
                ", userName='" + authorName + '\'' +
                '}';
    }
}

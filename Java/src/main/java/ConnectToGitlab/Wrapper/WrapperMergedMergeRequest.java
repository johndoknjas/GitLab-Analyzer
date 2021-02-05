package main.java.ConnectToGitlab.Wrapper;

import com.google.gson.*;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

public class WrapperMergedMergeRequest {

    public static final String MAIN_URL = "https://cmpt373-1211-10.cmpt.sfu.ca/api/v4/projects";
    private int mergeRequestId;
    private int mergeRequestIid;
    private int gitlabProjectId;
    private String mergeRequestTitle;
    private int mergeYear;
    private int mergeMonth;
    private int mergeDay;
    private List<WrapperCommit> mergeRequestCommits = new ArrayList<>();

    public WrapperMergedMergeRequest(int mergeRequestId, int mergeRequestIid, int gitlabProjectId, String mergeRequestTitle,
                                     int mergeYear, int mergeMonth, int mergeDay){
        this.mergeRequestId = mergeRequestId;
        this.mergeRequestIid = mergeRequestIid;
        this.gitlabProjectId = gitlabProjectId;
        this.mergeRequestTitle = mergeRequestTitle;
        this.mergeYear = mergeYear;
        this.mergeMonth = mergeMonth;
        this.mergeDay = mergeDay;
        //this.mergeRequestCommits = mergeRequestCommits;
    }

    public static void getSingleMergedMergeRequestCommits(String token, int mergeIid) throws IOException, ParseException {
        URL url = new URL(MAIN_URL + "/6" + "/merge_requests/" + mergeIid + "/commits" + "?access_token=" + token);
        HttpURLConnection connection = makeConnection(url);
        connection.setRequestMethod("GET");
        connection.getInputStream();
        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(connection.getInputStream()));

        String reply = "";
        for (String oneLine; (oneLine = bufferedReader.readLine()) != null; reply += oneLine);
        //System.out.println(reply);
        connection.disconnect();

        Gson gson = new Gson();
        JsonArray jsonArray = gson.fromJson(reply, JsonArray.class);
        for(int i = 0; i < jsonArray.size(); i++) {
            JsonElement jsonElement = jsonArray.get(i);
            JsonObject jsonObject = jsonElement.getAsJsonObject();
            JsonPrimitive jsonPrimitiveId = jsonObject.getAsJsonPrimitive("id");
            String commitId = jsonPrimitiveId.getAsString();
            JsonPrimitive jsonPrimitiveAuthorName = jsonObject.getAsJsonPrimitive("author_name");
            String authorName = jsonPrimitiveAuthorName.getAsString();
            JsonPrimitive jsonPrimitiveAuthorEmail = jsonObject.getAsJsonPrimitive("author_email");
            String authorEmail = jsonPrimitiveAuthorEmail.getAsString();
            JsonPrimitive jsonPrimitiveTitle = jsonObject.getAsJsonPrimitive("title");
            String title = jsonPrimitiveTitle.getAsString();
            JsonPrimitive jsonPrimitiveCommitDate = jsonObject.getAsJsonPrimitive("committed_date");
            String mergeRequestCommitDate = jsonPrimitiveCommitDate.getAsString();
            int [] mergeDate = parsIsoDate(mergeRequestCommitDate);


        }


    }

    public static int[] parsIsoDate(String isoDate) throws ParseException {
        DateFormat df1 = new SimpleDateFormat("yyyy-MM-dd'T'HH");
        df1.setTimeZone(TimeZone.getTimeZone("PT"));
        //Date result1 = df1.parse("2024-01-24T23:55:59.000+00:00");
        Date result1 = df1.parse(isoDate);
        //System.out.println(result1);

        Calendar cal = Calendar.getInstance();
        cal.setTime(result1);
        int [] result = new int[3];

        result[0] = cal.get(Calendar.YEAR);
        result[1] = (cal.get(Calendar.MONTH)+1);
        result[2] = cal.get(Calendar.DATE);
        return result;
    }

    public static void getSingleMergedMergeRequestChanges(String token, int mergeIid) throws IOException {
        URL url = new URL(MAIN_URL + "/6" + "/merge_requests/" + mergeIid + "/changes" + "?access_token=" + token);
        HttpURLConnection connection = makeConnection(url);
        connection.setRequestMethod("GET");
        connection.getInputStream();
        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
        String reply = "";
        for (String oneLine; (oneLine = bufferedReader.readLine()) != null; reply += oneLine) ;
        //System.out.println(reply);
        connection.disconnect();
        List<String> singleMergedMergeDiff = new ArrayList<>();
        Gson gson = new Gson();
        JsonElement jsonElement = gson.fromJson(reply, JsonElement.class);
        JsonObject jsonObject = jsonElement.getAsJsonObject();
        JsonArray jsonArrayChanges = jsonObject.getAsJsonArray("changes");
        for(int i = 0; i< jsonArrayChanges.size(); i++){
            JsonElement jsonElement1 = jsonArrayChanges.get(i);
            JsonObject jsonObject1 = jsonElement1.getAsJsonObject();
            JsonPrimitive jsonPrimitiveNewFileName = jsonObject1.getAsJsonPrimitive("new_path");
            singleMergedMergeDiff.add(jsonPrimitiveNewFileName.getAsString());
            //System.out.println(jsonPrimitiveNewFileName.getAsString());//file name
            JsonPrimitive jsonPrimitive = jsonObject1.getAsJsonPrimitive("diff");
            singleMergedMergeDiff.add(jsonPrimitive.getAsString());//file diff
            //System.out.println(jsonPrimitive.getAsString());
        }
    }

    public static HttpURLConnection makeConnection(URL url) throws IOException {
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        return connection;
    }

    public int getMergeRequestId() {
        return mergeRequestId;
    }

    public int getMergeRequestIid() {
        return mergeRequestIid;
    }

    public int getGitlabProjectId() {
        return gitlabProjectId;
    }

    public String getMergeRequestTitle() {
        return mergeRequestTitle;
    }

    public int getMergeYear() {
        return mergeYear;
    }

    public int getMergeMonth() {
        return mergeMonth;
    }

    public int getMergeDay() {
        return mergeDay;
    }

    public List<WrapperCommit> getMergeRequestCommits() {
        return mergeRequestCommits;
    }
}

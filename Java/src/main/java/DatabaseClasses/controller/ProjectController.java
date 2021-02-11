package main.java.DatabaseClasses.Controller;

import main.java.ConnectToGitlab.Developer.Developer;
import main.java.ConnectToGitlab.Project.Project;
import main.java.ConnectToGitlab.Project.ProjectConnection;
import main.java.DatabaseClasses.Repository.ProjectRepository;
import main.java.DatabaseClasses.Service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * This class manages API mapping for functions to be called from frontend.
 * (All functions used for mapping should be placed here, except user authentication collection data.)
 */
@CrossOrigin
@RestController
@RequestMapping("api/v1/")
public class ProjectController {

    private final ProjectService projectService;

    @Autowired
    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }


    // Just a couple of examples to show how querying works, should be changed

    // Example of getting projects only with field of name
    @GetMapping("projects")
    public List<Project> getAllProjects() {
        if(projectService.getAllProjects().isEmpty()) {
            List<Project> projects = ProjectConnection.getAllProjects();
            projectService.saveNewProjects(projects);
            return projects;
        } else {
            return projectService.getAllProjects();
        }
    }

    @GetMapping("projects/{projectId}")
    public Project getProject(@PathVariable("projectId") int projectId) {
        return projectService.getProject(projectId);
    }

    @GetMapping("projects/{projectId}/developers")
    public List<Developer> getProjectDevelopers(@PathVariable("projectId") int projectId) {
        return projectService.getProjectDevelopers(projectId);
    }

}


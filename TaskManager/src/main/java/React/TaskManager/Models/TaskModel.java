package React.TaskManager.Models;

import jakarta.persistence.*;

@Entity
@Table(name = "tasksTable")
public class TaskModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;
    @Column(name = "TITLE", nullable = false)
    private String title;
    @Column(name = "DESCRIPTION", nullable = false)
    private String description;
    @Column(name = "STATUS", nullable = false)
    private String status = "Not Started";
    @ManyToOne
    @JoinColumn(name = "USER_ID")
    private UserModel userModel;
    public TaskModel() {
    }
    public TaskModel(Long id, String title, String description, String status, UserModel userModel) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.userModel = userModel;
    }
    public Long getId() {return id; }
    public void setId(Long id) {
        this.id = id;
    }
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public UserModel getUserModel() {
        return userModel;
    }
    public void setUserModel(UserModel userModel) {
        this.userModel = userModel;
    }
}

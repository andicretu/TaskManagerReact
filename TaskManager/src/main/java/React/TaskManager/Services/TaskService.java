package React.TaskManager.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import React.TaskManager.Models.TaskModel;
import React.TaskManager.Models.UserModel;
import React.TaskManager.Repositories.TaskRepository;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    public Page<TaskModel> getTasksByUser(UserModel user, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return taskRepository.findByUserModel(user, pageable);
    }
}

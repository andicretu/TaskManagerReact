package React.TaskManager.Repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import React.TaskManager.Models.TaskModel;
import React.TaskManager.Models.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<TaskModel, Long> {

    Page<TaskModel> findByUserModel(UserModel userModel, Pageable pageable);

    Page<TaskModel> findByUserModelAndStatus(UserModel userModel, TaskModel.TaskStatus status, Pageable pageable);
}

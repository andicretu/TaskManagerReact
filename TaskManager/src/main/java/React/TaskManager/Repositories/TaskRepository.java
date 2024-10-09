package React.TaskManager.Repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import React.TaskManager.Models.TaskModel;
import React.TaskManager.Models.UserModel;

import java.util.List;

public interface TaskRepository extends JpaRepository<TaskModel, Long> {
    List<TaskModel> findAllByUserModel(UserModel userModel);

    Page<TaskModel> findAllByUserModel(UserModel userModel, Pageable pageable);
}
package React.TaskManager.Repositories;

import org.springframework.stereotype.Repository;
import org.springframework.data.repository.CrudRepository;
import React.TaskManager.Models.UserModel;


@Repository
public interface UserRepository extends CrudRepository<UserModel, Long> {
    UserModel findByEmail(String email);
}

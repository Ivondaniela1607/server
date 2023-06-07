import UserModel from '../models/users.model';

export const UtilsUser = {
  createUser(nombres, apellidos) {
    return new Promise(async (resolve) => {
      let first = nombres[0];
      let second = apellidos.split(' ')[0];
      let response = await UserModel.getCountUsersDB();
      resolve(
        `${first.toUpperCase()}${second.toUpperCase()}${response['count']}`
      );
    });
  },
};

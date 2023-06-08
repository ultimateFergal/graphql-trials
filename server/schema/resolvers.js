const { UserList, MovieList } = require("../FakeData");
const _ = require("lodash");

const resolvers = {
  Query: {
    /**
     * User Resolvers
     */
    users: () => {
       return UserList;
    //   if (UserList) return { users: UserList };
    //   return { message: "There was an error" };
    },
    user: (parent, args) => {
      const id = args.id;
      const user = _.find(UserList, { id: Number(id) });
      return user;
    },
    /**
     * Movie Resolvers
     */
    movies: () => {
      return MovieList;
    },
    movie: (parent, args) => {
      const name = args.name;
      const movie = _.find(MovieList, { name });
      return movie;
    },
  },
  // with separate table info for same id
  User: {
    favoriteMovies: () => {
      return _.filter(
        MovieList,
        (movie) =>
          movie.yearOfPublication >= 2000 && movie.yearOfPublication <= 2010
      );
    },
  },
  // Mutation
  Mutation: {
    createUser: (parent, args) => {
      const user = args.input;
      // console.log(user);
      const lastId = UserList[UserList.length - 1].id;
      user.id = lastId + 1;
      UserList.push(user);
      return user;
    },
    updateUserName: (parent, args) => {
      const { id, newUsername } = args.input;
      let userUpdated;
      UserList.forEach((user) => {
        if (user.id === Number(id)) {
          user.username = newUsername;
          userUpdated = user;
        }
      });
      return userUpdated;
    },
    deleteUser: (parent, args) => {
      const id = args.id;
      _.remove(UserList, (user) => user.id === Number(id));
      return null;
    },
  },

  UserResult: {
    __resolveType(obj) {
      if (obj.users) {
        return "UsersSuccesfulResult";
      }

      if (obj.message) {
        return "UsersErrorResult";
      }

      return null;
    },
  },
};

module.exports = { resolvers };

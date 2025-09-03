// src/components/UsersList.tsx
import { Link } from "react-router-dom";
import { useGetUsersQuery, useDeleteUserMutation } from "../services/apiSlice";
import "./UsersList.scss";

export default function UsersList() {
  const { data: users, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching users</p>;

  return (
  <div className="users-list">
    <Link className="add-link" to="/add">
      Add User
    </Link>

    <h2>Users</h2>

    <ul>
      {users?.map((user) => (
        <li key={user.id}>
          <Link className="user-link" to={`/${user.id}`}>{user.name}</Link>
          <div className="actions">
            <Link className="edit-btn" to={`/edit/${user.id}`}>
              Edit
            </Link>
            <button
              className="delete-btn"
              onClick={() => deleteUser(user.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

}

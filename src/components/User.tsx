import { useNavigate, useParams } from "react-router-dom";
import { useGetUserQuery } from "../services/apiSlice";
import "./UserDetails.scss";

export default function UserDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: user, isLoading, error } = useGetUserQuery(id!);
  const navigate = useNavigate();

  if (isLoading) return <div className="user-details">Loading...</div>;
  if (error) return <div className="user-details">Something went wrong.</div>;
  if (!user) return <div className="user-details">User not found.</div>;

  return (
    <div className="user-details">
      <button onClick={() => navigate("/")}>Back</button>
      <div className="user-card">
        <h2>{user.name}</h2>
        <p>
          <strong>Username:</strong> {user.username}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Phone:</strong> {user.phone}
        </p>
        <p>
          <strong>Website:</strong> {user.website}
        </p>
        <p>
          <strong>Address:</strong> {user.address.city}, {user.address.street}
        </p>
      </div>
    </div>
  );
}

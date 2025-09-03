// src/components/EditUser.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetUserQuery, useUpdateUserMutation } from "../services/apiSlice";
import type { UserForm } from "./AddUser";
import "./AddUser.scss";

export default function EditUser() {
  const { id } = useParams<{ id: string }>();
  const { data: user, isLoading } = useGetUserQuery(id!);
  const [updateUser] = useUpdateUserMutation();
  const navigate = useNavigate();

  const [editedForm, setEditedForm] = useState<UserForm>({
    name: "",
    username: "",
    email: "",
    phone: "",
    website: "",
    address: { street: "", city: "" },
  });

  useEffect(() => {
    if (user) {
      setEditedForm({
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        website: user.website,
        address: { ...user.address },
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name in editedForm.address) {
      setEditedForm(prev => ({ ...prev, address: { ...prev.address, [name]: value } }));
    } else {
      setEditedForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUser({ id: id!, data: editedForm }).unwrap();
    navigate("/");
  };

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
  <form onSubmit={handleSubmit} className="edit-user-form">
    <h2>Edit User</h2>
    <button onClick={() => navigate("/")}>Back</button>
    <input
      type="text"
      name="name"
      placeholder="Full Name"
      value={editedForm?.name || ""}
      onChange={handleChange}
      required
    />

    <input
      type="text"
      name="username"
      placeholder="Username"
      value={editedForm?.username || ""}
      onChange={handleChange}
      required
    />

    <input
      type="email"
      name="email"
      placeholder="Email"
      value={editedForm?.email || ""}
      onChange={handleChange}
      required
    />

    <input
      type="text"
      name="city"
      placeholder="City"
      value={editedForm?.address.city || ""}
      onChange={handleChange}
      required
    />

    <input
      type="text"
      name="street"
      placeholder="Street"
      value={editedForm?.address.street || ""}
      onChange={handleChange}
      required
    />

    <input
      type="text"
      name="phone"
      placeholder="Phone"
      value={editedForm.phone || ""}
      onChange={handleChange}
      required
    />

    <input
      type="text"
      name="website"
      placeholder="Website"
      value={editedForm.website || ""}
      onChange={handleChange}
      required
    />

    <button type="submit">Save Changes</button>
  </form>
);

}

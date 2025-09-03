// src/components/AddUser.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAddUserMutation } from "../services/apiSlice";
import "./AddUser.scss"
export interface UserForm {
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: { street: string; city: string };
}

export default function AddUser() {
  const [formData, setFormData] = useState<UserForm>({
    name: "",
    username: "",
    email: "",
    phone: "",
    website: "",
    address: { street: "", city: "" },
  });

  const [addUser] = useAddUserMutation();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name in formData.address) {
      setFormData(prev => ({ ...prev, address: { ...prev.address, [name]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addUser(formData).unwrap();
    navigate("/");
  };

 return (
  <form onSubmit={handleSubmit} className="add-user-form">
    <h2>Add New User</h2>
     <button onClick={() => navigate("/")}>Back</button>
    <input
      type="text"
      name="name"
      placeholder="Full Name"
      value={formData.name}
      onChange={handleChange}
      required
    />

    <input
      type="text"
      name="username"
      placeholder="Username"
      value={formData.username}
      onChange={handleChange}
      required
    />

    <input
      type="email"
      name="email"
      placeholder="Email"
      value={formData.email}
      onChange={handleChange}
      required
    />

    <input
      type="text"
      name="city"
      placeholder="City"
      value={formData.address.city}
      onChange={handleChange}
      required
    />

    <input
      type="text"
      name="street"
      placeholder="Street"
      value={formData.address.street}
      onChange={handleChange}
      required
    />

    <input
      type="text"
      name="phone"
      placeholder="Phone"
      value={formData.phone}
      onChange={handleChange}
      required
    />

    <input
      type="text"
      name="website"
      placeholder="Website"
      value={formData.website}
      onChange={handleChange}
      required
    />

    <button type="submit">Add User</button>
  </form>
);

}

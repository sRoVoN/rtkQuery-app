// src/routes/Routes.tsx
import { Routes, Route } from "react-router-dom";

import User from "../components/User";
import EditUser from "../components/EditUser";
import AddUser from "../components/AddUser";
import UsersList from "../components/UsersList";



const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<UsersList />}  />
      <Route path="/:id" element={<User />}  />
      <Route path="/edit/:id" element={<EditUser />} />
      <Route path="/add" element={<AddUser/>} />
    </Routes>
  );
};

export default AppRoutes;
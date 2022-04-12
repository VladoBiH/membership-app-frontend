import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './core/Home';
import Users from './user/Users';
import Profile from './user/Profile';
import EditProfile from './user/EditProfile';
import Signup from './user/Signup';
import Signin from './auth/Signin';
import PrivateRoute from './auth/PrivateRoute';
import Menu from './core/Menu';

const MainRouter = () => {
  return (
    <>
      <Menu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route element={<PrivateRoute />}>
          <Route path="/user/edit/:userId" element={<EditProfile />} />
        </Route>
        <Route path="/user/:userId" element={<Profile />} />
      </Routes>
    </>
  );
};

export default MainRouter;

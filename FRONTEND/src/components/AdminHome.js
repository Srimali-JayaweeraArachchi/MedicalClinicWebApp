import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminHome.css";

const AdminHome = () => {
    const [users, setUsers] = useState([]);
    const [token, setToken] = useState(localStorage.getItem("adminToken"));

    // Fetch users when the token changes
    useEffect(() => {
        if (token) {
            fetchUsers();
        }
    }, [token]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("/api/admin/users", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleBlockUser = async (id) => {
        try {
            await axios.put(
                `/api/admin/user/block/${id}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchUsers();
        } catch (error) {
            console.error("Error blocking user:", error);
        }
    };

    const handleUnblockUser = async (id) => {
        try {
            await axios.put(
                `/api/admin/user/unblock/${id}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchUsers();
        } catch (error) {
            console.error("Error unblocking user:", error);
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            await axios.delete(`/api/admin/user/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchUsers();
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <button className="fetch-users-btn" onClick={fetchUsers}>
                Fetch All Users
            </button>
            <div className="user-list">
                <h2>All Users</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>{user.fullName}</td>
                                <td>{user.email}</td>
                                <td>{user.phoneNumber}</td>
                                <td>{user.role}</td>
                                <td>
                                    <button
                                        className="block-btn"
                                        onClick={() => handleBlockUser(user._id)}
                                        disabled={user.isBlocked}
                                    >
                                        Block
                                    </button>
                                    <button
                                        className="unblock-btn"
                                        onClick={() => handleUnblockUser(user._id)}
                                        disabled={!user.isBlocked}
                                    >
                                        Unblock
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDeleteUser(user._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminHome;

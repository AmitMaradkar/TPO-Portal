import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../assets/css/login.css';
import API_BASE_URL from '../../config/api';

const AdminUpdatePassword = () => {
    const [curPass, setCurPass] = useState('');
    const [newPass, setnewPass] = useState('');
    const [confirmPass, setconfirmPass] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPass !== confirmPass) {
            alert('Passwords do not match!');
            setnewPass('');
            setconfirmPass('');
            return;
        }

        try {
            const res = await axios.post(`${API_BASE_URL}/admin/password/update`, {
                oldPassword: curPass,
                newPassword: newPass,
                confirmPassword: confirmPass
            }, { withCredentials: true });

            if (res.status === 200 || res.status === 201) {
                alert("Password updated successfully!");
                navigate("/admin/dashboard");
            }
        } catch (error) {
            alert(error.response?.data?.message || "Old Password did not match");
        }
    };

    return (
        <div>
            <div id="signInForm">
                <main className="form-signin w-100 m-auto">
                    <form onSubmit={handleSubmit}>
                        <h3 className="form-label">Update Password</h3>
                        <div className="form-group mt-3">
                            <label>Current Password</label>
                            <input
                                onChange={(e) => setCurPass(e.target.value)}
                                value={curPass}
                                type="password"
                                className="form-control mt-1"
                                placeholder="Enter Current Password"
                                required
                            />
                        </div>

                        <div className="form-group mt-3">
                            <label>New Password</label>
                            <input
                                onChange={(e) => setnewPass(e.target.value)}
                                value={newPass}
                                type="password"
                                className="form-control mt-1"
                                placeholder="Enter New Password"
                                required
                            />
                        </div>

                        <div className="form-group mt-3">
                            <label>Confirm New Password</label>
                            <input
                                onChange={(e) => setconfirmPass(e.target.value)}
                                value={confirmPass}
                                type="password"
                                className="form-control mt-1"
                                placeholder="Confirm New Password"
                                required
                            />
                        </div>

                        <div className="d-grid gap-2 mt-3">
                            <button type="submit" className="btn btn-primary">
                                Submit
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
};

export default AdminUpdatePassword;
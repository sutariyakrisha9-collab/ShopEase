
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes, FaArrowLeft } from "react-icons/fa";

import { getMyProfile, updateMyProfile } from "../services/authService";
import { useAuth } from "../context/AuthContext";

function Profile() {

    const { refreshUser } = useAuth();

    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: "",
        address: {
            street: "",
            city: "",
            state: "",
            pincode: "",
            country: "India"
        },
        role: "user"
    });

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: {
            street: "",
            city: "",
            state: "",
            pincode: "",
            country: "India"
        }
    });

    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ================= LOAD PROFILE =================

    useEffect(() => {

        const fetchProfile = async () => {

            try {

                setLoading(true);

                const data = await getMyProfile();

                const user = data.user;

                const userProfile = {
                    name: user.name || "",
                    email: user.email || "",
                    phone: user.phone || "",
                    address: {
                        street: user.address?.street || "",
                        city: user.address?.city || "",
                        state: user.address?.state || "",
                        pincode: user.address?.pincode || "",
                        country: user.address?.country || "India"
                    },
                    role: user.role || "user"
                };

                setProfile(userProfile);

                setFormData({
                    name: userProfile.name,
                    phone: userProfile.phone,
                    address: { ...userProfile.address }
                });

            } catch (err) {

                setError(
                    err.response?.data?.message ||
                    "Unable to load profile."
                );

            } finally {
                setLoading(false);
            }

        };

        fetchProfile();

    }, []);


    // ================= HANDLE INPUT =================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

    };


    // ================= HANDLE ADDRESS =================

    const handleAddressChange = (e) => {

        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            address: {
                ...previous.address,
                [name]: value
            }
        }));

    };


    // ================= EDIT PROFILE =================

    const handleEdit = () => {

        setFormData({
            name: profile.name,
            phone: profile.phone,
            address: { ...profile.address }
        });

        setEditing(true);
        setError("");
        setSuccess("");

    };


    // ================= CANCEL EDIT =================

    const handleCancel = () => {

        setFormData({
            name: profile.name,
            phone: profile.phone,
            address: { ...profile.address }
        });

        setEditing(false);
        setError("");
        setSuccess("");

    };


    // ================= SAVE PROFILE =================

    const handleSave = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        if (formData.name.trim().length < 3) {
            setError("Name must contain at least 3 characters.");
            return;
        }

        if (formData.name.trim().length > 50) {
            setError("Name cannot exceed 50 characters.");
            return;
        }

        if (
            formData.phone &&
            !/^[0-9]{10}$/.test(formData.phone.trim())
        ) {
            setError("Please enter a valid 10-digit phone number.");
            return;
        }

        if (
            formData.address.pincode &&
            !/^[0-9]{6}$/.test(formData.address.pincode.trim())
        ) {
            setError("Please enter a valid 6-digit pincode.");
            return;
        }

        try {

            setSaving(true);

            const response = await updateMyProfile({
                name: formData.name.trim(),
                phone: formData.phone.trim(),
                address: {
                    street: formData.address.street.trim(),
                    city: formData.address.city.trim(),
                    state: formData.address.state.trim(),
                    pincode: formData.address.pincode.trim(),
                    country: formData.address.country.trim()
                }
            });

            const updatedUser = response.user;

            const updatedProfile = {
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone || "",
                address: {
                    street: updatedUser.address?.street || "",
                    city: updatedUser.address?.city || "",
                    state: updatedUser.address?.state || "",
                    pincode: updatedUser.address?.pincode || "",
                    country: updatedUser.address?.country || "India"
                },
                role: updatedUser.role
            };

            setProfile(updatedProfile);

            setFormData({
                name: updatedProfile.name,
                phone: updatedProfile.phone,
                address: { ...updatedProfile.address }
            });

            // Update logged-in user information in AuthContext
            if (refreshUser) {
                await refreshUser();
            }

            setEditing(false);
            setSuccess("Profile updated successfully!");

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Unable to update profile."
            );

        } finally {
            setSaving(false);
        }

    };


    // ================= LOADING =================

    if (loading) {

        return (
            <div className="profile-loading">
                <div className="spinner-border text-success"></div>
                <p>Loading your profile...</p>
            </div>
        );

    }


    // ================= PROFILE PAGE =================

    return (

        <div className="profile-page">

            <div className="container">

                <Link to="/" className="profile-back-link">
                    <FaArrowLeft /> Back to Home
                </Link>

                <div className="profile-heading">
                    <span>MY ACCOUNT</span>
                    <h2>My Profile</h2>
                    <p>Manage your personal information and delivery address.</p>
                </div>


                <div className="profile-card">

                    <div className="profile-card-header">

                        <div className="profile-avatar">
                            <FaUser />
                        </div>

                        <div className="profile-user-heading">
                            <h4>{profile.name}</h4>
                            <p>{profile.email}</p>
                            <span className="profile-role">
                                {profile.role}
                            </span>
                        </div>

                        {!editing && (

                            <button
                                type="button"
                                className="profile-edit-btn"
                                onClick={handleEdit}
                            >
                                <FaEdit /> Edit Profile
                            </button>

                        )}

                    </div>


                    {error && (
                        <div className="alert alert-danger mx-4 mt-3">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="alert alert-success mx-4 mt-3">
                            {success}
                        </div>
                    )}


                    <form onSubmit={handleSave}>

                        {/* PERSONAL INFORMATION */}

                        <div className="profile-section">

                            <h5>Personal Information</h5>

                            <div className="row g-4">

                                <div className="col-md-6">

                                    <label className="profile-label">
                                        Full Name
                                    </label>

                                    <div className="profile-input-wrap">
                                        <FaUser />

                                        <input
                                            type="text"
                                            name="name"
                                            value={editing ? formData.name : profile.name}
                                            onChange={handleChange}
                                            disabled={!editing}
                                            placeholder="Enter your name"
                                            required
                                            minLength={3}
                                            maxLength={50}
                                        />
                                    </div>

                                </div>


                                <div className="col-md-6">

                                    <label className="profile-label">
                                        Email Address
                                    </label>

                                    <div className="profile-input-wrap">
                                        <FaEnvelope />

                                        <input
                                            type="email"
                                            value={profile.email}
                                            disabled
                                        />
                                    </div>

                                    <small className="profile-help">
                                        Email address cannot be changed here.
                                    </small>

                                </div>


                                <div className="col-md-6">

                                    <label className="profile-label">
                                        Phone Number
                                    </label>

                                    <div className="profile-input-wrap">
                                        <FaPhone />

                                        <input
                                            type="tel"
                                            name="phone"
                                            value={editing ? formData.phone : profile.phone}
                                            onChange={handleChange}
                                            disabled={!editing}
                                            placeholder="Enter 10-digit phone number"
                                            maxLength={10}
                                        />
                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* ADDRESS INFORMATION */}

                        <div className="profile-section">

                            <h5>Delivery Address</h5>

                            <div className="row g-4">

                                <div className="col-12">

                                    <label className="profile-label">
                                        Street Address
                                    </label>

                                    <div className="profile-input-wrap">
                                        <FaMapMarkerAlt />

                                        <input
                                            type="text"
                                            name="street"
                                            value={editing ? formData.address.street : profile.address.street}
                                            onChange={handleAddressChange}
                                            disabled={!editing}
                                            placeholder="Enter street address"
                                        />
                                    </div>

                                </div>


                                <div className="col-md-6">

                                    <label className="profile-label">
                                        City
                                    </label>

                                    <input
                                        className="profile-input"
                                        type="text"
                                        name="city"
                                        value={editing ? formData.address.city : profile.address.city}
                                        onChange={handleAddressChange}
                                        disabled={!editing}
                                        placeholder="Enter city"
                                    />

                                </div>


                                <div className="col-md-6">

                                    <label className="profile-label">
                                        State
                                    </label>

                                    <input
                                        className="profile-input"
                                        type="text"
                                        name="state"
                                        value={editing ? formData.address.state : profile.address.state}
                                        onChange={handleAddressChange}
                                        disabled={!editing}
                                        placeholder="Enter state"
                                    />

                                </div>


                                <div className="col-md-6">

                                    <label className="profile-label">
                                        Pincode
                                    </label>

                                    <input
                                        className="profile-input"
                                        type="text"
                                        name="pincode"
                                        value={editing ? formData.address.pincode : profile.address.pincode}
                                        onChange={handleAddressChange}
                                        disabled={!editing}
                                        placeholder="Enter 6-digit pincode"
                                        maxLength={6}
                                    />

                                </div>


                                <div className="col-md-6">

                                    <label className="profile-label">
                                        Country
                                    </label>

                                    <input
                                        className="profile-input"
                                        type="text"
                                        name="country"
                                        value={editing ? formData.address.country : profile.address.country}
                                        onChange={handleAddressChange}
                                        disabled={!editing}
                                    />

                                </div>

                            </div>

                        </div>


                        {/* ACTION BUTTONS */}

                        {editing && (

                            <div className="profile-actions">

                                <button
                                    type="button"
                                    className="profile-cancel-btn"
                                    onClick={handleCancel}
                                    disabled={saving}
                                >
                                    <FaTimes /> Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="profile-save-btn"
                                    disabled={saving}
                                >

                                    {saving ? (

                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Saving...
                                        </>

                                    ) : (

                                        <>
                                            <FaSave /> Save Changes
                                        </>

                                    )}

                                </button>

                            </div>

                        )}

                    </form>

                </div>

            </div>

        </div>

    );

}

export default Profile;

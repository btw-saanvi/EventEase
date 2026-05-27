import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Camera, Save, Lock, User, Mail, Phone, MapPin } from "lucide-react";
import { useAuthContext } from "../context/AuthContext";
import api from "../lib/api";
import { toast } from "sonner";

export default function Profile() {
  const { user, updateUser } = useAuthContext();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.location || "",
    bio: user?.bio || "",
  });
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);

  const updateMutation = useMutation({
    mutationFn: (data) => api.put("/profile", data),
    onSuccess: (res) => {
      updateUser(res.data.user);
      toast.success("Profile updated successfully!");
    },
    onError: () => toast.error("Failed to update profile"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(form);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return toast.error("Image must be under 2MB");
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
      setForm((f) => ({ ...f, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="py-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-white mb-1">Profile Settings</h1>
        <p className="text-slate-400">Manage your personal information</p>
      </div>

      {/* Avatar Section */}
      <div className="glass-card p-6 mb-6 flex items-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-2xl font-bold text-white">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              (user?.name?.charAt(0) || "U").toUpperCase()
            )}
          </div>
          <label
            htmlFor="avatar-upload"
            className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
          >
            <Camera className="w-4 h-4 text-white" />
          </label>
          <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </div>
        <div>
          <div className="font-heading font-semibold text-white text-lg">{user?.name || "User"}</div>
          <div className="text-sm text-slate-400">{user?.email}</div>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-xs text-slate-500">Verified with Google</span>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-5">
        <h2 className="font-heading text-lg font-semibold text-white flex items-center gap-2">
          <User className="w-5 h-5 text-vapor-lavender" /> Personal Information
        </h2>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
          <input
            id="profile-name"
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="vapor-input w-full"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-2">
            <Mail className="w-3.5 h-3.5" /> Email Address
          </label>
          <input
            id="profile-email"
            type="email"
            value={form.email}
            className="vapor-input w-full opacity-60 cursor-not-allowed"
            disabled
            title="Email cannot be changed (managed by Google)"
          />
          <p className="text-xs text-slate-500 mt-1">Managed by your Google account</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5" /> Phone
            </label>
            <input
              id="profile-phone"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="vapor-input w-full"
              placeholder="+91 98765 43210"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" /> Location
            </label>
            <input
              id="profile-location"
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="vapor-input w-full"
              placeholder="Mumbai, India"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Bio</label>
          <textarea
            id="profile-bio"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            rows={3}
            className="vapor-input w-full resize-none"
            placeholder="Tell us about yourself..."
            maxLength={300}
          />
          <div className="text-xs text-slate-500 text-right mt-1">{form.bio.length}/300</div>
        </div>

        <div className="pt-2">
          <button
            id="save-profile-btn"
            type="submit"
            disabled={updateMutation.isPending}
            className="btn-vapor-solid flex items-center gap-2 px-6 py-2.5 disabled:opacity-50"
          >
            {updateMutation.isPending ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      {/* Google Account Section */}
      <div className="glass-card p-6 mt-6">
        <h2 className="font-heading text-lg font-semibold text-white flex items-center gap-2 mb-4">
          <Lock className="w-5 h-5 text-vapor-lavender" /> Account Security
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-slate-300">Google Authentication</div>
            <div className="text-xs text-slate-500">Your account is secured with Google OAuth</div>
          </div>
          <a
            href="https://myaccount.google.com/security"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-vapor text-xs px-4 py-2"
          >
            Manage →
          </a>
        </div>
      </div>
    </div>
  );
}

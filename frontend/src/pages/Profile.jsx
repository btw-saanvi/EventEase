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
      {/* Header */}
      <div className="mb-8 border-b-3 border-black pb-6">
        <h1 className="font-heading text-4xl text-black uppercase mb-1">Profile Settings</h1>
        <p className="font-body font-bold text-black/60">Manage your personal information</p>
      </div>

      {/* Avatar Section */}
      <div className="brutal-card bg-white p-6 mb-6 flex items-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 border-3 border-black bg-oatly-blue overflow-hidden shadow-[3px_3px_0px_#000] flex items-center justify-center text-2xl font-heading text-black flex-shrink-0">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              (user?.name?.charAt(0) || "U").toUpperCase()
            )}
          </div>
          <label
            htmlFor="avatar-upload"
            className="absolute -bottom-2 -right-2 w-8 h-8 border-2 border-black bg-oatly-yellow shadow-[2px_2px_0px_#000] flex items-center justify-center cursor-pointer hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#000] transition-all"
          >
            <Camera className="w-4 h-4 text-black" />
          </label>
          <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </div>
        <div>
          <div className="font-heading text-xl text-black uppercase leading-tight">{user?.name || "User"}</div>
          <div className="text-sm font-body font-bold text-black/60 mt-0.5">{user?.email}</div>
          <div className="flex items-center gap-1.5 mt-2 bg-oatly-green border-2 border-black shadow-[1.5px_1.5px_0px_#000] px-2 py-0.5 w-fit">
            <div className="w-2 h-2 rounded-full bg-black/60" />
            <span className="text-[10px] font-heading uppercase text-black">Verified with Google</span>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="brutal-card bg-white p-6 space-y-5">
        <div className="flex items-center justify-between border-b-2 border-black pb-3">
          <h2 className="font-heading text-xl text-black uppercase flex items-center gap-2">
            <User className="w-5 h-5 text-black" /> Personal Information
          </h2>
          <span className="text-[10px] font-heading uppercase bg-oatly-yellow border border-black px-2 py-0.5 shadow-[1px_1px_0px_#000]">
            🔒 Shared only with Favorited Vendors
          </span>
        </div>

        <div className="bg-oatly-blue/20 border-2 border-black p-3 text-xs font-body font-bold text-black/80">
          🛡️ Privacy Protection: Your phone, email, and location are kept private. They are only made visible to vendors that you explicitly save/favorite in your marketplace list!
        </div>

        <div>
          <label className="block text-sm font-heading uppercase text-black mb-1.5">Full Name</label>
          <input
            id="profile-name"
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input-brutal w-full"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label className="block text-sm font-heading uppercase text-black mb-1.5 flex items-center gap-2">
            <Mail className="w-4 h-4" /> Email Address
          </label>
          <input
            id="profile-email"
            type="email"
            value={form.email}
            className="input-brutal w-full opacity-60 cursor-not-allowed bg-oatly-bg"
            disabled
            title="Email cannot be changed (managed by Google)"
          />
          <p className="text-xs font-body font-bold text-black/50 mt-1">Managed by your Google account</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-heading uppercase text-black mb-1.5 flex items-center gap-2">
              <Phone className="w-4 h-4" /> Phone
            </label>
            <input
              id="profile-phone"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="input-brutal w-full"
              placeholder="+91 98765 43210"
            />
          </div>
          <div>
            <label className="block text-sm font-heading uppercase text-black mb-1.5 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Location
            </label>
            <input
              id="profile-location"
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="input-brutal w-full"
              placeholder="Mumbai, India"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-heading uppercase text-black mb-1.5">Bio</label>
          <textarea
            id="profile-bio"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            rows={3}
            className="input-brutal w-full resize-none"
            placeholder="Tell us about yourself..."
            maxLength={300}
          />
          <div className="text-xs font-body font-bold text-black/50 text-right mt-1">{form.bio.length}/300</div>
        </div>

        <div className="pt-2">
          <button
            id="save-profile-btn"
            type="submit"
            disabled={updateMutation.isPending}
            className="btn-brutal btn-brutal-pink flex items-center gap-2 px-6 py-2.5 disabled:opacity-50"
          >
            {updateMutation.isPending ? (
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4 text-black" />
            )}
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      {/* User Written Reviews Overview */}
      <div className="brutal-card bg-white p-6 mt-6">
        <h2 className="font-heading text-lg text-black uppercase flex items-center gap-2 mb-3 border-b-2 border-black/10 pb-3">
          ⭐ My Written Reviews for Vendors
        </h2>
        <p className="font-body font-bold text-xs text-black/70 mb-4">
          All reviews you have published for vendors are linked to your profile and displayed to vendors you interact with.
        </p>
        <a href="/reviews" className="btn-brutal btn-brutal-yellow text-xs px-4 py-2 inline-block">
          View & Manage Written Reviews →
        </a>
      </div>

      {/* Google Account Section */}
      <div className="brutal-card bg-white p-6 mt-6">
        <h2 className="font-heading text-lg text-black uppercase flex items-center gap-2 mb-4 border-b-2 border-black/10 pb-3">
          <Lock className="w-5 h-5 text-black" /> Account Security & Vendor Visibility
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-heading uppercase text-black flex items-center gap-2">
              <span>Vendor Contact Sharing: Only Favorited Vendors</span>
            </div>
            <div className="text-xs font-body font-bold text-black/50 mt-0.5">Your personal contact data is strictly hidden from un-saved vendors</div>
          </div>
          <a
            href="/vendors"
            className="btn-brutal text-xs px-4 py-2"
          >
            My Favorited Vendors →
          </a>
        </div>
      </div>
    </div>
  );
}

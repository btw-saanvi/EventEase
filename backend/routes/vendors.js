const express = require("express");
const SavedVendor = require("../models/SavedVendor");
const vendorsData = require("../data/vendors");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

// GET /api/vendors — public catalog with search/filter/sort (no auth needed)
router.get("/", async (req, res) => {
  try {
    const { search, category, sortBy } = req.query;
    let result = [...vendorsData];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.category.toLowerCase().includes(q) ||
          (v.location && v.location.toLowerCase().includes(q))
      );
    }
    if (category && category !== "All" && category !== "") {
      result = result.filter((v) => v.category === category);
    }
    if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);
    else if (sortBy === "price") result.sort((a, b) => (a.price || 0) - (b.price || 0));
    else if (sortBy === "name") result.sort((a, b) => a.name.localeCompare(b.name));

    res.json({ vendors: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// All routes below require auth
router.use(verifyToken);

// GET /api/vendors/saved — get saved vendors for current user
router.get("/saved", async (req, res) => {
  try {
    const saved = await SavedVendor.find({ userId: req.user.id }).sort({ createdAt: -1 });
    // Enrich with vendor details from static data
    const enriched = saved.map((s) => {
      const details = vendorsData.find((v) => String(v.id) === String(s.vendorId) || String(v._id) === String(s.vendorId));
      return { ...s.toObject(), vendorDetails: details || null };
    });
    res.json({ saved: enriched });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/vendors/save — save a vendor
router.post("/save", async (req, res) => {
  try {
    const { vendorId } = req.body;
    if (!vendorId) return res.status(400).json({ message: "vendorId is required" });

    const existing = await SavedVendor.findOne({ userId: req.user.id, vendorId });
    if (existing) return res.status(409).json({ message: "Vendor already saved" });

    const saved = await SavedVendor.create({ userId: req.user.id, vendorId });
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/vendors/save/:vendorId — unsave a vendor
router.delete("/save/:vendorId", async (req, res) => {
  try {
    const saved = await SavedVendor.findOneAndDelete({
      userId: req.user.id,
      vendorId: req.params.vendorId,
    });
    if (!saved) return res.status(404).json({ message: "Saved vendor not found" });
    res.json({ message: "Vendor removed from saved" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

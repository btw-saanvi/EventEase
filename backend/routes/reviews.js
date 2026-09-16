const express = require("express");
const validator = require("validator");
const Review = require("../models/Review");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();
router.use(verifyToken);

// Fields a user may set on a review. These mirror the Review schema AND the
// ReviewModal payload in the frontend: the modal collects a vendor *name*
// (not an id), the review text lives in `body`, and photos live in `image`.
// `comment` is kept as an alias so older clients keep working.
const ALLOWED_FIELDS = [
  "vendorId", "vendorName", "vendorCategory", "rating",
  "title", "body", "comment", "image",
];

const MAX_BODY_CHARS = 1000;        // Review.body maxlength
const MAX_TITLE_CHARS = 120;        // Review.title maxlength
const MAX_IMAGE_CHARS = 3_000_000;  // ~2MB image once base64-encoded

function pickAllowed(body) {
  const data = {};
  ALLOWED_FIELDS.forEach((f) => {
    if (body[f] !== undefined) data[f] = body[f];
  });
  return data;
}

// "Royal Caterers" -> "royal-caterers", so reviews written from the UI (which
// only collects a vendor name) can still be grouped per vendor on /vendor/:id.
function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 100);
}

function isUsableImage(value) {
  const str = String(value);
  if (/^data:image\/(png|jpe?g|gif|webp|avif);base64,[a-z0-9+/=\s]+$/i.test(str)) return true;
  return validator.isURL(str, { protocols: ["http", "https"], require_protocol: true });
}

// Validates + sanitizes a create/update payload.
// Returns { error: "message" } when invalid, otherwise { data: cleanedFields }.
function buildReviewPayload(raw, { isCreate }) {
  const data = pickAllowed(raw);

  // `comment` is an alias of `body` (older clients / older API shape)
  if (data.body === undefined && data.comment !== undefined) data.body = data.comment;
  delete data.comment;

  if (isCreate) {
    const bodyText = validator.trim(String(data.body ?? "")).slice(0, MAX_BODY_CHARS);
    if (!bodyText) return { error: "Review text is required." };
    data.body = bodyText;
  } else if (data.body !== undefined) {
    const bodyText = validator.trim(String(data.body)).slice(0, MAX_BODY_CHARS);
    if (!bodyText) return { error: "Review text cannot be empty." };
    data.body = bodyText;
  }

  if (isCreate || data.vendorName !== undefined) {
    const vendorName = validator.trim(String(data.vendorName ?? "")).slice(0, 200);
    if (!vendorName) return { error: "Vendor name is required." };
    data.vendorName = vendorName;
  }

  // vendorId is optional — derive a stable one from the vendor name when the
  // client doesn't supply it (e.g. a review written from the Reviews page).
  const providedVendorId = data.vendorId === null ? "" : String(data.vendorId ?? "").trim();
  if (providedVendorId) {
    data.vendorId = providedVendorId.slice(0, 200);
  } else if (isCreate) {
    data.vendorId = slugify(data.vendorName);
  } else {
    delete data.vendorId;
  }

  if (isCreate || data.rating !== undefined) {
    const rating = Number(data.rating);
    if (!Number.isFinite(rating) || rating < 1 || rating > 5)
      return { error: "Rating must be between 1 and 5." };
    data.rating = rating;
  }

  // title is optional in the UI, so an empty one is allowed
  if (isCreate || data.title !== undefined) {
    data.title = validator.trim(String(data.title ?? "")).slice(0, MAX_TITLE_CHARS);
  }

  if (data.vendorCategory !== undefined) {
    data.vendorCategory = validator.trim(String(data.vendorCategory)).slice(0, 100);
  }

  if (data.image !== undefined && data.image !== null && data.image !== "") {
    const image = String(data.image);
    if (image.length > MAX_IMAGE_CHARS)
      return { error: "Image is too large. Please use an image under 2MB." };
    if (!isUsableImage(image))
      return { error: "Image must be an uploaded image or a valid image URL." };
    data.image = image;
  } else if (isCreate) {
    data.image = "";
  }

  return { data };
}

// GET /api/reviews — user's own reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ reviews });
  } catch (err) {
    console.error("Get reviews error:", err.message);
    res.status(500).json({ message: "Could not fetch reviews." });
  }
});

// GET /api/reviews/vendor/:vendorId — public reviews for a vendor
router.get("/vendor/:vendorId", async (req, res) => {
  try {
    const reviews = await Review.find({ vendorId: req.params.vendorId })
      .populate("userId", "name avatar") // only expose name and avatar, NOT email/phone
      .sort({ createdAt: -1 });
    res.json({ reviews });
  } catch (err) {
    console.error("Get vendor reviews error:", err.message);
    res.status(500).json({ message: "Could not fetch vendor reviews." });
  }
});

// POST /api/reviews — create review (no mass assignment)
router.post("/", async (req, res) => {
  try {
    const { data, error } = buildReviewPayload(req.body, { isCreate: true });
    if (error) return res.status(400).json({ message: error });

    const review = await Review.create({ ...data, userId: req.user.id });
    res.status(201).json(review);
  } catch (err) {
    console.error("Create review error:", err.message);
    res.status(400).json({ message: err.message || "Could not create review." });
  }
});

// PUT /api/reviews/:id — update own review only
router.put("/:id", async (req, res) => {
  try {
    const { data, error } = buildReviewPayload(req.body, { isCreate: false });
    if (error) return res.status(400).json({ message: error });

    // A review must never be re-pointed at an arbitrary vendor via a raw id, but
    // editing the vendor *name* is allowed (the modal exposes it), so keep the
    // grouping slug in sync with the new name.
    delete data.vendorId;
    if (data.vendorName !== undefined) data.vendorId = slugify(data.vendorName);

    const review = await Review.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      data,
      { new: true, runValidators: true }
    );
    if (!review) return res.status(404).json({ message: "Review not found." });
    res.json(review);
  } catch (err) {
    console.error("Update review error:", err.message);
    res.status(400).json({ message: err.message || "Could not update review." });
  }
});

// DELETE /api/reviews/:id — only delete own reviews
router.delete("/:id", async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!review) return res.status(404).json({ message: "Review not found." });
    res.json({ message: "Review deleted." });
  } catch (err) {
    console.error("Delete review error:", err.message);
    res.status(500).json({ message: "Could not delete review." });
  }
});

module.exports = router;

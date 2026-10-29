import React, { useState } from "react";
import {
  Plus,
  ShieldCheck,
  KeyRound,
  ArrowRight,
  PackageCheck,
  Search,
  Upload,
  X,
  MapPin,
  Calendar,
  Sparkles,
  Info
} from "lucide-react";
import { categories, colorThemes, emojiOptions } from "../data/mockData";

export function Report({ onSubmit, go }) {
  const [type, setType] = useState("Lost");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("Today");
  const [description, setDescription] = useState("");
  const [secret, setSecret] = useState("");
  const [contact, setContact] = useState("");
  const [emoji, setEmoji] = useState("📦");
  const [color, setColor] = useState("mint");
  const [imagePreview, setImagePreview] = useState(null);
  const [aiQuestions, setAiQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  // File upload handler for browser preview
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        alert("Please select a JPG, PNG, or WebP image.");
        e.target.value = "";
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        alert("Please select an image smaller than 2 MB for this browser demo.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
  };

  const generateQuestions = async () => {
    setAiError("");
    if (!title.trim() || !description.trim() || !secret.trim()) {
      setAiError("Add the item title, public description, and private ownership clue before asking AI to suggest verification questions.");
      return;
    }
    // Frontend demo only: these are rule-based sample prompts, not live AI output.
    setAiLoading(true);
    window.setTimeout(() => {
      const suggestions = [
        { question: `What distinctive feature of the ${title.trim()} would help confirm it is yours?` },
        { question: `Can you describe one detail that is not included in the public description of this ${category.toLowerCase()} item?` },
        { question: `Where and approximately when did you last see or use this item?` },
      ];
      setAiQuestions(suggestions);
      setSelectedQuestions(suggestions.map((_, index) => index));
      setAiLoading(false);
      setAiError("Demo suggestions only — no AI service was called. The finder should review each question before publishing.");
    }, 350);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !location.trim() || !description.trim()) {
      alert("Please fill in all required fields marked with *");
      return;
    }

    onSubmit({
      type,
      title: title.trim(),
      category,
      location: location.trim(),
      date,
      description: description.trim(),
      secret: secret.trim(),
      contact: contact.trim(),
      emoji,
      color,
      imageUrl: imagePreview,
      verificationQuestions: aiQuestions.filter((_, index) => selectedQuestions.includes(index)).map((entry) => entry.question)
    });
  };

  return (
    <section className="page-wrap report-layout">
      {/* Informative Left Sidebar */}
      <div className="report-side">
        <div className="eyebrow">
          <Sparkles size={14} /> CAMPUS CARE &amp; RESPONSIBILITY
        </div>
        <h1>
          Every item has a way <span>back home.</span>
        </h1>
        <p>
          Share public details (color, brand, location) so classmates can spot it. Keep one or two
          distinctive private details secret for safe ownership verification.
        </p>

        {/* Privacy Highlight Card */}
        <div className="privacy-card">
          <ShieldCheck size={24} />
          <div>
            <strong>Design Thinking Privacy Shield</strong>
            <p>
              Public cards NEVER display phone numbers, student ID numbers, or the secret ownership
              clue. This stops dishonest claims before they happen.
            </p>
          </div>
        </div>

        {/* Workflow Mini Steps */}
        <div className="mini-steps">
          <div>
            <span>01</span>
            <p>
              <strong>1. Submit Public &amp; Private Details</strong>
              <small>Public features are posted; secret proof stays private.</small>
            </p>
          </div>
          <div>
            <span>02</span>
            <p>
              <strong>2. Campus Moderation Check</strong>
              <small>New posts enter review queue to filter spam or duplicates.</small>
            </p>
          </div>
          <div>
            <span>03</span>
            <p>
              <strong>3. Supervised Handover</strong>
              <small>Reunite at a verified campus desk with student ID.</small>
            </p>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <form className="report-form" onSubmit={handleSubmit}>
        <div className="form-title">
          <span className="form-icon">
            <Plus size={20} />
          </span>
          <div>
            <h2>Report an Item</h2>
            <p>Fields marked with * are required.</p>
          </div>
        </div>

        {/* Item Type: Lost vs Found Toggle */}
        <label className="field-label">What are you reporting? *</label>
        <div className="type-toggle" role="group" aria-label="Report Type">
          <button
            type="button"
            className={`type-option ${type === "Lost" ? "type-active lost-active" : ""}`}
            onClick={() => setType("Lost")}
          >
            <Search size={18} />
            <span>
              <strong>I lost something</strong>
              <small>Help me find my belongings</small>
            </span>
          </button>
          <button
            type="button"
            className={`type-option ${type === "Found" ? "type-active found-active" : ""}`}
            onClick={() => setType("Found")}
          >
            <PackageCheck size={18} />
            <span>
              <strong>I found something</strong>
              <small>Help it get back to its owner</small>
            </span>
          </button>
        </div>

        {/* Item Name */}
        <label className="field-label" htmlFor="item-title">
          Item Name / Title *
          <span className="char-count">({title.length}/70)</span>
        </label>
        <input
          id="item-title"
          className="field"
          required
          maxLength={70}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Matte black Sony WH-1000XM4 headphones"
        />

        {/* Category & Date Grid */}
        <div className="field-grid">
          <div>
            <label className="field-label" htmlFor="item-category">
              Category *
            </label>
            <select
              id="item-category"
              className="field"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.slice(1).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="field-label" htmlFor="item-date">
              When? *
            </label>
            <select
              id="item-date"
              className="field"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            >
              <option value="Today">Today</option>
              <option value="Yesterday">Yesterday</option>
              <option value="2–3 days ago">2–3 days ago</option>
              <option value="This week">This week</option>
              <option value="Earlier this month">Earlier this month</option>
            </select>
          </div>
        </div>

        {/* Campus Location */}
        <label className="field-label" htmlFor="item-location">
          Where was it {type === "Lost" ? "last seen" : "found"}? *
        </label>
        <input
          id="item-location"
          className="field"
          required
          maxLength={100}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Central Library, 2nd floor silent area, table #12"
        />
        {/* Quick location chips */}
        <div className="location-chips">
          <span className="location-chip-label">Quick select:</span>
          {["Library", "Cafeteria", "Block A", "Block B", "SAC", "Sports Complex", "Auditorium"].map(
            (loc) => (
              <button
                key={loc}
                type="button"
                className="chip-btn"
                onClick={() => setLocation((prev) => (prev ? `${prev}, ${loc}` : loc))}
              >
                + {loc}
              </button>
            )
          )}
        </div>

        {/* Public Description */}
        <label className="field-label" htmlFor="item-description">
          Public Description *
          <span className="char-count">({description.length}/500)</span>
        </label>
        <textarea
          id="item-description"
          className="field textarea"
          required
          minLength={10}
          maxLength={500}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe general color, brand, approximate size, or external appearance visible to anyone..."
        />

        {/* Private Secret Clue Field */}
        <div className="secret-field-box">
          <label className="field-label secret-label" htmlFor="item-secret">
            <KeyRound size={15} /> Private Ownership Clue
            <span className="privacy-pill">KEPT HIDDEN ON PUBLIC BOARD</span>
          </label>
          <textarea
            id="item-secret"
            className="field textarea short-textarea"
            maxLength={250}
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="A private detail only the genuine owner knows (e.g. scratch on the corner, keychain charm, sticker on underside, specific items inside)..."
          />
          <div className="private-note">
            <Info size={16} />
            <span>
              <strong>How this works:</strong> This clue will NOT appear on the public card. When a
              claimant steps forward, campus moderators will compare their claim to this secret to
              verify ownership!
            </span>
          </div>
        </div>

        {/* Contact Info (Only for Moderator) */}
        <label className="field-label" htmlFor="item-contact">
          Your Campus Contact / Roll No <span className="optional">(Confidential)</span>
        </label>
        <input
          id="item-contact"
          className="field"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="e.g. roll24cs102@campus.edu or Phone (Visible only to Campus Desk)"
        />

        {/* Color Theme Selector */}
        <label className="field-label">Card Theme Color</label>
        <div className="color-options" role="group" aria-label="Card Theme Color">
          {colorThemes.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`color-chip ${color === c.id ? "color-selected" : ""}`}
              style={{ backgroundColor: c.hex, borderColor: c.border }}
              onClick={() => setColor(c.id)}
              title={c.name}
            >
              {color === c.id && <span className="color-check">&bull;</span>}
            </button>
          ))}
          <span className="color-name-display">
            Selected: {colorThemes.find((c) => c.id === color)?.name}
          </span>
        </div>

        {/* Emoji Selector */}
        <label className="field-label">Visual Marker / Icon</label>
        <div className="emoji-options" role="group" aria-label="Emoji Icon">
          {emojiOptions.map((em) => (
            <button
              key={em}
              type="button"
              className={`emoji-option ${emoji === em ? "emoji-selected" : ""}`}
              onClick={() => setEmoji(em)}
            >
              {em}
            </button>
          ))}
        </div>

        {/* Photo Upload Preview */}
        <label className="field-label">Attach Item Photo (JPG, PNG or WebP; up to 2MB)</label>
        <div className="upload-box">
          {imagePreview ? (
            <div className="image-preview-wrap">
              <img src={imagePreview} alt="Upload preview" className="preview-img" />
              <button
                type="button"
                className="remove-img-btn"
                onClick={removeImage}
                title="Remove photo"
              >
                <X size={16} /> Remove
              </button>
            </div>
          ) : (
            <label className="upload-dropzone">
              <Upload size={22} />
              <span>Click to select an image from your device</span>
              <small>JPG, PNG or WebP up to 2MB (preview only in this phase)</small>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </label>
          )}
        </div>

        {/* AI-assisted question drafting: finder must approve before publication */}
        <div className="ai-question-box">
          <div className="ai-question-heading">
            <Sparkles size={18} />
            <div>
              <strong>Ownership-verification question suggestions</strong>
              <p>Prototype mode: sample questions are generated in your browser, not by a live AI service. Review and select questions before submitting.</p>
            </div>
          </div>
          <button className="button button-outline" type="button" onClick={generateQuestions} disabled={aiLoading}>
            <Sparkles size={16} /> {aiLoading ? "Generating questions…" : aiQuestions.length ? "Regenerate suggestions" : "Suggest demo questions"}
          </button>
          {aiError && <p className="ai-question-error" role="alert">{aiError}</p>}
          {aiQuestions.length > 0 && (
            <div className="ai-question-list">
              <p className="ai-question-approval">Select the questions you approve. Only selected question text is attached to this demo report.</p>
              {aiQuestions.map((entry, index) => (
                <label className="ai-question-option" key={`${index}-${entry.question}`}>
                  <input type="checkbox" checked={selectedQuestions.includes(index)} onChange={(event) => setSelectedQuestions((current) => event.target.checked ? [...current, index] : current.filter((value) => value !== index))} />
                  <span>{entry.question}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button className="button button-dark button-full" type="submit">
          Submit for Campus Moderation <ArrowRight size={17} />
        </button>

        <p className="form-disclaimer">
          By submitting, you agree to follow campus community guidelines and coordinate any return
          through authorized campus supervision.
        </p>
      </form>
    </section>
  );
}

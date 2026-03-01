"use client";

import { Upload } from "lucide-react";
import { currentUser } from "../../data/mock-user";
import "./ProfilePanel.css";

export default function ProfilePanel() {
  return (
    <div className="profile-panel">
      <div className="profile-header">Profile</div>

      <div className="profile-content">
        <div className="profile-info">
          <div className="profile-avatar">
            {currentUser.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div className="profile-name">{currentUser.name}</div>
          <div className="profile-title">{currentUser.title}</div>
          <div className="profile-email">{currentUser.email}</div>
        </div>

        <div className="profile-section">
          <div className="profile-section-label">Skills</div>
          <div className="profile-skills">
            {currentUser.skills.map((skill) => (
              <span key={skill} className="profile-skill">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="profile-section">
          <div className="profile-section-label">Resume</div>
          <button className="profile-upload-button">
            <Upload size={16} />
            <span>Upload Resume</span>
          </button>
        </div>
      </div>
    </div>
  );
}

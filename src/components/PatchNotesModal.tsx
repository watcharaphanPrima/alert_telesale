import { X, Sparkles, Wrench } from 'lucide-react';
import { ReleaseNote } from '../lib/changelog';
import './PatchNotesModal.css';

interface PatchNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  changelog: ReleaseNote[];
  currentVersion: string;
}

export function PatchNotesModal({ isOpen, onClose, changelog, currentVersion }: PatchNotesModalProps) {
  if (!isOpen) return null;

  // โชว์เฉพาะเวอร์ชันล่าสุด 1 หรือ 2 ตัว เพื่อไม่ให้ยาวเกินไป
  const displayNotes = changelog.slice(0, 2);

  return (
    <div className="patch-notes-overlay">
      <div className="patch-notes-modal animate-scale-up">
        <button className="patch-notes-close" onClick={onClose} aria-label="Close patch notes">
          <X size={20} />
        </button>

        <div className="patch-notes-header">
          <div className="patch-notes-icon">
            <Sparkles size={24} color="var(--primary)" />
          </div>
          <h2>มีอะไรใหม่ในเวอร์ชัน {currentVersion}?</h2>
          <p>เรามีการอัปเดตระบบเพื่อให้คุณทำงานได้สะดวกขึ้น</p>
        </div>

        <div className="patch-notes-content">
          {displayNotes.map((note, index) => (
            <div key={note.version} className="patch-version-block">
              <div className="patch-version-header">
                <h3>เวอร์ชัน {note.version}</h3>
                <span className="patch-date">{note.date}</span>
              </div>

              {note.features && note.features.length > 0 && (
                <div className="patch-section">
                  <h4 className="patch-section-title feature-title">
                    <Sparkles size={14} /> ฟีเจอร์ใหม่
                  </h4>
                  <ul className="patch-list">
                    {note.features.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {note.fixes && note.fixes.length > 0 && (
                <div className="patch-section">
                  <h4 className="patch-section-title fix-title">
                    <Wrench size={14} /> การแก้ไข
                  </h4>
                  <ul className="patch-list">
                    {note.fixes.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {index < displayNotes.length - 1 && <hr className="patch-divider" />}
            </div>
          ))}
        </div>

        <div className="patch-notes-footer">
          <button className="btn-primary patch-btn" onClick={onClose}>
            รับทราบการอัปเดต
          </button>
        </div>
      </div>
    </div>
  );
}

import { FiX, FiImage, FiTag, FiCheck } from 'react-icons/fi';
import type { SaveNoteParams } from '../../modules/notes/note.repository';
import { useLabelStore } from '../../modules/labels/label.store';
import { useState } from 'react';
import { userUIStore } from '../../modules/ui/ui.store';
import type { Note } from '../../modules/notes/note.entity';

interface NoteModalProps {
  onClose: () => void;
  onSubmit: (params: SaveNoteParams) => void;
  initialNote?: Note;
}

export default function NoteModal({ onClose, onSubmit, initialNote: _ }: NoteModalProps) {
  const { labels } = useLabelStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedLabelIds, setSelectedLabelIds] = useState<string[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { addFlashMessage } = userUIStore();
  const toggleLabel = (labelId: string) => {
    if (selectedLabelIds.includes(labelId)) {
      setSelectedLabelIds((prev) => prev.filter((id) => id !== labelId));
    } else {
      setSelectedLabelIds((prev) => [...prev, labelId]);
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const arrowedType = ['image/jpeg', 'image/png'];
    if (!arrowedType.includes(file.type)) {
      addFlashMessage('画像ファイルはJPEG、PNGのみ対応しています。', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      addFlashMessage('ファイルサイズは5MB以下にしてください、', 'error');
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
      setImageFile(file);
    };
    reader.readAsDataURL(file);
  };
  const handleRemovePreview = () => {
    setPreviewUrl(null);
    setImageFile(null);
  };

  return (
    <div className="note-modal-overlay" onClick={onClose}>
      <div className="note-modal" onClick={(e) => e.stopPropagation()}>
        <div className="note-modal__header">
          <h2 className="note-modal__title">メモを入力</h2>
          <button className="icon-btn note-modal__close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="note-modal__body">
          <div className="form-group">
            <input
              type="text"
              className="form-input note-modal__title-input"
              placeholder="タイトル"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </div>

          <div className="form-group">
            <textarea
              className="form-textarea note-modal__content-textarea"
              placeholder="メモを入力..."
              rows={8}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
              }}
            ></textarea>
          </div>

          <div className="note-modal__labels-section">
            <label className="note-modal__section-label">
              <FiTag className="note-modal__section-icon" />
              ラベル
            </label>
            <div className="note-modal__labels">
              {labels.map((label) => (
                <button
                  className={`note-modal__label-tag ${selectedLabelIds.includes(label.id) ? 'note-modal__label-tag--selected' : ''}`}
                  key={label.id}
                  style={{
                    backgroundColor: selectedLabelIds.includes(label.id)
                      ? label.color
                      : 'transparent',
                    color: selectedLabelIds.includes(label.id)
                      ? 'white'
                      : label.color,
                    border: `2px solid ${label.color}`,
                  }}
                  onClick={() => toggleLabel(label.id)}
                >
                  {selectedLabelIds.includes(label.id) && (
                    <FiCheck className="note-modal__label---check" />
                  )}
                  {label.name}
                </button>
              ))}
            </div>
          </div>

          <div className="note-modal__images-section">
            <label className="note-modal__section-label">
              <FiImage className="note-modal__section-icon" />
              画像（1枚まで）
            </label>
            <div className="note-modal__images">
              {previewUrl ? (
                <div className="note-modal__image-preview">
                  <img
                    src={previewUrl}
                    alt="プレビュー"
                    className="note-modal__image"
                  />
                  <button
                    className="note-modal__image-remove"
                    onClick={handleRemovePreview}
                  >
                    <FiX />
                  </button>
                </div>
              ) : (
                <label className="note-modal__upload-btn">
                  <FiImage />
                  <span>画像をアップロード</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        <div className="note-modal__footer">
          <button className="btn btn-secondary" onClick={onClose}>
            キャンセル
          </button>
          <button
            className="btn btn-primary"
            onClick={() =>
              onSubmit({
                title,
                content,
                labelIds: selectedLabelIds,
                imageFile: imageFile || undefined,
              })
            }
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}

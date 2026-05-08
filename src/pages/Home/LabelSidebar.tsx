import { FiTag, FiPlus, FiX } from 'react-icons/fi';
import LabelModal from '../../components/LabelModal';
import { useEffect, useState } from 'react';
import { userUIStore } from '../../modules/ui/ui.store';
import { labelRepository } from '../../modules/labels/label.repository';
import { useLabelStore } from '../../modules/labels/label.store';
import { useNoteStore } from '../../modules/notes/note.store';

export default function LabelSidebar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addFlashMessage } = userUIStore();
  const { addLabel, setLabels, labels, removeLabel } = useLabelStore();
  const { removeLabelFromNotes } = useNoteStore();
  const fetchLabels = async () => {
    try {
      const labels = await labelRepository.getLabels();
      setLabels(labels);
    } catch (error) {
      console.error(error);
      addFlashMessage('ラベル取得に失敗しました', 'error');
    }
  };
  useEffect(() => {
    fetchLabels();
  }, []);
  const createLabel = async (name: string, color: string) => {
    try {
      const newLabel = await labelRepository.createLabel(name, color);
      addLabel(newLabel);
      addFlashMessage('ラベルを作成しました', 'success');
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      addFlashMessage('ラベル作成に失敗しました', 'error');
    }
  };
  const deleteLabel = async (id: string) => {
    try {
      await labelRepository.deleteLabel(id);
      removeLabel(id);
      removeLabelFromNotes(id);
      addFlashMessage('ラベルを削除しました', 'success');
    } catch (error) {
      console.error(error);
      addFlashMessage('ラベル削除に失敗しました', 'error');
    }
  };
  return (
    <>
      <aside className="label-sidebar">
        <div className="label-sidebar__header">
          <h3 className="label-sidebar__title">
            <FiTag className="label-sidebar__title-icon" />
            ラベル
          </h3>
          <button
            className="icon-btn label-sidebar__add-btn"
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            <FiPlus />
          </button>
        </div>

        <ul className="label-sidebar__list">
          {labels.map((label) => (
            <li className="label-sidebar__item" key={label.id}>
              <div className="label-sidebar__label-btn">
                <span
                  className="label-sidebar__label-color"
                  style={{ backgroundColor: label.color }}
                ></span>
                <span className="label-sidebar__label-name">{label.name}</span>
              </div>
              <button
                className="label-sidebar__delete-btn"
                onClick={() => deleteLabel(label.id)}
              >
                <FiX />
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {isModalOpen && (
        <LabelModal
          onClose={() => setIsModalOpen(false)}
          onSave={createLabel}
        />
      )}
    </>
  );
}

import { FiPlus, FiLogOut } from 'react-icons/fi';
import SearchBar from './SearchBar';
import LabelSidebar from './LabelSidebar';
import NoteCard from './NoteCard';
import './Home.css';
import { Navigate } from 'react-router-dom';
import { useCurrentUserStore } from '../../modules/auth/current-user.store';
import NoteModal from './NoteModal';
import { useEffect, useRef, useState } from 'react';
import { userUIStore } from '../../modules/ui/ui.store';
import { useNoteStore } from '../../modules/notes/note.store';
import {
  noteRepository,
  type SaveNoteParams,
} from '../../modules/notes/note.repository';
import type { Note } from '../../modules/notes/note.entity';
import { useDebouncedCallback } from 'use-debounce';
import { authRepository } from '../../modules/auth/auth.repository';

export default function Home() {
  const { currentUser } = useCurrentUserStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addFlashMessage } = userUIStore();
  const {
    addNote,
    notes,
    setNotes,
    isLoading,
    setIsLoading,
    replaceNote,
    removeNote,
    addNotes,
    resetNotes,
    page,
    hasMore,
    searchQuery,
    setPage,
    setHasMore,
    setSearchQuery,
  } = useNoteStore();
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const limit = 3;
  const fetchNotes = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const response = await noteRepository.getNotes(page, limit, searchQuery);
      if (page === 1) {
        setNotes(response.notes);
      } else {
        addNotes(response.notes);
      }
      setPage(page + 1);
      setHasMore(response.pagination.page < response.pagination.totalPages);
    } catch (error) {
      console.error(error);
      addFlashMessage('メモの取得に失敗しました。', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  const leadMoreRef = useRef<HTMLDivElement | null>(null);
  const handleSearch = useDebouncedCallback((query: string) => {
    setSearchQuery(query);
  }, 500);
  useEffect(() => {
    fetchNotes();
    return () => {
      resetNotes();
    };
  }, [searchQuery]);
  const createNote = async (params: SaveNoteParams) => {
    try {
      const newNote = await noteRepository.createNote(params);
      addNote(newNote);
      addFlashMessage('メモを作成しました', 'success');
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      addFlashMessage('メモの作成に失敗しました', 'error');
    }
  };
  const closeModal = () => {
    setEditingNote(null);
    setIsModalOpen(false);
  };
  const handleCardClick = (note: Note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };
  const updateNote = async (params: SaveNoteParams) => {
    if (!editingNote) return;
    try {
      const updateNote = await noteRepository.updateNote(
        editingNote.id,
        params
      );
      replaceNote(editingNote.id, updateNote);
      addFlashMessage('メモを更新しました', 'success');
      setEditingNote(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      addFlashMessage('メモの更新に失敗しました', 'error');
    }
  };
  const deleteNote = async (id: string) => {
    if (!window.confirm('このメモを削除しますか')) return;
    try {
      await noteRepository.deleteNote(id);
      removeNote(id);
      addFlashMessage('メモを削除しました。', 'success');
    } catch (error) {
      console.error(error);
      addFlashMessage('メモの削除に失敗しました。', 'error');
    }
  };
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !isLoading) {
        fetchNotes();
      }
    });
    if (leadMoreRef.current) {
      observer.observe(leadMoreRef.current);
    }
    return () => {
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, isLoading]);
  const logout = async () => {
    await authRepository.signout();
    addFlashMessage('ログアウトしました。', 'success');
  };
  if (!currentUser) return <Navigate to="/login" />;
  return (
    <div className="home">
      <header className="home-header">
        <div className="home-header__left">
          <div className="home-header__logo">
            <svg
              className="home-header__logo-icon"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" />
            </svg>
            <span className="home-header__logo-text">Google Keep Clone</span>
          </div>
          <SearchBar onSearch={handleSearch} />
        </div>
        <div className="home-header__right">
          <span className="home-header__user">{currentUser.name}</span>
          <button className="icon-btn home-header__logout-btn" onClick={logout}>
            <FiLogOut />
          </button>
        </div>
      </header>

      <div className="home-main">
        <LabelSidebar />

        <main className="home-content">
          <div className="home-content__header">
            <h2 className="home-content__title">すべてのメモ</h2>
            <button
              className="btn btn-primary home-content__add-btn"
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              <FiPlus />
              <span>新しいメモ</span>
            </button>
          </div>

          {/* メモ一覧 - NoteCardコンポーネントを使用 */}
          <div className="notes-grid">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={handleCardClick}
                onDelete={deleteNote}
              />
            ))}
          </div>
          <div ref={leadMoreRef} style={{ height: '20px' }}></div>
          {isLoading && (
            <div
              className="loading"
              style={{ textAlign: 'center', padding: '20px' }}
            >
              読み込み中...
            </div>
          )}
          {!hasMore && notes.length > 0 && (
            <div
              className="no-more"
              style={{ textAlign: 'center', padding: '20px', color: '#666' }}
            >
              全てのメモを表示しました
            </div>
          )}
          {!isLoading && notes.length === 0 && (
            <div className="no-notes">
              <p>メモがありません</p>
              <p>新しいメモを作成してみましょう</p>
            </div>
          )}
        </main>
      </div>
      {isModalOpen && (
        <NoteModal
          onClose={closeModal}
          onSubmit={editingNote ? updateNote : createNote}
          note={editingNote ?? undefined}
        />
      )}
    </div>
  );
}

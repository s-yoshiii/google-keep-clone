import { FiCheckCircle, FiX, FiXCircle } from 'react-icons/fi';
import './FlashMessage.css';
import { userUIStore } from '../modules/ui/ui.store';

export default function FlashMessage() {
  const {flashMessage, removeFlashMessage} = userUIStore();
  if(!flashMessage) return null;
  return (
    <div className='flash-message-container'>
      <div className={`flash-message flash-message--${flashMessage.type}`}>
        <div className='flash-message__icon'>
          {flashMessage.type === 'error' ? <FiXCircle />: <FiCheckCircle />}
        </div>
        <div className='flash-message__content'>{flashMessage.message}</div>
        <button className='flash-message__close' onClick={removeFlashMessage}>
          <FiX />
        </button>
      </div>
    </div>
  );
}

import { Link, Navigate } from 'react-router-dom';
import './Signup.css';
import { useState } from 'react';
import { authRepository } from '../../modules/auth/auth.repository';
import { userUIStore } from '../../modules/ui/ui.store';
import { useCurrentUserStore } from '../../modules/auth/current-user.store';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { addFlashMessage } = userUIStore();
  const [isLoading, setIsLoading] = useState(false);
  const {currentUser,setCurrentUser} = useCurrentUserStore();
  const signup = async() => {
    if (!name || !email || !password) {
      addFlashMessage('全ての項目を入力してください。', 'error')
      return;
    }
    if(password.length < 8) {
      addFlashMessage('パスワードは8文字以上で入力してください。', 'error')
      return;
    }
    setIsLoading(true);
    try {
      const {user, token} = await authRepository.signup(name,email,password);
      setCurrentUser(user);
      localStorage.setItem('token',token);
      addFlashMessage('アカウントを作成しました', 'success');
    } catch (e: unknown) {
      addFlashMessage('アカウント作成に失敗しました。', 'error');
      if (e && typeof e === 'object' && 'response' in e) {
        const axiosErr = e as { response: { status: number; data: unknown } };
        console.error('status:', axiosErr.response.status);
        console.error('data:', axiosErr.response.data);
      } else {
        console.error(e);
      }
    } finally {
      setIsLoading(false);
    }
  }
  if(currentUser) return <Navigate to="/" />
  return (
    <div className='signup-page'>
      <div className='signup-container'>
        <div className='signup-card'>
          <div className='signup-header'>
            <div className='signup-logo'>
              <svg
                className='signup-logo-icon'
                viewBox='0 0 24 24'
                fill='currentColor'
              >
                <path d='M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z' />
              </svg>
              <h1 className='signup-logo-text'>Google Keep Clone</h1>
            </div>
            <p className='signup-subtitle'>アカウントを作成</p>
          </div>

          <div className='signup-form'>
            <div className='form-group'>
              <label htmlFor='username' className='form-label'>
                ユーザー名
              </label>
              <input
                id='username'
                type='text'
                className='form-input'
                placeholder='山田太郎'
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                }}
              />
            </div>

            <div className='form-group'>
              <label htmlFor='email' className='form-label'>
                メールアドレス
              </label>
              <input
                id='email'
                type='email'
                className='form-input'
                placeholder='example@example.com'
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                }}
              />
            </div>

            <div className='form-group'>
              <label htmlFor='password' className='form-label'>
                パスワード
              </label>
              <input
                id='password'
                type='password'
                className='form-input'
                placeholder='8文字以上'
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                }}
              />
            </div>

            <button
              type='button'
              className='btn btn-primary signup-submit-btn'
              onClick={signup}
              disabled={isLoading}
            >
              アカウント作成
            </button>
          </div>

          <div className='signup-footer'>
            <p className='signup-footer-text'>
              既にアカウントをお持ちの方は
              <Link to='/login' className='signup-footer-link'>
                ログイン
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

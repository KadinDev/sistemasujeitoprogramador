import {useState, useContext} from 'react';

import './styles.css';
import logo from '../../assets/logo.png';

import { Link } from 'react-router-dom';

import { AuthContext } from '../../contexts/auth';

export function SignIn() {
  const { signIn, loadingAuth } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit (e) { // recebe o e aqui (event)
    e.preventDefault(); // para não atualizar a página

    if ( email !== '' && password !== ''){
      signIn(email, password);
    } else {
      alert('Preencha os campos!')
    }
  }

  return (
    <div className='container-center'>
      <div className='login'>
    
        <div className='login-area'>
          <img src={logo} alt='Sistema Logo' />
        </div>
        
        <form onSubmit={ handleSubmit } >

          <h1>Entrar</h1>

          <input 
            type='text' 
            placeholder='email@email.com'
            value={email}
            onChange={ (e) => setEmail(e.target.value) }
          />

          <input 
            type='password' 
            placeholder='******'
            value={password}
            onChange={ (e) => setPassword(e.target.value) }
          />

          <button type='submit' >
            { loadingAuth ? 'Aguarde ...' : 'Acessar' }
          </button>

        </form>

        <Link to='/register' >Criar conta</Link>

      </div>
    </div>
  );
}


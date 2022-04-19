import {useState, useContext} from 'react';

import logo from '../../assets/logo.png';

import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';

export function SignUp() {

  const { signUp, loadingAuth } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit (e) { // recebe o e aqui (event)
    e.preventDefault(); // para não atualizar a página

    if( name !== '' && email !== '' && password !== ''){
      signUp(email, password, name); // vc passa na mesma ordem que foi feito no auth.js
    } else {
      alert('Preencha os campos!')
    }
  };

  return (
    <div className='container-center'>
      <div className='login'>
    
        <div className='login-area'>
          <img src={logo} alt='Sistema Logo' />
        </div>
        
        <form onSubmit={ handleSubmit } >

          <h1>Registro</h1>

          <input 
            type='text' 
            placeholder='Nome'
            value={name}
            onChange={ (e) => setName(e.target.value) }
          />

          <input 
            type='text' 
            placeholder='email@email.com'
            value={email}
            onChange={ (e) => setEmail(e.target.value) }
          />

          <input 
            type='Password' 
            placeholder='******'
            value={password}
            onChange={ (e) => setPassword(e.target.value) }
          />

          <button type='submit' >
            { loadingAuth ? 'Cadastrando Usuário ...' : 'Cadastrar' }
          </button>

        </form>

        <Link to='/' >Já possui uma conta?</Link>

      </div>
    </div>
  );
}


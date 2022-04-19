import { useState } from 'react';
import './styles.css';

import { Header } from '../../components/Header';
import { Title } from '../../components/Title';

import { FiUser } from 'react-icons/fi';
import { toast } from 'react-toastify';

import firebase from '../../services/firebaseConnection';

export function Customers(){

    const [nomeFantasia, setNomeFantasia] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [endereco, setEndereco] = useState('');
    const [load, setLoad] = useState(false);

    
    async function handleAdd(e){
        e.preventDefault(); // para não atualizar a página

        if(nomeFantasia !== '' && cnpj !== '' && endereco !== ''){
            
            setLoad(true);

            await firebase.firestore().collection('customers')
            .add({
                nomeFantasia: nomeFantasia,
                cnpj: cnpj,
                endereco: endereco
            }).then(() => {
                setNomeFantasia('');
                setCnpj('');
                setEndereco('');
                toast.info('Empresa cadastrada com sucesso!');
                setLoad(false);
            })
            .catch((error) => {
                console.log(error);
                toast.error('Erro ao cadastrar essa empresa!');
                setLoad(false);
            })
        } else {
            toast.error('Preencha todos os campos!');
            setLoad(false);
        }
    }


    return (
        <div>

            <Header />

            <div className="content">
                <Title name='Clientes'>
                    <FiUser size={25} />
                </Title>

                <div className='container'>

                    <form className='form-profile customers' onSubmit={handleAdd} >
                        <label> Nome fantasia </label>
                        <input
                            type="text"
                            value={nomeFantasia}
                            placeholder='Nome Empresa'
                            onChange={(e) => setNomeFantasia(e.target.value)}
                        />

                        <label> CNPJ </label>
                        <input
                            type="text"
                            value={cnpj}
                            placeholder='Seu CNPJ'
                            onChange={(e) => setCnpj(e.target.value)}
                        />

                        <label> Endereço </label>
                        <input
                            type="text"
                            value={endereco}
                            placeholder='Endereço da empresa'
                            onChange={(e) => setEndereco(e.target.value)}
                        />

                        <button type="submit">
                            { load ? 'Cadastrando' : 'Cadastrar' }
                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
}
import { useState, useEffect, useContext } from 'react';
import "./styles.css";

import { Header } from '../../components/Header';
import { Title } from '../../components/Title';

import {  FiPlusCircle } from 'react-icons/fi';

import firebase from '../../services/firebaseConnection';
import { AuthContext } from '../../contexts/auth';
import { useHistory, useParams } from 'react-router-dom';

import { toast } from 'react-toastify';

export function New(){
    const {id} = useParams(); //pegar o id do item clicado para navegar para editar ele
    const history = useHistory();

    const { user } = useContext(AuthContext);

    const [assunto, setAssunto] = useState('Suporte');
    const [status, setStatus] = useState('Aberto');
    const [complemento, setComplemento] = useState('')

    const [customers, setCustomers] = useState([]);
    const [loadCustomers, setLoadCustomers] = useState(true);
    const [customerSelected, setCustomerSelected] = useState(0);

    const [idCustomer, setIdCustomer] = useState(false);

    useEffect(() => {
        // carregando meus clientes para colocar no selected de Cliente
        async function loadCustomers(){
            await firebase.firestore().collection('customers')
            .get()
            .then((snaphot) => {
                let lista = [];

                snaphot.forEach((doc) => {
                    lista.push({
                        id: doc.id,
                        nomeFantasia: doc.data().nomeFantasia,
                    })
                })

                if(lista.length === 0){
                    console.log('Nenhuma empresa encontrada.');
                    setCustomers([ {id: '1', nomeFantasia: 'FREELA' } ]);
                    setLoadCustomers(false);
                    return;
                }

                // mas se retornar tudo certo, então segue abaixo
                setCustomers(lista);
                setLoadCustomers(false);

                // se tiver um id, quer dizer que estou na tela de edição
                if(id){
                    loadId(lista);
                }

            })
            .catch((error) => {
                console.log('ERROR!', error);
                setLoadCustomers(false);
                setCustomers([ {id: '1', nomeFantasia: '' } ])
            })
        };

        loadCustomers();
    
    },[id]);

    async function loadId(lista){
        await firebase.firestore().collection('chamados').doc(id)
        .get()
        .then((snapshot) => {
            setAssunto(snapshot.data().assunto);
            setStatus(snapshot.data().status);
            setComplemento(snapshot.data().complemento);

            // findIndex é do próprio javascript
            let index = lista.findIndex(item => item.id === snapshot.data().clienteId);
            setCustomerSelected(index);
            setIdCustomer(true);
        })
        .catch((err) => {
            console.log(err);
            setIdCustomer(false);
        })
    }

    async function handleRegisterNewCall(e){
        e.preventDefault();

        // se estiver true quer dizer que o usuário quer editar um chamado
        if(idCustomer){
            await firebase.firestore().collection('chamados')
            .doc(id)
            .update({
                cliente: customers[customerSelected].nomeFantasia,
                clienteId: customers[customerSelected].id, // id do cliente escolhido
                assunto: assunto,
                status: status,
                complemento: complemento,
                userId: user.uid
            })
            .then(() => {
                toast.success('Chamado editado com sucesso!');
                setCustomerSelected(0);
                setComplemento('');

                // navegando usuário de volta para o dashboard
                history.push('/dashboard');
            })
            .catch((err) => {
                toast.error('Ops, error ao editar o chamado, tente novamente mais tarde.');
                console.log(err);
            })

            return;
        };

        await firebase.firestore().collection('chamados')
        .add({
            created: new Date(),

            // customerSelected é o index do cliente selecionado
            // customers é meu array de clientes cadastrados
            cliente: customers[customerSelected].nomeFantasia,
            clienteId: customers[customerSelected].id, // id do cliente escolhido
            assunto: assunto,
            status: status,
            complemento: complemento,
            userId: user.uid // id do usuário que cadastrou o novo pedido 
        })
        .then(()=>{
            toast.success('Chamado criado com sucesso.');
            setComplemento('');
            setCustomerSelected(0);
        })
        .catch((error) => {
            toast.error('Erro ao registrar, tente mais tarde.')
            console.log(error);
        })
    };

    function handleChangeSelect(e){
        // quando mudar o valor no select ele manda para o state assunto
        setAssunto(e.target.value);
    };

    // quando trocar o status
    function handleOptionChange(e){
        setStatus(e.target.value);
    };
     
    // quando troca de cliente
    function handleChangeCustomers(e){
        setCustomerSelected(e.target.value)
    }

    return (
        <div>

            <Header />

            <div className="content">
                <Title name="Novo Chamado">
                    <FiPlusCircle size={25} />
                </Title>


                <div className="container">

                    <form className="form-profile" onSubmit={handleRegisterNewCall}>

                        <label>Cliente</label>
                        
                        {loadCustomers ? (
                            <input type="text" disabled={true}
                            value="Carregando clientes..."/>
                        ) : (
                            <select 
                                value={customerSelected} 
                                onChange={handleChangeCustomers}
                            >
                                {/* assim passo de forma ficticia
                                    <option key={1} value={1}>
                                        Sujeito Programador
                                    </option>

                                */}

                                {/* mas como salvei no firestore e 
                                busco de lá faz assim */}

                                {customers.map((item, index) => {
                                    return (
                                        <option key={item.id} value={index}>
                                            {item.nomeFantasia}
                                        </option>
                                    )
                                })}
                            </select>
                        )}
                        

                        <label>Assunto</label>

                        <select 
                            value={assunto} 
                            onChange={handleChangeSelect} 
                        >

                            <option value="Suporte">Suporte</option>
                            <option value="Visita Técnica">Visita Técnica</option>
                            <option value="Financeiro">Financeiro</option>
                        </select>


                        <label>Status</label>

                        <div className="status">

                            <input 
                                type="radio"
                                name="radio"
                                value="Aberto"

                                onChange={handleOptionChange}
                                checked={ status === 'Aberto' }
                            />
                            <span>Em Aberto</span>

                            <input 
                                type="radio"
                                name="radio"
                                value="Progresso"
                                onChange={handleOptionChange}
                                checked={ status === 'Progresso' }
                            />
                            <span>Em Progresso</span>

                            <input 
                                type="radio"
                                name="radio"
                                value="Atendido"
                                onChange={handleOptionChange}
                                checked={ status === 'Atendido' }
                            />
                            <span>Finalizado</span>

                        </div>


                        <label>Complemento</label>
                        <textarea
                            type="text"
                            placeholder="Descreva seu problema (opcional)"

                            value={complemento}
                            onChange={ (e) => setComplemento(e.target.value) }
                        />

                        <button type="submit">Registrar</button>

                    </form>

                </div>

            </div>

        </div>
    );
}
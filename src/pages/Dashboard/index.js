
import './styles.css';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../contexts/auth';

import { Header } from '../../components/Header';
import { Title } from '../../components/Title';
import { Modal } from '../../components/Modal';

import { FiSearch, FiPlus, FiEdit2, FiMessageSquare } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

import firebase from '../../services/firebaseConnection';

const listRef = firebase.firestore().collection('chamados').orderBy('created', 'desc')

export function Dashboard(){
    const [chamados, setChamados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);
    const [lastDocs, setLastDocs] = useState();
    const [showPostModal, setShowPostModal] = useState(false);
    const [detail, setDetail] = useState();

    useEffect(() => {
        
        async function loadChamados(){
            await listRef.limit(15)
            .get()
            .then((snapshot) => { //snapshot para acessar em tempo real
                updateState(snapshot);
            })
            .catch((error)=>{
                console.log(error);
                setLoadingMore(false);
            })
    
            setLoading(false);
        };

        loadChamados();

        return () => {}
    },[]);

    

    async function updateState(snapshot){
        const isCollectionEmpty = snapshot.size === 0;

        if(!isCollectionEmpty){
            let list = [];

            snapshot.forEach((doc) => {
                list.push({
                    id: doc.id,
                    assunto: doc.data().assunto,
                    cliente: doc.data().cliente,
                    clienteId: doc.data().clienteId,
                    created: doc.data().created,
                    createdFormated: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
                    status: doc.data().status,
                    complemento: doc.data().complemento,
                })
            })

            // pegando o último documento buscado
            const lastDoc = snapshot.docs[snapshot.docs.lenght - 1];

            setChamados(chamados => [...chamados, ...list]);
            setLastDocs(lastDoc); // passo o último documento buscado

        } else {
            setIsEmpty(true);
        }

        setLoadingMore(false);
    };

    async function handleMore(){
        setLoadingMore(true);
        // startAfter = começa depois, depois do lastDocs aqui no caso
        await listRef.startAfter(lastDocs).limit(5)
        .get()
        .then((snapshot) => {
            updateState(snapshot)
        })
    };


    function togglePostModal(item){
        setShowPostModal(!showPostModal);
        setDetail(item);
    };

    if(loading){
        return (
            <div>
                <Header/>

                <div className='content'>
                    <Title name='Atendimentos'>
                        <FiMessageSquare size={25}/>
                    </Title>

                    <div className='container dashboard'>
                        <span>Buscando Chamados...</span>
                    </div>

                </div>
            </div>
        )
    }

    return (
        <div>
            
            <Header/>

            <div className="content">
                <Title name="Atendimentos">
                    <FiMessageSquare size={24} />
                </Title>
                

                { chamados.length == 0 ? (

                <div className='container dashboard'>
                    <span> Nenhuma chamado registrado... </span>

                    <Link to='/new' className='new' >
                        <FiPlus size={25} color='#fff' />
                        Novo Chamado
                    </Link>
                </div>

                ) : (
                    <>
                    <Link to='/new' className='new' >
                        <FiPlus size={25} color='#fff' />
                        Novo Chamado
                    </Link>

                    <table>
                        {/* theade é o cabeçalho da tabela */}
                        <thead>
                            <tr>
                                <th scope='col'> Cliente </th>
                                <th scope='col'> Assunto </th>
                                <th scope='col'> Status </th>
                                <th scope='col'> Cadastrado em </th>
                                <th scope='col'> # </th>
                            </tr>
                        </thead>

                        <tbody>
                            { chamados.map((item, index) => {
                                return (
                                    <tr key={index} > {/* a key é o identificador, no caso aqui o index */}
                                        {/* data-label para eu pegar no css,
                                        e usar para estilização da reponsividade */}
                                        <td data-label='Cliente' > {item.cliente} </td>
                                        <td data-label='Assunto' > {item.assunto} </td>
                                        
                                        <td data-label='Status' >
                                            <span className='badge' style={{
                                                backgroundColor: item.status === 'Aberto' ? '#5cb85c' : '#999'
                                            }} > {item.status} </span>
                                        </td>
                                        
                                        <td data-label='Cadastrado' > {item.createdFormated} </td>
                                        
                                        <td data-label='#' > 
                                            <button 
                                            className='action' 
                                            style={{backgroundColor: '#3583F6'}}>
                                                <FiSearch 
                                                    color='#fff' 
                                                    size={17} 
                                                    onClick={() => togglePostModal(item)} 
                                                />
                                            </button>

                                            <Link 
                                            className='action' 
                                            style={{backgroundColor: '#F6A935'}}
                                            to={`/new/${item.id}`}
                                            >
                                                <FiEdit2 color='#fff' size={17} />
                                            </Link>
                                        </td>
                                    
                                    </tr>
                                )
                            })}
                            
                        </tbody>

                    </table>
                    
                    { loadingMore && <h3 style={{
                        textAlign: 'center', marginTop: 15 
                    }}>Buscando mais chamados...</h3> }

                    { 
                        // se não tiver carregando mais e se não estiver vazia a lista de chamado
                        !loadingMore && !isEmpty && 
                        <button className="btn-more" onClick={handleMore}>Buscar mais</button>
                    }

                    </>
                )}

                
            </div>
                
            { showPostModal && (
                <Modal
                    conteudo={detail}
                    close={togglePostModal}
                />
            ) }

        </div>
    );
}
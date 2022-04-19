import { useContext, useState, useEffect } from 'react';

import { AuthContext } from '../../contexts/auth';
import avatarUser from '../../assets/avatar.png'

import './styles.css';
import { FiSettings, FiUpload } from 'react-icons/fi';

import { Header } from '../../components/Header';
import { Title } from '../../components/Title';

import firebase from '../../services/firebaseConnection';

export function Profile(){

    const { user, signOut, setUser, storageUser } = useContext(AuthContext);

    const [name, setName] = useState(user && user.nome);
    const [email, setEmail] = useState(user && user.email);
    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
    const [imageAvatar, setImageAvatar] = useState(null); // foto enviado pelo user

    // PEGANDO IMAGEM PARA MOSTRAR EM TELA QUANDO EU MANDAR UMA NOVA 
    function handleFile(e){ // pegar a imagem que enviei
        
        if (e.target.files[0]){ // se tem alguma coisa
            const image = e.target.files[0];
        
            if(image.type === 'image/jpeg' || image.type === 'image/png' || image.type === 'image/jpg'){
                
                setImageAvatar(image);

                // estou criando uma URL em cima da imagem que mandei
                setAvatarUrl( URL.createObjectURL(e.target.files[0]) );
            
            } else {
                alert('Envie uma imagem');
                setImageAvatar(null);
            
                return null;
            }
        };
    };

    // MANDANDO IMAGEM PARA O FIREBASE
    // PARA FUNCIONAR DEIXEI TRUE EM RULES NO STORAGE DO FIREBASE
    async function handleUpload(){
        const currentUid = user.uid;

        const uploaTask = await firebase.storage()
        .ref(`images/${currentUid}/${imageAvatar.name}`)
        .put(imageAvatar) // put = enviar
        .then( async () => {
            console.log('Imagem enviada!');

            await firebase.storage().ref(`images/${currentUid}`)
            .child(imageAvatar.name).getDownloadURL() //pega a URL da imagem

            .then( async (url) => {
                let urlFoto = url;

                // altera nome e foto do perfil
                await firebase.firestore().collection('users')
                .doc(user.uid)
                .update({
                    avatarUrl: urlFoto,
                    nome: name,
                })
                .then(() => {
                    let data = {
                        ...user, // tudo o que já tem
                        avatarUrl: urlFoto,
                        nome: name,
                    };
    
                    setUser(data);
                    storageUser(data);
                })
            })
        })
    };

    async function handleSalve(e){
        e.preventDefault();

        // AQUI SOMENTE SE O USER QUISER MUDAR O NOME
        if(imageAvatar === null && name !== ''){

            await firebase.firestore().collection('users')
            .doc(user.uid) // id oo user logado que já peguei ali em cima
            .update({
                nome: name
            })
            .then ( () => {
                let data = {
                    ...user, // tudo o que já tem
                    nome: name,
                };

                setUser(data);
                storageUser(data);
            } ) 
        }

        // AQUI SE COLOCOU NOME E FOTO PARA UPLOAD
        else if ( name !== '' && imageAvatar !== null ) {
            handleUpload();
        }
    };

    return (
        <div>

            <Header/>

            <div className="content">
                <Title name='Meu Perfil' >
                    <FiSettings size={25} />
                </Title>

                <div className='container'>

                    <form className='form-profile' onSubmit={handleSalve} >

                        <label className='label-avatar'>
                            <span>
                                <FiUpload color='#fff' size={25} />
                            </span>

                            <input 
                                type='file' 
                                accept='image/*' 
                                onChange={handleFile}
                            />

                            {avatarUrl == null ? 
                                <img src={avatarUser} alt='Foto Usuário' />
                                :
                                <img src={avatarUrl} />
                            }

                        </label>

                        <label>Nome</label>
                        <input 
                            type='text' 
                            value={name} 
                            onChange={ (e) => setName(e.target.value) } 
                        />

                        <label>Email</label>
                        <input 
                            type='text' 
                            value={email} 
                            disabled={true}  // bloqueado para clique  
                        />

                        <button type='submit'> Salvar </button>

                    </form>
                </div>

                <div className='container'>
                    <button onClick={ () => signOut() } className='logout-btn'>
                        Sair
                    </button>
                </div>

            </div>
        </div>
    )
}
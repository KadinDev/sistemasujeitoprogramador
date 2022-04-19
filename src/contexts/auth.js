import { useState, createContext, useEffect } from 'react';
import firebase from '../services/firebaseConnection';
import { toast } from 'react-toastify';

export const AuthContext = createContext({});

export function AuthProvider( {children} ){
    
    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {

        function loadStorage(){
            const storageUser = localStorage.getItem('SistemaUser');
    
            if(storageUser){
                setUser(JSON.parse(storageUser));
                setLoading(false);
            };
    
            setLoading(false);
        };

        loadStorage();

    },[]);

    // Logando usuário
    async function signIn(email, password) {
        setLoadingAuth(true);
        
        await firebase.auth().signInWithEmailAndPassword(email, password)
        .then( async (value) => {
            let uid = value.user.uid;

            const userProfile = await firebase.firestore().collection('users')
            .doc(uid).get();

            let data = {
                uid: uid,
                nome: userProfile.data().nome,
                avatarUrl: userProfile.data().avatarUrl,
                email: value.user.email
            };

            setUser(data);
            storageUser(data);
            setLoadingAuth(false);
            toast.success(`Bem vindo novamente ${data.nome}!`);
        } )
        .catch( (error) => {
            console.log(error);
            toast.error('Ops, algo deu errado, verifique se preencheu os campos corretamente!');
            setLoadingAuth(false);
        } )
    };

    // Cadastrar usuário
    async function signUp(email, password, name){
        setLoadingAuth(true);

        await firebase.auth().createUserWithEmailAndPassword(email, password)
        .then( async (value) => {
            let uid = value.user.uid;

            await firebase.firestore().collection('users')
            .doc(uid).set({ // cria um documento com o id do user
                nome: name,
                avatarUrl: null,
            })
            .then( () => {
                let data = {
                    uid: uid,
                    name: name,
                    email: value.user.email,
                    avatarUrl: null,
                };

                setUser(data);
                
                storageUser(data); // vai me salvar no localStorage, para ficar sempre logado,
                // até eu deslogar

                setLoadingAuth(false);
                
                toast.success(`Olá ${data.name}, Bem vindo a plataforma!`)
            })
        })
        .catch( (error) => {
            console.log(error);
            toast.error('Ops, algo deu errado, verifique se preencheu os campos corretamente!')
            setLoadingAuth(false);
        })
    };

    function storageUser(data){
        localStorage.setItem('SistemaUser', JSON.stringify(data));
    };

    async function signOut(){
        await firebase.auth().signOut();
        localStorage.removeItem('SistemaUser');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            
            signed: !!user, // esse user acima no State vem como objeto,
            // passando !!user, estou convertendo para boolean (true ou false)

            user, // as informações do usuário
            loading,
            loadingAuth,

            signIn,
            signUp,
            signOut,

            
            /* esses dois abaixo eu mando tbm para quando eu atualizar o perfil
            em configurações, vou precisar mudar os valores nesses duas aqui
            em baixo tbm. passo para cá, para pegar em configurações*/
            setUser,
            storageUser
        }} >
            {children}
        </AuthContext.Provider>
    )
}
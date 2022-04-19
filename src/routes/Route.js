import { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { AuthContext } from '../contexts/auth';

export function RouteWrapper({
    component: Component, // componente que irá renderizar
    isPrivate, // para saber se a rota é privada ou não
    ...rest // e o resto 
}){

    const { signed, loading } = useContext(AuthContext);

    if (loading){
        return(
            <div></div>
        );
    };

    // se não está logado e a rota que está tentando acessar é privada,
    // eu redireciono o usuário
    if(!signed && isPrivate){
        // Redirect é para redirecionamento
        return <Redirect to="/" />
    };

    // se está logado e a tela não é privada vai para o dashboard,
    // ele não terá mais permissão para acessar a tela de login e register,
    // por já está logado na aplicação
    if(signed && !isPrivate){
        return <Redirect to="/dashboard" />
    };

    return (
        <Route

            {...rest}

            // render é o componente que é renderizado
            // agora retorno o componente com todas as propriedades dele
            render={ props => (
                <Component {...props} />
            ) }

        />
    )
}
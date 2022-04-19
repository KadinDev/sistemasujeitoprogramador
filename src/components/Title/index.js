
import './styles.css';


// esse children, significa o que tem dentro dele, no caso onde eu chamo ele
// coloquei um Ícone dentro dele, esse Icon se torna o children
export function Title ( { children, name } ){
    return (
        <div className="title">

            {children} {/* esse é o ícone que coloquei dentro dele */}

            <span> {name} </span>
            
        </div>
    )
}
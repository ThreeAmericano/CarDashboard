import "./Button.css"

const Button = ({value, onClick}) => {
    return(
        <button onClick={onClick}>{value}</button>
    );
};

export default Button;

const Button =(props) => {
    return(
        <div>
            <button className="px-6 py-3  border border-orange  text-white transition-all rounded-full shadow-[-2px 22px 38px 0px rgba(238, 127, 97, 0.29)]"
                    style={{
                        backgroundColor: '#EE7F61',
                      }}
            >
                {props.title}
            </button>
        </div>

    )

}

export default Button;
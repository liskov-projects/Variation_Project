export default function Footer(){
    return (
        <footer className="text-white py-3" style={{backgroundColor: "#34495E"}}>
            <div className="container d-flex justify-content-end align-items-center gap-2">
                <a href="https://www.liskov.dev/" target="_blank" rel="noopener noreferrer" className="text-white">
                    Made by Liskov.Dev&copy;
                </a>
                <img src="liskov-logo-50.png" alt="Liskov Logo" />
            </div>
        </footer>
    )
}
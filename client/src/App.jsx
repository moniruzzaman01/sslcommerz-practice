import { useEffect, useState } from "react";
import "./App.css";
import { useNavigate } from "react-router-dom";

function App() {
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  const handlePayment = () => {
    console.log("clicked");
    fetch("http://localhost:3030/init")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUrl(data.GatewayPageURL);
      });
  };
  useEffect(() => {
    // navigate(url);
    // window.open(url);
  }, [url, navigate]);

  return (
    <>
      <div>
        <p>Pay here</p>
        <button onClick={handlePayment}>Pay</button>
      </div>
    </>
  );
}

export default App;

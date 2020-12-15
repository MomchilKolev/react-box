import React, { useState } from 'react'
import './App.css';
import useWeb3 from './useWeb3'

const App = () => {
  const {loading, error, data} = useWeb3()

  // Example
  const [storageValue, setStorageValue] = useState(0)
  const ref = React.createRef()
  
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>
  
  const { web3, accounts, contract } = data

  // Example
  const handleSubmit = async () => {

    await contract.methods.set(ref.current.value).send({ from: accounts[0] })

    setStorageValue(await contract.methods.get().call())
  }

  return (
    <div className="App">
      {/* Example */}
      <h1>Simple Storage</h1>
      <p>Current address: {accounts[0]} </p>
      <p>Current value: {storageValue} </p>
      <input type="number" ref={ref} min="0" />
      <button type="button" onClick={handleSubmit}>Submit</button>
      {/* /Example */}
    </div>
  );
}

export default App;

/*

💡 Premessa: Stai sviluppando un campo di ricerca intelligente simile a quello di Amazon. Quando l'utente digita, una tendina di suggerimenti mostra i prodotti corrispondenti alla ricerca. Per evitare richieste API eccessive, devi ottimizzare la ricerca con il debounce.

📌 Milestone 1: Creare un campo di ricerca e mostrare la lista dei suggerimenti
Crea un campo di input (<input type="text">) in cui l’utente può digitare.

Effettua una chiamata API a: 
/products?search=[query]

La query deve essere sostituita con il testo digitato.
Mostra i risultati API sotto l'input in una tendina di suggerimenti.

Se l'utente cancella il testo, la tendina scompare.


Obiettivo: Mostrare suggerimenti dinamici in base alla ricerca dell'utente.

*/
import axios from "axios"
import { useState, useEffect, useCallback } from "react"

function debounce(callback, delay) {
  let timer;
  return (value) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      callback(value)
    }, delay)
  }
}



async function getProducts(query, setProducts) {

  try {
    const res = await axios.get(`http://localhost:3333/products?search=${query}`)
    setProducts(res.data)
    console.log(res.data)
  }

  catch {
    console.error("errore nel caricamento dei prodotti!! 🙀🙀🙀")
  }

  finally {
    console.log("operazione completata")
  }

}



function App() {

  const [query, setQuery] = useState("")
  const [products, setProducts] = useState([])

  // creo la versione debouncizzata di getProducts
  const debouncedGetProducts = useCallback(
    debounce((queryValue) => getProducts(queryValue, setProducts), 1000),
    [setProducts]) // qui anche un array vuoto [] andrebbe bene come dipendenza


  useEffect(() => {
    debouncedGetProducts(query, setProducts)
  }, [query, debouncedGetProducts])

  return (
    <>
      <h1>Cerca i prodotti</h1>

      <input type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Digita il nome del prodotto"
      />

      <ul>

        {products.map(product => (

          <li key={product.id}>
            <p>{product.name} </p>
            <p>brand: {product.brand} - price:  {product.price}</p>
            ----------
          </li>

        ))}

      </ul>

    </>
  )
}

export default App

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



async function getProducts(query, setProducts, setSuggestions) {

  try {
    const res = await axios.get(`http://localhost:3333/products?search=${query}`)
    setProducts(res.data)
    setSuggestions(res.data)
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
  const [suggestions, setSuggestions] = useState([])

  // creo la versione debouncizzata di getProducts
  const debouncedGetProducts = useCallback(
    debounce((queryValue) => getProducts(queryValue, setProducts, setSuggestions), 500),
    [setProducts, setSuggestions]) // qui anche un array vuoto [] andrebbe bene come dipendenza


  useEffect(() => {
    debouncedGetProducts(query, setSuggestions)
  }, [query, debouncedGetProducts,])

  const handleSuggestionClick = (product) => {
    setQuery(product.name) // autocompleta il campo al click
    setSuggestions([]) // svuota il box dei suggerimenti
    getProducts(product.name, setProducts, setSuggestions)
  }

  return (
    <>
      <h1>Cerca i prodotti</h1>

      <input type="text" className="search-bar"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Digita il nome del prodotto"
      />

      {query.length > 0 && suggestions.length > 0 && (
        <div className="suggestion-box">
          <p>suggerimenti di ricerca:</p>
          {suggestions.map((product) => (
            <p key={product.id} className="suggestion"
              onClick={() => handleSuggestionClick(product)}
            >

              {product.name}
            </p>
          ))

          }
        </div>
      )}

      <ul className="product-list">

        {products.map(product => (

          <li key={product.id} className="product-card">
            <p>{product.name} </p>
            <p>brand: {product.brand} - price:  {product.price}</p>
            <span className="separator">  ---------- </span>
          </li>

        ))}

      </ul>

    </>
  )
}

export default App

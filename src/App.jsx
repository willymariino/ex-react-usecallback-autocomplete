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

📌 Milestone 2: Implementare il Debounce per Ottimizzare la Ricerca

Attualmente, ogni pressione di tasto esegue una richiesta API. Questo è inefficiente!
Implementa una funzione di debounce per ritardare la chiamata API fino a quando l’utente smette di digitare per un breve periodo (es. 300ms)
Dopo l’implementazione, verifica che la ricerca non venga eseguita immediatamente a ogni tasto premuto, ma solo dopo una breve pausa.

Obiettivo: Ridurre il numero di richieste API e migliorare le prestazioni.

*/

import axios from "axios"
import { useState, useEffect, useCallback } from "react"

// Funzione debounce: limita la frequenza con cui viene chiamata una funzione.
// Riceve una funzione di callback e un delay in ms.
// Restituisce una nuova funzione che, se chiamata ripetutamente, esegue la callback solo dopo che l'utente ha smesso di chiamarla per 'delay' ms.
function debounce(callback, delay) {
  let timer;
  return (value) => {
    clearTimeout(timer) // cancella il timer precedente se esiste
    timer = setTimeout(() => {
      callback(value) // chiama la funzione dopo il delay
    }, delay)
  }
}

// Funzione asincrona che effettua la chiamata API per ottenere i prodotti.
// query: stringa di ricerca
// setProducts: funzione per aggiornare lo stato dei prodotti
// setSuggestions: funzione per aggiornare lo stato dei suggerimenti
async function getProducts(query, setProducts, setSuggestions) {
  try {
    // Effettua la richiesta GET all'API con la query di ricerca
    const res = await axios.get(`http://localhost:3333/products?search=${query}`)
    setProducts(res.data)     // imposta il nuovo stato di products
    setSuggestions(res.data)   // imposta il nuovo stato di suggestions
    console.log(res.data)      // logga i dati ricevuti
  }
  catch {
    // Gestione degli errori in caso di problemi con la richiesta
    console.error("errore nel caricamento dei prodotti!! 🙀🙀🙀")
  }
  finally {
    // Messaggio di completamento operazione (sia successo che errore)
    console.log("operazione completata")
  }
}

// Componente principale dell'applicazione
function App() {
  // Stato per la query di ricerca digitata dall'utente
  const [query, setQuery] = useState("")
  // Stato per la lista dei prodotti restituiti dall'API
  const [products, setProducts] = useState([])
  // Stato per la lista dei suggerimenti da mostrare nella tendina
  const [suggestions, setSuggestions] = useState([])

  // Creo la versione debouncizzata di getProducts.
  // useCallback serve per memorizzare la funzione e non ricrearla ad ogni render.
  // debounce ritarda la chiamata a getProducts di 500ms dopo l'ultimo input.
  const debouncedGetProducts = useCallback(
    debounce((queryValue) => getProducts(queryValue, setProducts, setSuggestions), 500),
    [setProducts, setSuggestions]
  )

  // Effetto che si attiva ogni volta che la query cambia.
  // Chiama la funzione debouncizzata per ottenere i prodotti.
  useEffect(() => {
    debouncedGetProducts(query, setSuggestions)
  }, [query, debouncedGetProducts])

  // Gestisce il click su un suggerimento:
  // - aggiorna la query con il nome del prodotto selezionato
  // - svuota la lista dei suggerimenti
  // - aggiorna la lista dei prodotti con la nuova ricerca
  const handleSuggestionClick = (product) => {
    setQuery(product.name) // autocompleta il campo al click
    setSuggestions([])     // svuota il box dei suggerimenti
    getProducts(product.name, setProducts)
  }

  return (
    <>
      <h1>Cerca i prodotti</h1>

      {/* Campo di input per la ricerca */}
      <input
        type="text"
        className="search-bar"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Digita il nome del prodotto"
      />

      {/* Mostra la tendina dei suggerimenti solo se c'è testo e suggerimenti disponibili */}
      {query.length > 0 && suggestions.length > 0 && (
        <div className="suggestion-box">
          <p>suggerimenti di ricerca:</p>
          {/* Lista dei suggerimenti, ogni suggerimento è cliccabile */}
          {suggestions.map((product) => (
            <p
              key={product.id}
              className="suggestion"
              onClick={() => handleSuggestionClick(product)}
            >
              {product.name}
            </p>
          ))}
        </div>
      )}

      {/* Lista dei prodotti trovati */}
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

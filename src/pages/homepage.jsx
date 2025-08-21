import axios from "axios"
import { useState, useEffect, useCallback } from "react"
import { Link } from "react-router-dom";

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
    catch (error) {
        { console.error("errore nel caricamento dei dettagli del prodotto!! 🙀🙀🙀🙀", error) }
    }

    finally {
        // Messaggio di completamento operazione (sia successo che errore)
        console.log("operazione completata")
    }
}

// Componente principale dell'applicazione
function Homepage() {
    // Stato per la query di ricerca digitata dall'utente
    const [query, setQuery] = useState("")
    // Stato per la lista dei prodotti restituiti dall'API
    const [products, setProducts] = useState([])
    // Stato per la lista dei suggerimenti da mostrare nella tendina
    const [suggestions, setSuggestions] = useState([])

    // Creo la versione debouncizzata di getProducts.
    // useCallback serve per memorizzare la funzione e non ricrearla ad ogni render, senza non funzionerebbe.
    // debounce ritarda la chiamata a getProducts di 500ms dopo l'ultimo input.
    // praticamente debouncedGetProducts e un wrapper di getProducts prima di mandarla a useEffect.
    const debouncedGetProducts = useCallback(
        debounce((queryValue) => getProducts(queryValue, setProducts, setSuggestions), 500),
        [setProducts, setSuggestions]
    )

    // Effetto che si attiva ogni volta che la query cambia.
    // Chiama la funzione debouncizzata per ottenere i prodotti.
    useEffect(() => {
        debouncedGetProducts(query)
    }, [query, debouncedGetProducts])

    /*
    📌 NOTA SU  debouncedGetProducts(query) 
    potresti anche scrivere:
    useEffect(() => {
        debouncedGetProducts(query, setProducts, setSuggestions)
    }, [query, debouncedGetProducts])
    sarebbe comunque corretto, perchè la funzione getProducts può accettare 3 argomenti,
   Ma è ridondante: solo query è lo stato che cambia ogni volta che scrivi nell’input

React non ricrea mai nuove versioni delle funzioni setState (setProducts, setSuggestions, setLoading, ecc.),
quindi non c’è nessun beneficio ad inserirle come dipendenze.

 Regola pratica:
Metti nelle dipendenze solo i valori che cambiano e che, cambiando, devono far rieseguire l’effetto.
Le funzioni setState di React (setProduct, setLoading, ecc.) non cambiano mai, quindi puoi tranquillamente lasciarle fuori.

L’unico motivo per aggiungerle sarebbe se in futuro volessi gestire suggestions in modo diverso da products
(ad esempio mantenere due stati separati con logiche distinte).

Quando ha senso separare davvero?

Se mostri i prodotti in un modo (lista completa, ordinata, con dettagli).
E i suggerimenti in un altro (brevi, limitati, magari solo il nome).
In quel caso diventa utile passare entrambi i setState come argomenti e gestirli diversamente dentro getProducts.

*/


    // Gestisce il click su un suggerimento:
    // - aggiorna la query con il nome del prodotto selezionato
    // - svuota la lista dei suggerimenti
    // - aggiorna la lista dei prodotti con la nuova ricerca
    const handleSuggestionClick = (product) => {
        setQuery(product.name) // autocompleta il campo al click
        setSuggestions([])     // svuota il box dei suggerimenti
        getProducts(product.name, setProducts) // aggiorna la lista dei prodotti in base al suggerimento selezionato
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

            {/* Mostra la tendina dei suggerimenti solo se c'è testo e suggerimenti disponibili 
            in pratica con questo map sto facendo la stessa cosa che faccio con l'altro map che usa lo stato products, reindirizzo in pagina i nomi dei 
            prodotti per mostrarli come suggerimenti, infatti qui mi serve il conditional rendering per fare in modo che a differenza della lista dei prodotti, 
            non vengano sempre mostrati tutti di default, ma solo qua quando c'è del testo nella casella di ricerca, (infatti query.length deve essere maggiore di 0)
            infatti nonostante essendo gli stessi dati, uso uno stato nuovo (suggestions) per fare in modo che il conditional rendering, non si applichi anche allo 
            stato products che regola invece la lista di prodotti daa mostrare in pagina.*/}
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

                {products.map((product) => (

                    <li key={product.id} className="product-card">

                        <Link to={`/product-detail/${product.id}`}>

                            <p>{product.name} </p>
                            <p>brand: {product.brand} - price:  {product.price}</p>
                            <span className="separator">  ---------- </span>

                        </Link>

                    </li>
                ))}

            </ul>
        </>
    )
}

export default Homepage

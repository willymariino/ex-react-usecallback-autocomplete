import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"

async function getProductDetail(id, setProducts) {

    try {
        const res = await axios.get(`http://localhost:3333/products/${id}`)
        setProducts(res.data)
    }

    catch {
        (error) => console.error("errore nel caricamento dei dettagli del prodotto!! 🙀🙀🙀🙀", error)
    }

    finally {
        console.log("operazione terminata")
    }
}

function ProductDetail() {

    const [products, setProducts] = useState(null)
    const { id } = useParams()



    useEffect(() => {
        getProductDetail(id, setProducts)
    }, [id])

    return (
        <>
            <h1>Dettaglio prodotti</h1>

            <div className="card-container">

                <div className="image-container">
                    <img src={`http://localhost:3333/products/${products.image}`} alt="" />
                </div>


            </div>

        </>
    )
}

export default ProductDetail
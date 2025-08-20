import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"

async function getProductDetail(id, setProduct, setLoading) {

    try {
        const res = await axios.get(`http://localhost:3333/products/${id}`)
        setProduct(res.data)
        setLoading(false)
        console.log(res.data)
    }

    catch (error) {
        { console.error("errore nel caricamento dei dettagli del prodotto!! 🙀🙀🙀🙀", error) }
    }

    finally {
        console.log("operazione terminata")
    }
}

function ProductDetail() {

    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const { id } = useParams()


    useEffect(() => {
        getProductDetail(id) // aggiungere anche , setProduct, setLoading sarebbe ridondante dato che è l'unico che cambiano mai perchè non cambiano mai perchè sono garantite stabili da React.
    }, [id])

    if (loading) {
        return (
            <div>caricamento in corso...</div>
        )
    }

    return (
        <>
            <h1>Dettaglio prodotto</h1>

            <div className="card-container">

                <div className="image-container">
                    <img src={`http://localhost:3333/products/${product.image}`} alt="product-image" />
                </div>

                <div className="text-box">

                    <p>name: {product.name}</p>
                    <p>brand: {product.brand}</p>
                    <p>connectivity: {product.connectivity}</p>
                    <p>price: {product.price}</p>
                    <p>rating: {product.rating}</p>
                    <p>wireless: {product.wireless}</p>
                    description:
                    <p> {product.description}</p>

                </div>

            </div>

        </>
    )
}

export default ProductDetail
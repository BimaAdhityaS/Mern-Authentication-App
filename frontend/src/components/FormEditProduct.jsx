import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { useNavigate, useParams} from 'react-router-dom'

const FormEditProduct = () => {
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [msg, setMsg] = useState('')
    const {id} = useParams()
    const navigate = useNavigate()

    const updateProduct = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`http://localhost:5000/products/${id}`, {
                name: name,
                price: price
            })
            navigate('/products')
        } catch (error) {
            if(error.response) {
                setMsg(error.response.data.message)
            }
        }
    }

    useEffect(() => {
        const getProductById = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/products/${id}`)
                setName(response.data.name)
                setPrice(response.data.price)
            } catch (error) {
                if(error.response) {
                    setMsg(error.response.data.message)
                }
            }
        }
        getProductById()
    }, [id])

  return (
    <div>
        <h1 className='title'>Productss</h1>
            <h2 className='subtitle'>Edit Products</h2>
            <div className="card is-shadowless">
                <div className="card-content">
                    <div className="content">
                        <form onSubmit={updateProduct}>
                            <p className='has-text-centered'>{msg}</p>
                            <div className="field">
                                <label className="label">Product Name</label>
                                <div className="control">
                                    <input type="text" className="input" placeholder='Product Name'  value = {name}
                                    onChange = {(e) => setName(e.target.value)}/>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Price</label>
                                <div className="control">
                                    <input type="text" className="input" placeholder='Price'  value = {price}
                                    onChange = {(e) => setPrice(e.target.value)}/>
                                </div>
                            </div>
                            <div className="field">
                                <div className="control">
                                    <button type='submit' className="button is-success">Update</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
    </div>
  )
}

export default FormEditProduct
import React, {useEffect} from 'react'
import Layout from './Layout'
import Productlist from '../components/Productlist'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../features/authSlice'


const Products = () => {
  const dispatch = useDispatch()
    const navigate = useNavigate()
    const { isError } = useSelector(state => state.auth)

    useEffect(() => {
        dispatch(getMe())
    },[dispatch])

    useEffect(() => {
      if(isError){
        navigate('/')
      }
  },[isError ,navigate])

  return (
    <Layout>
        <Productlist />
    </Layout>
  )
}

export default Products
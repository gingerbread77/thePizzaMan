import { useParams } from 'react-router-dom'
import './ProductInfo.css'

const ProductInfo = () => {
  const { id } = useParams()
  return (
    <div>ProductInfo</div>
  )
}

export default ProductInfo
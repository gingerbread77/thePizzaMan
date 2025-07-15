import './Menu.css'
import { category_list } from '../../assets/assets'
import { useState, useContext } from 'react'
import axios from 'axios'
import { baseUrl } from '../../config'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CartContext } from '../../context/CartContext'

const Menu = () => {
  const { foodList } = useContext(CartContext);
  // category default as 'All'
  const [ category,setCategory ] = useState('All');
  
  return (
    <div className="menu">
      <h2>Our Menu</h2>
      <div className="category-list">
        {category_list.map((ctg,index)=>(
          <div key={index} className={ctg.title === category ? "active":""} onClick={()=>setCategory(prev => prev === ctg.title?"All":ctg.title)}>
            <img src={ctg.image} alt={ctg.title} />
            <p>{ctg.title}</p>
          </div>
        ))}
      </div>
      <div className="menu-list">
        {foodList.filter(food => category === 'All' || food.category ===  category).map(food=>(
          <div key={food._id} className="product-card">
            <Link to={`/menu/${food._id}`}><img className="food-img" src={`${baseUrl}${food.image}`} alt={food.title} /></Link>
            <p>{food.name}</p>
            <p>${food.price}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Menu
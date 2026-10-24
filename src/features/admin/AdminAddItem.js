import React, { useState } from 'react'
import ItemsService from '../../services/ItemsService';
import { useNavigate } from 'react-router'

const Admin = () => {
  
    const itemsService = new ItemsService();
    
    const [item, setItem] = useState({
        id:"",
        name: "",
        price: "",
        rating: "",
         image: "",
         category: ""
    })

    const navigate = useNavigate()

    const saveMenu = (e) => {
    e.preventDefault();
    itemsService.createItem(item)
        .then((response) => {
            console.log(response)
            navigate("/menu")
        })
        .catch((error)=>{
            console.log(error)
        });
}

    const reset = (event) => {
        event.preventDefault();
        setItem({
            id:"",
        name: "",
        price: "",
        rating: "",
         image: "",
         category: ""
        })
    } 

    const handleChange = (e) => {
        const value = e.target.value;
        setItem({...item,[e.target.name]:value})
    }

    return (
        <div className='mt-11 min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 flex items-center justify-center'>
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                
                {/* Header Section */}
                <div className="bg-gradient-to-r from-[#ff610c] to-[#f8a67a] px-8 py-6">
                    <h1 className="text-3xl font-bold text-white tracking-wide flex items-center">
                        <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                        </div>
                        Add New Item
                    </h1>
                    <p className="text-blue-100 mt-2">Create a new food item for your menu</p>
                </div>

                {/* Form Section */}
                <div className='px-8 py-8 space-y-6'>
                    
                    {/* Name Field */}
                    <div className='space-y-2'>
                        <label className='flex items-center text-gray-700 font-medium'>
                            <svg className="w-5 h-5 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                            </svg>
                            Name of Food Item
                        </label>
                        <input 
                            type="text" 
                            name="name"
                            value={item.name}
                            onChange={(e) => handleChange(e)}
                            placeholder="Enter food item name"
                            className='w-full h-12 border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:border-gray-300'
                        />
                    </div>

                    {/* Price Field */}
                    <div className='space-y-2'>
                        <label className='flex items-center text-gray-700 font-medium'>
                            <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M13.66 7H16v2h-3.26c.48 1.26 1.78 2.18 3.26 2.18V13c-2.41 0-4.48-1.39-4.95-3.41C10.5 9.83 10 10 9.5 10c-1.25 0-2.25-1-2.25-2.25S8.25 5.5 9.5 5.5c1.25 0 2.25 1 2.25 2.25 0 .17-.02.33-.05.5H13.66z M9.5 7c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5S9.78 7 9.5 7z M7 15H5v-2h2v2z M19 15h-2v-2h2v2z M18 16c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2v-1h12v1z"/>
                            </svg>

                            Price
                        </label>
                        <input 
                            type="text" 
                            name='price'
                            value={item.price}
                            onChange={(e) => handleChange(e)}
                            placeholder="Enter price (e.g., ₹12.99)"
                            className='w-full h-12 border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:border-gray-300'
                        />
                    </div>

                    {/* Rating Field */}
                    <div className='space-y-2'>
                        <label className='flex items-center text-gray-700 font-medium'>
                            <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                            </svg>
                            Rating
                        </label>
                        <input 
                            type="text" 
                            name='rating'
                            value={item.rating}
                            onChange={(e) => handleChange(e)}
                            placeholder="Enter rating (1-5)"
                            className='w-full h-12 border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:border-gray-300'
                        />
                    </div>

                    {/* Image Field */}
                    <div className='space-y-2'>
                        <label className='flex items-center text-gray-700 font-medium'>
                            <svg className="w-5 h-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            Image URL
                        </label>
                        <input 
                            type="text" 
                            name='image'
                            value={item.image}
                            onChange={(e) => handleChange(e)}
                            placeholder="Enter image URL"
                            className='w-full h-12 border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:border-gray-300'
                        />
                    </div>

                    {/* Category Field */}
                    <div className='space-y-2'>
                        <label className='flex items-center text-gray-700 font-medium'>
                            <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                            </svg>
                            Category
                        </label>
                        <input 
                            type="text" 
                            name='category'
                            value={item.category}
                            onChange={(e) => handleChange(e)}
                            placeholder="Enter category (e.g., Snacks , Lunch etc)"
                            className='w-full h-12 border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:border-gray-300'
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className='flex gap-4 pt-6'>
                        <button 
                            onClick={saveMenu} 
                            className='flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center'>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            Save Item
                        </button>
                        <button 
                            onClick={reset}
                            className='flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center'>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                            Clear Form
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Admin
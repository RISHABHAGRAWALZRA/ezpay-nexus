import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import { useAppContext } from '../context/AppContext';

const AddFriend = () => {
  const navigate = useNavigate();
  const { addFriend } = useAppContext();
  
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    email: '',
    ethereumAddress: '',
    telegram: ''
  });
  
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      addFriend(formData);
      navigate('/');
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Add a Friend</h1>
        <p className="text-sm text-gray-500 mt-1">Add friend details to start splitting expenses</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <form onSubmit={handleSubmit}>
          <Input
            label="Name"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter friend's name"
            error={errors.name}
            required
          />
          
          <Input
            label="Nickname"
            id="nickname"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            placeholder="Enter a nickname"
          />
          
          <Input
            label="Email"
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter friend's email"
            error={errors.email}
          />
          
          <Input
            label="Ethereum Address"
            id="ethereumAddress"
            name="ethereumAddress"
            value={formData.ethereumAddress}
            onChange={handleChange}
            placeholder="0x..."
          />
          
          <Input
            label="Telegram"
            id="telegram"
            name="telegram"
            value={formData.telegram}
            onChange={handleChange}
            placeholder="Enter Telegram username"
          />
          
          <div className="flex justify-end gap-3 mt-8">
            <button 
              type="button" 
              onClick={() => navigate('/friends')}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Add Friend
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFriend;

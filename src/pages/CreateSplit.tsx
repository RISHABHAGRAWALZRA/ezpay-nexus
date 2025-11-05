import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Search, ChevronDown } from 'lucide-react';
import Input from '../components/ui/Input';
import { useAppContext } from '../context/AppContext';
import arbitrumLogo from '../assets/arbitrum-arb-logo.png';
import polygonLogo from '../assets/polygon-matic-logo.png';
import ethereumLogo from '../assets/ethereum-eth-logo.png';
import usdcLogo from '../assets/usd-coin-usdc-logo.png';
import usdtLogo from '../assets/tether-usdt-logo.png';

const CreateSplit = () => {
  const navigate = useNavigate();
  const { friends, addSplit } = useAppContext();
  
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    paidBy: 'me', // Default to 'me'
    selectedFriends: [],
    blockchain: 'arbitrum', // Default blockchain
    token: 'usdc' // Default token
  });
  
  const [errors, setErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [payeeSearchQuery, setPayeeSearchQuery] = useState('');
  const [isPayeeDropdownOpen, setIsPayeeDropdownOpen] = useState(false);
  const [isBlockchainDropdownOpen, setIsBlockchainDropdownOpen] = useState(false);
  const [isTokenDropdownOpen, setIsTokenDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const payeeDropdownRef = useRef(null);
  const blockchainDropdownRef = useRef(null);
  const tokenDropdownRef = useRef(null);

  // Blockchain options with logos
  const blockchains = [
    { 
      id: 'arbitrum', 
      name: 'Arbitrum',
      logo: arbitrumLogo,
      color: 'bg-blue-500'
    },
    { 
      id: 'ethereum', 
      name: 'Ethereum',
      logo: ethereumLogo,
      color: 'bg-gray-500'
    },
    { 
      id: 'polygon', 
      name: 'Polygon',
      logo: polygonLogo,
      color: 'bg-purple-500'
    }
  ];

  // Token options with logos
  const tokens = [
    {
      id: 'usdc',
      name: 'USDC',
      logo: usdcLogo,
      fullName: 'USD Coin'
    },
    {
      id: 'usdt',
      name: 'USDT',
      logo: usdtLogo,
      fullName: 'Tether'
    },
    {
      id: 'eth',
      name: 'ETH',
      logo: ethereumLogo,
      fullName: 'Ethereum'
    }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (payeeDropdownRef.current && !payeeDropdownRef.current.contains(event.target)) {
        setIsPayeeDropdownOpen(false);
      }
      if (blockchainDropdownRef.current && !blockchainDropdownRef.current.contains(event.target)) {
        setIsBlockchainDropdownOpen(false);
      }
      if (tokenDropdownRef.current && !tokenDropdownRef.current.contains(event.target)) {
        setIsTokenDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Generate avatar colors based on name
  const getAvatarGradient = (name) => {
    const gradients = [
      'from-blue-500 to-purple-600',
      'from-emerald-500 to-teal-600',
      'from-pink-500 to-rose-600',
      'from-orange-500 to-red-600',
      'from-indigo-500 to-blue-600',
      'from-violet-500 to-purple-600',
      'from-cyan-500 to-blue-600',
      'from-amber-500 to-orange-600',
    ];
    const index = name.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  // Filter friends based on search query and exclude already selected
  const filteredFriends = friends.filter(friend => 
    !formData.selectedFriends.includes(friend.id) &&
    (friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     friend.nickname?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Filter friends for payee dropdown
  const filteredPayeeFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(payeeSearchQuery.toLowerCase()) ||
    friend.nickname?.toLowerCase().includes(payeeSearchQuery.toLowerCase())
  );

  // Get selected friend objects
  const selectedFriendObjects = friends.filter(f => formData.selectedFriends.includes(f.id));

  // Get payee display name
  const getPayeeDisplayName = () => {
    if (formData.paidBy === 'me') return 'You';
    const payee = friends.find(f => f.id === formData.paidBy);
    return payee?.name || 'Select payee';
  };
  
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
  
  const handleAddFriend = (friendId) => {
    setFormData(prev => ({
      ...prev,
      selectedFriends: [...prev.selectedFriends, friendId]
    }));
    setSearchQuery('');
    setIsDropdownOpen(false);
    
    // Clear error when user selects friends
    if (errors.selectedFriends) {
      setErrors({
        ...errors,
        selectedFriends: ''
      });
    }
  };

  const handleRemoveFriend = (friendId) => {
    setFormData(prev => ({
      ...prev,
      selectedFriends: prev.selectedFriends.filter(id => id !== friendId)
    }));
  };

  const handleSelectPayee = (payeeId) => {
    setFormData(prev => ({
      ...prev,
      paidBy: payeeId
    }));
    setPayeeSearchQuery('');
    setIsPayeeDropdownOpen(false);
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    
    if (formData.selectedFriends.length === 0) {
      newErrors.selectedFriends = 'Select at least one friend';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      const totalAmount = parseFloat(formData.amount);
      const totalPeople = formData.selectedFriends.length + 1; // +1 for you (the person creating the split)
      const perPersonAmount = (totalAmount / totalPeople).toFixed(2);
      
      const splitData = {
        title: formData.title,
        amount: totalAmount.toFixed(2),
        perPersonAmount,
        paidBy: 'me', // Always set to 'me' since you're creating the split
        paidByName: 'You',
        blockchain: formData.blockchain,
        token: formData.token,
        participants: formData.selectedFriends.map(id => {
          const friend = friends.find(f => f.id === id);
          return {
            id: friend.id,
            name: friend.name
          };
        })
      };
      
      addSplit(splitData);
      navigate('/');
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create Split</h1>
        <p className="text-sm text-gray-500 mt-1">Split expenses with your friends</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <form onSubmit={handleSubmit}>
          <Input
            label="Title"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="What's this split for?"
            error={errors.title}
            required
          />
          
          <Input
            label="Amount"
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            error={errors.amount}
            required
          />

          {/* Blockchain Selection */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Receive Payment on
            </label>
            <div className="relative" ref={blockchainDropdownRef}>
              <button
                type="button"
                onClick={() => setIsBlockchainDropdownOpen(!isBlockchainDropdownOpen)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-left flex items-center justify-between"
              >
                <div className="flex items-center">
                  <img 
                    src={blockchains.find(b => b.id === formData.blockchain)?.logo}
                    alt={blockchains.find(b => b.id === formData.blockchain)?.name}
                    className="w-6 h-6 mr-3 rounded-full"
                  />
                  <span className="text-gray-900 font-medium">
                    {blockchains.find(b => b.id === formData.blockchain)?.name}
                  </span>
                </div>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-400 transition-transform ${isBlockchainDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Blockchain Dropdown */}
              {isBlockchainDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                  {blockchains.map(blockchain => (
                    <div
                      key={blockchain.id}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, blockchain: blockchain.id }));
                        setIsBlockchainDropdownOpen(false);
                      }}
                      className={`flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                        formData.blockchain === blockchain.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <img 
                        src={blockchain.logo} 
                        alt={blockchain.name}
                        className="w-6 h-6 mr-3 rounded-full"
                      />
                      <span className="text-sm font-medium text-gray-900">{blockchain.name}</span>
                      {formData.blockchain === blockchain.id && (
                        <svg className="w-5 h-5 ml-auto text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Token Selection */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Token
            </label>
            <div className="relative" ref={tokenDropdownRef}>
              <button
                type="button"
                onClick={() => setIsTokenDropdownOpen(!isTokenDropdownOpen)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-left flex items-center justify-between"
              >
                <div className="flex items-center">
                  <img 
                    src={tokens.find(t => t.id === formData.token)?.logo}
                    alt={tokens.find(t => t.id === formData.token)?.name}
                    className="w-6 h-6 mr-3 rounded-full"
                  />
                  <span className="text-gray-900 font-medium">
                    {tokens.find(t => t.id === formData.token)?.name}
                  </span>
                </div>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-400 transition-transform ${isTokenDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Token Dropdown */}
              {isTokenDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                  {tokens.map(token => (
                    <div
                      key={token.id}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, token: token.id }));
                        setIsTokenDropdownOpen(false);
                      }}
                      className={`flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                        formData.token === token.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <img 
                        src={token.logo} 
                        alt={token.name}
                        className="w-6 h-6 mr-3 rounded-full"
                      />
                      <span className="text-sm font-medium text-gray-900">{token.name}</span>
                      {formData.token === token.id && (
                        <svg className="w-5 h-5 ml-auto text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Split with
            </label>
            
            {friends.length > 0 ? (
              <div className="space-y-3">
                {/* Search Input with Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setIsDropdownOpen(true);
                      }}
                      onFocus={() => setIsDropdownOpen(true)}
                      placeholder="Search friends..."
                      className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <ChevronDown 
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </div>
                  
                  {/* Dropdown */}
                  {isDropdownOpen && filteredFriends.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredFriends.map(friend => (
                        <div
                          key={friend.id}
                          onClick={() => handleAddFriend(friend.id)}
                          className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${getAvatarGradient(friend.name)} flex items-center justify-center text-white font-semibold text-sm mr-3 flex-shrink-0`}>
                            {friend.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{friend.name}</p>
                            {friend.nickname && (
                              <p className="text-xs text-gray-500 truncate">@{friend.nickname}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected Friends as Chips */}
                {selectedFriendObjects.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedFriendObjects.map(friend => (
                      <div
                        key={friend.id}
                        className="inline-flex items-center bg-blue-50 border border-blue-200 rounded-full pl-1 pr-3 py-1 group hover:bg-blue-100 transition-colors"
                      >
                        <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${getAvatarGradient(friend.name)} flex items-center justify-center text-white font-semibold text-xs mr-2`}>
                          {friend.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-gray-900 mr-2">
                          {friend.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFriend(friend.id)}
                          className="w-5 h-5 rounded-full bg-blue-200 hover:bg-blue-300 flex items-center justify-center transition-colors"
                        >
                          <X className="w-3 h-3 text-blue-700" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500 mb-3">No friends added yet</p>
                <button 
                  type="button" 
                  onClick={() => navigate('/add-friend')}
                  className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Add a friend first
                </button>
              </div>
            )}
            
            {errors.selectedFriends && (
              <p className="mt-2 text-sm text-red-600">{errors.selectedFriends}</p>
            )}
          </div>
          
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
              className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
            >
              Create Split
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSplit;

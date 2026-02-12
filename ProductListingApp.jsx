import React, { useState, useEffect, useCallback } from 'react';
import * as XLSX from 'xlsx';
import './ProductListing.css';

// ============================================
// CATEGORY TREE DATA (4 LEVELS)
// ============================================
const CATEGORY_TREE = {
  'Electronics': {
    icon: '📱',
    children: {
      'Mobile & Accessories': {
        children: {
          'Smartphones': {
            children: ['Android Phones', 'iOS Phones', 'Feature Phones', 'Gaming Phones']
          },
          'Mobile Accessories': {
            children: ['Cases & Covers', 'Screen Protectors', 'Chargers & Cables', 'Power Banks']
          }
        }
      },
      'Computers & Laptops': {
        children: {
          'Laptops': {
            children: ['Gaming Laptops', 'Business Laptops', 'Ultrabooks', '2-in-1 Laptops']
          },
          'Desktop Computers': {
            children: ['Gaming PCs', 'All-in-One', 'Mini PCs', 'Workstations']
          }
        }
      },
      'Audio & Video': {
        children: {
          'Headphones & Earphones': {
            children: ['True Wireless', 'Over-Ear', 'In-Ear', 'Gaming Headsets']
          },
          'Speakers': {
            children: ['Bluetooth Speakers', 'Home Theater', 'Soundbars', 'Smart Speakers']
          }
        }
      }
    }
  },
  'Fashion': {
    icon: '👗',
    children: {
      'Men\'s Fashion': {
        children: {
          'Clothing': {
            children: ['T-Shirts', 'Shirts', 'Jeans', 'Formal Wear', 'Ethnic Wear']
          },
          'Footwear': {
            children: ['Casual Shoes', 'Formal Shoes', 'Sports Shoes', 'Sandals & Floaters']
          },
          'Accessories': {
            children: ['Watches', 'Belts', 'Wallets', 'Sunglasses', 'Bags']
          }
        }
      },
      'Women\'s Fashion': {
        children: {
          'Clothing': {
            children: ['Sarees', 'Kurtis', 'Dresses', 'Tops', 'Jeans & Trousers']
          },
          'Footwear': {
            children: ['Heels', 'Flats', 'Sandals', 'Sports Shoes', 'Casual Shoes']
          },
          'Jewellery': {
            children: ['Gold Jewellery', 'Silver Jewellery', 'Fashion Jewellery', 'Precious Stones']
          }
        }
      },
      'Kids Fashion': {
        children: {
          'Boys Clothing': {
            children: ['T-Shirts', 'Shirts', 'Jeans', 'Ethnic Wear', 'Winter Wear']
          },
          'Girls Clothing': {
            children: ['Dresses', 'Tops', 'Skirts', 'Ethnic Wear', 'Winter Wear']
          }
        }
      }
    }
  },
  'Home & Kitchen': {
    icon: '🏠',
    children: {
      'Furniture': {
        children: {
          'Living Room': {
            children: ['Sofas', 'Coffee Tables', 'TV Units', 'Recliners', 'Bean Bags']
          },
          'Bedroom': {
            children: ['Beds', 'Wardrobes', 'Dressing Tables', 'Bedside Tables', 'Mattresses']
          },
          'Office Furniture': {
            children: ['Office Chairs', 'Desks', 'Bookshelves', 'Filing Cabinets']
          }
        }
      },
      'Kitchen Appliances': {
        children: {
          'Large Appliances': {
            children: ['Refrigerators', 'Washing Machines', 'Dishwashers', 'Microwave Ovens']
          },
          'Small Appliances': {
            children: ['Mixers & Grinders', 'Electric Kettles', 'Toasters', 'Coffee Makers']
          }
        }
      },
      'Home Decor': {
        children: {
          'Wall Decor': {
            children: ['Paintings', 'Wall Stickers', 'Mirrors', 'Clocks']
          },
          'Lighting': {
            children: ['Ceiling Lights', 'Floor Lamps', 'Table Lamps', 'String Lights']
          }
        }
      }
    }
  },
  'Beauty & Personal Care': {
    icon: '💄',
    children: {
      'Skincare': {
        children: {
          'Face Care': {
            children: ['Face Wash', 'Moisturizers', 'Serums', 'Face Masks', 'Sunscreen']
          },
          'Body Care': {
            children: ['Body Lotion', 'Body Wash', 'Scrubs', 'Body Oils']
          }
        }
      },
      'Makeup': {
        children: {
          'Face Makeup': {
            children: ['Foundation', 'Compact', 'Concealer', 'Blush', 'Highlighter']
          },
          'Eye Makeup': {
            children: ['Kajal', 'Eyeliner', 'Mascara', 'Eyeshadow', 'Eyebrow Products']
          }
        }
      },
      'Haircare': {
        children: {
          'Hair Styling': {
            children: ['Hair Dryers', 'Straighteners', 'Curlers', 'Styling Products']
          },
          'Hair Treatments': {
            children: ['Shampoo', 'Conditioner', 'Hair Oil', 'Hair Masks', 'Hair Serums']
          }
        }
      }
    }
  },
  'Sports & Fitness': {
    icon: '⚽',
    children: {
      'Exercise & Fitness': {
        children: {
          'Cardio Equipment': {
            children: ['Treadmills', 'Exercise Bikes', 'Ellipticals', 'Rowing Machines']
          },
          'Strength Training': {
            children: ['Dumbbells', 'Barbells', 'Weight Plates', 'Benches', 'Home Gyms']
          },
          'Yoga & Pilates': {
            children: ['Yoga Mats', 'Yoga Blocks', 'Resistance Bands', 'Foam Rollers']
          }
        }
      },
      'Sports Equipment': {
        children: {
          'Outdoor Sports': {
            children: ['Cricket', 'Football', 'Badminton', 'Tennis', 'Cycling']
          },
          'Team Sports': {
            children: ['Basketball', 'Volleyball', 'Hockey', 'Baseball']
          }
        }
      }
    }
  }
};

// ============================================
// CATEGORY-SPECIFIC SPECIFICATIONS
// ============================================
const CATEGORY_SPECIFICATIONS = {
  'Smartphones': [
    { name: 'Operating System', type: 'select', options: ['Android', 'iOS', 'Other'], required: true },
    { name: 'RAM', type: 'select', options: ['2GB', '3GB', '4GB', '6GB', '8GB', '12GB', '16GB'], required: true },
    { name: 'Storage', type: 'select', options: ['16GB', '32GB', '64GB', '128GB', '256GB', '512GB', '1TB'], required: true },
    { name: 'Screen Size', type: 'number', unit: 'inches', required: true },
    { name: 'Battery Capacity', type: 'number', unit: 'mAh', required: true },
    { name: 'Primary Camera', type: 'number', unit: 'MP', required: true },
    { name: 'Front Camera', type: 'number', unit: 'MP', required: true },
    { name: 'Processor', type: 'text', required: true },
    { name: '5G Enabled', type: 'select', options: ['Yes', 'No'], required: true }
  ],
  'T-Shirts': [
    { name: 'Fabric', type: 'select', options: ['Cotton', 'Polyester', 'Cotton Blend', 'Linen'], required: true },
    { name: 'Fit Type', type: 'select', options: ['Regular', 'Slim', 'Loose', 'Athletic'], required: true },
    { name: 'Neck Type', type: 'select', options: ['Round Neck', 'V-Neck', 'Collar', 'Polo'], required: true },
    { name: 'Sleeve Type', type: 'select', options: ['Half Sleeve', 'Full Sleeve', 'Sleeveless'], required: true },
    { name: 'Pattern', type: 'select', options: ['Solid', 'Printed', 'Striped', 'Checked'], required: true },
    { name: 'Ideal For', type: 'select', options: ['Men', 'Women', 'Unisex'], required: true }
  ],
  'Footwear': [
    { name: 'Outer Material', type: 'select', options: ['Leather', 'Synthetic', 'Canvas', 'Mesh', 'Rubber'], required: true },
    { name: 'Sole Material', type: 'select', options: ['Rubber', 'PU', 'TPR', 'EVA', 'Leather'], required: true },
    { name: 'Closure Type', type: 'select', options: ['Lace-Up', 'Slip-On', 'Velcro', 'Zipper'], required: true },
    { name: 'Toe Shape', type: 'select', options: ['Round', 'Pointed', 'Square', 'Open'], required: true },
    { name: 'Heel Height', type: 'number', unit: 'cm', required: false }
  ],
  'Furniture': [
    { name: 'Material', type: 'select', options: ['Wood', 'Metal', 'Plastic', 'Glass', 'Fabric'], required: true },
    { name: 'Finish Type', type: 'select', options: ['Matte', 'Glossy', 'Natural', 'Polished'], required: true },
    { name: 'Assembly Required', type: 'select', options: ['Yes', 'No'], required: true },
    { name: 'Seating Capacity', type: 'number', required: false },
    { name: 'Weight Capacity', type: 'number', unit: 'kg', required: false }
  ],
  'default': [
    { name: 'Material', type: 'text', required: true },
    { name: 'Color', type: 'text', required: true },
    { name: 'Model Number', type: 'text', required: false }
  ]
};

// ============================================
// TEMPLATE IMAGES BY CATEGORY
// ============================================
const CATEGORY_IMAGES = {
  'Smartphones': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
  'T-Shirts': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
  'Footwear': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
  'Furniture': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
  'default': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function ProductListingApp() {
  const [currentGroup, setCurrentGroup] = useState(1);
  const [formData, setFormData] = useState({
    // Group 1
    category: { level1: '', level2: '', level3: '', level4: '' },
    
    // Group 2
    productStatus: 'active',
    brandType: 'none',
    customBrand: '',
    productTitle: '',
    productDescription: '',
    highlights: ['', '', '', '', ''],
    keywords: [],
    
    // Group 3
    listingType: 'simple',
    variations: [],
    simpleProduct: {
      images: [],
      sku: '',
      productCode: '',
      mrp: '',
      sellingPrice: '',
      minOrder: '1',
      maxOrder: '',
      stock: '',
      weight: '',
      length: '',
      breadth: '',
      height: ''
    },
    
    // Group 4
    specifications: {},
    customSections: [],
    
    // Group 5
    shipmentType: 'self',
    handlingType: 'normal',
    hsnCode: '',
    gstSlab: '',
    returnType: '7days',
    warrantyPeriod: '',
    sizeChart: null,
    careInstructions: []
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [keywordInput, setKeywordInput] = useState('');
  const [savedDrafts, setSavedDrafts] = useState([]);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [currentImageTarget, setCurrentImageTarget] = useState(null);

  // ============================================
  // LOAD DRAFTS FROM LOCALSTORAGE
  // ============================================
  useEffect(() => {
    const drafts = localStorage.getItem('productDrafts');
    if (drafts) {
      setSavedDrafts(JSON.parse(drafts));
    }
  }, []);

  // ============================================
  // AUTO-SAVE DRAFT
  // ============================================
  useEffect(() => {
    const timer = setTimeout(() => {
      saveDraft(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, [formData]);

  // ============================================
  // CATEGORY SELECTION HELPERS
  // ============================================
  const getSelectedCategoryPath = () => {
    const { level1, level2, level3, level4 } = formData.category;
    return [level1, level2, level3, level4].filter(Boolean).join(' > ');
  };

  const getCategorySpecifications = () => {
    const { level4, level3 } = formData.category;
    const categoryKey = level4 || level3 || 'default';
    return CATEGORY_SPECIFICATIONS[categoryKey] || CATEGORY_SPECIFICATIONS.default;
  };

  const getCategoryImage = () => {
    const { level4, level3 } = formData.category;
    const categoryKey = level4 || level3 || 'default';
    return CATEGORY_IMAGES[categoryKey] || CATEGORY_IMAGES.default;
  };

  // ============================================
  // FORM UPDATE HANDLERS
  // ============================================
  const updateFormData = (path, value) => {
    setFormData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      
      return newData;
    });
  };

  const updateHighlight = (index, value) => {
    const newHighlights = [...formData.highlights];
    newHighlights[index] = value;
    updateFormData('highlights', newHighlights);
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      updateFormData('keywords', [...formData.keywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword) => {
    updateFormData('keywords', formData.keywords.filter(k => k !== keyword));
  };

  // ============================================
  // VARIATION MANAGEMENT
  // ============================================
  const addVariation = () => {
    const newVariation = {
      id: Date.now(),
      name: '',
      type: '',
      images: [],
      sku: '',
      productCode: '',
      mrp: '',
      sellingPrice: '',
      minOrder: '1',
      maxOrder: '',
      stock: '',
      weight: '',
      length: '',
      breadth: '',
      height: ''
    };
    updateFormData('variations', [...formData.variations, newVariation]);
  };

  const updateVariation = (id, field, value) => {
    const updated = formData.variations.map(v => 
      v.id === id ? { ...v, [field]: value } : v
    );
    updateFormData('variations', updated);
  };

  const removeVariation = (id) => {
    updateFormData('variations', formData.variations.filter(v => v.id !== id));
  };

  const copyToAllVariations = (field) => {
    if (formData.variations.length === 0) return;
    
    const sourceValue = formData.variations[0][field];
    const updated = formData.variations.map(v => ({ ...v, [field]: sourceValue }));
    updateFormData('variations', updated);
  };

  // ============================================
  // IMAGE MANAGEMENT
  // ============================================
  const handleImageUpload = (files, target, variationId = null) => {
    const fileArray = Array.from(files);
    const readers = fileArray.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(images => {
      if (variationId) {
        const variation = formData.variations.find(v => v.id === variationId);
        const updatedImages = [...variation.images, ...images];
        updateVariation(variationId, 'images', updatedImages);
      } else {
        const updatedImages = [...formData.simpleProduct.images, ...images];
        updateFormData('simpleProduct.images', updatedImages);
      }
      setShowImageUpload(false);
    });
  };

  const removeImage = (index, variationId = null) => {
    if (variationId) {
      const variation = formData.variations.find(v => v.id === variationId);
      const updatedImages = variation.images.filter((_, i) => i !== index);
      updateVariation(variationId, 'images', updatedImages);
    } else {
      const updatedImages = formData.simpleProduct.images.filter((_, i) => i !== index);
      updateFormData('simpleProduct.images', updatedImages);
    }
  };

  const moveImage = (index, direction, variationId = null) => {
    const images = variationId 
      ? formData.variations.find(v => v.id === variationId).images
      : formData.simpleProduct.images;
    
    const newIndex = direction === 'left' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= images.length) return;

    const newImages = [...images];
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];

    if (variationId) {
      updateVariation(variationId, 'images', newImages);
    } else {
      updateFormData('simpleProduct.images', newImages);
    }
  };

  // ============================================
  // CUSTOM SPECIFICATIONS
  // ============================================
  const addCustomSection = () => {
    if (formData.customSections.length >= 5) {
      alert('Maximum 5 custom sections allowed');
      return;
    }

    const newSection = {
      id: Date.now(),
      name: '',
      fields: [{ id: Date.now(), name: '', value: '' }]
    };
    updateFormData('customSections', [...formData.customSections, newSection]);
  };

  const updateCustomSection = (sectionId, field, value) => {
    const updated = formData.customSections.map(s => 
      s.id === sectionId ? { ...s, [field]: value } : s
    );
    updateFormData('customSections', updated);
  };

  const addFieldToSection = (sectionId) => {
    const updated = formData.customSections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          fields: [...section.fields, { id: Date.now(), name: '', value: '' }]
        };
      }
      return section;
    });
    updateFormData('customSections', updated);
  };

  const moveField = (sectionId, fieldId, direction) => {
    const updated = formData.customSections.map(section => {
      if (section.id === sectionId) {
        const index = section.fields.findIndex(f => f.id === fieldId);
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        
        if (newIndex < 0 || newIndex >= section.fields.length) return section;

        const newFields = [...section.fields];
        [newFields[index], newFields[newIndex]] = [newFields[newIndex], newFields[index]];
        
        return { ...section, fields: newFields };
      }
      return section;
    });
    updateFormData('customSections', updated);
  };

  // ============================================
  // SAVE & EXPORT
  // ============================================
  const saveDraft = (silent = false) => {
    const draft = {
      id: Date.now(),
      data: formData,
      timestamp: new Date().toISOString(),
      title: formData.productTitle || 'Untitled Draft'
    };

    const existingDrafts = JSON.parse(localStorage.getItem('productDrafts') || '[]');
    existingDrafts.push(draft);
    localStorage.setItem('productDrafts', JSON.stringify(existingDrafts));
    
    if (!silent) {
      alert('Draft saved successfully!');
    }
  };

  const exportToExcel = () => {
    const specs = getCategorySpecifications();
    const data = {
      // Basic Info
      'Product Status': formData.productStatus,
      'Brand Type': formData.brandType,
      'Custom Brand': formData.customBrand,
      'Product Title': formData.productTitle,
      'Product Description': formData.productDescription,
      'Category': getSelectedCategoryPath(),
      
      // SEO (Hidden in UI, shown in export)
      'Meta Title': formData.productTitle,
      'Meta Description': formData.productDescription.substring(0, 160),
      'Meta Keywords': formData.keywords.join(', '),
      'URL Slug': formData.productTitle.toLowerCase().replace(/\s+/g, '-'),
      
      // Highlights
      ...formData.highlights.reduce((acc, h, i) => {
        acc[`Highlight ${i + 1}`] = h;
        return acc;
      }, {}),
      
      // Product Details
      'Listing Type': formData.listingType,
      'SKU': formData.simpleProduct.sku,
      'Product Code': formData.simpleProduct.productCode,
      'MRP': formData.simpleProduct.mrp,
      'Selling Price': formData.simpleProduct.sellingPrice,
      'Stock': formData.simpleProduct.stock,
      'Min Order': formData.simpleProduct.minOrder,
      'Max Order': formData.simpleProduct.maxOrder,
      'Weight (kg)': formData.simpleProduct.weight,
      'Dimensions (L×B×H cm)': `${formData.simpleProduct.length}×${formData.simpleProduct.breadth}×${formData.simpleProduct.height}`,
      
      // Specifications
      ...formData.specifications,
      
      // Compliance
      'Shipment Type': formData.shipmentType,
      'Handling Type': formData.handlingType,
      'HSN Code': formData.hsnCode,
      'GST Slab': formData.gstSlab,
      'Return Type': formData.returnType,
      'Warranty Period': formData.warrantyPeriod
    };

    const ws = XLSX.utils.json_to_sheet([data]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Product Listing');
    XLSX.writeFile(wb, `Product_${Date.now()}.xlsx`);
  };

  const validateGroup = (groupNumber) => {
    switch(groupNumber) {
      case 1:
        return formData.category.level1 && formData.category.level2;
      case 2:
        return formData.productTitle && formData.productDescription;
      case 3:
        if (formData.listingType === 'simple') {
          return formData.simpleProduct.mrp && formData.simpleProduct.sellingPrice && formData.simpleProduct.stock;
        }
        return formData.variations.length > 0;
      case 4:
        const specs = getCategorySpecifications();
        return specs.every(spec => !spec.required || formData.specifications[spec.name]);
      case 5:
        return formData.hsnCode && formData.gstSlab;
      default:
        return true;
    }
  };

  const navigateToGroup = (groupNumber) => {
    setCurrentGroup(groupNumber);
  };

  // ============================================
  // RENDER CATEGORY TREE
  // ============================================
  const renderCategoryTree = (categories, level = 1, parentPath = []) => {
    return Object.entries(categories).map(([name, data]) => {
      if (typeof data === 'string') {
        return (
          <div
            key={name}
            className={`category-item level-${level} ${
              formData.category[`level${level}`] === name ? 'selected' : ''
            }`}
            onClick={() => {
              updateFormData(`category.level${level}`, name);
              // Clear deeper levels
              for (let i = level + 1; i <= 4; i++) {
                updateFormData(`category.level${i}`, '');
              }
            }}
          >
            <span className="category-name">{name}</span>
          </div>
        );
      }

      const isExpanded = expandedCategories[name];
      const hasChildren = data.children && Object.keys(data.children).length > 0;

      return (
        <div key={name} className="category-group">
          <div
            className={`category-item level-${level} ${
              formData.category[`level${level}`] === name ? 'selected' : ''
            } ${hasChildren ? 'has-children' : ''}`}
            onClick={() => {
              if (hasChildren) {
                setExpandedCategories(prev => ({
                  ...prev,
                  [name]: !prev[name]
                }));
              }
              updateFormData(`category.level${level}`, name);
              // Clear deeper levels
              for (let i = level + 1; i <= 4; i++) {
                updateFormData(`category.level${i}`, '');
              }
            }}
          >
            {data.icon && <span className="category-icon">{data.icon}</span>}
            <span className="category-name">{name}</span>
            {hasChildren && (
              <span className="expand-icon">{isExpanded ? '▼' : '▶'}</span>
            )}
          </div>
          {isExpanded && hasChildren && (
            <div className="category-children">
              {renderCategoryTree(data.children, level + 1, [...parentPath, name])}
            </div>
          )}
        </div>
      );
    });
  };

  // ============================================
  // RENDER GROUPS
  // ============================================
  const renderGroup1 = () => (
    <div className="group-content">
      <h2 className="group-title">
        <span className="group-icon">📦</span>
        Category Selection
      </h2>
      <p className="group-subtitle">Choose the right category for your product</p>

      <div className="category-selection-container">
        <div className="category-selector">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="category-tree">
            {renderCategoryTree(CATEGORY_TREE)}
          </div>

          {getSelectedCategoryPath() && (
            <div className="selected-path">
              <strong>Selected:</strong> {getSelectedCategoryPath()}
            </div>
          )}
        </div>

        <div className="category-preview">
          <div className="preview-image">
            <img src={getCategoryImage()} alt="Category preview" />
          </div>
          <div className="preview-info">
            <h3>Category Information</h3>
            <p>Selected category specifications will be loaded automatically</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGroup2 = () => (
    <div className="group-content">
      <h2 className="group-title">
        <span className="group-icon">📝</span>
        Basic Product Details
      </h2>

      <div className="form-grid">
        <div className="form-group">
          <label>Product Status</label>
          <select
            value={formData.productStatus}
            onChange={(e) => updateFormData('productStatus', e.target.value)}
            className="form-control"
          >
            <option value="active">Active Listing</option>
            <option value="inactive">Inactive Listing</option>
          </select>
          <span className="field-hint">Default: Active</span>
        </div>

        <div className="form-group">
          <label>Brand Type</label>
          <select
            value={formData.brandType}
            onChange={(e) => updateFormData('brandType', e.target.value)}
            className="form-control"
          >
            <option value="none">None</option>
            <option value="generic">Generic</option>
            <option value="self">Self Brand</option>
            <option value="popular">Popular Brand</option>
          </select>
          {formData.brandType === 'self' && (
            <input
              type="text"
              placeholder="Enter your brand name"
              value={formData.customBrand}
              onChange={(e) => updateFormData('customBrand', e.target.value)}
              className="form-control mt-2"
            />
          )}
        </div>
      </div>

      <div className="form-group">
        <label className="required">Product Title</label>
        <input
          type="text"
          placeholder="e.g., Premium Wireless Bluetooth Headphones with Noise Cancellation"
          value={formData.productTitle}
          onChange={(e) => updateFormData('productTitle', e.target.value)}
          className="form-control"
          maxLength={200}
        />
        <span className="field-hint">{formData.productTitle.length}/200 characters</span>
      </div>

      <div className="form-group">
        <label className="required">Product Description</label>
        <textarea
          placeholder="Describe your product in detail. Include key features, benefits, and specifications..."
          value={formData.productDescription}
          onChange={(e) => updateFormData('productDescription', e.target.value)}
          className="form-control"
          rows={6}
          maxLength={5000}
        />
        <span className="field-hint">{formData.productDescription.length}/5000 characters</span>
      </div>

      <div className="form-group">
        <label>Product Highlights (Max 5)</label>
        {formData.highlights.map((highlight, index) => (
          <div key={index} className="highlight-input-group">
            <span className="highlight-number">{index + 1}</span>
            <input
              type="text"
              placeholder={`e.g., ${['Premium quality materials', 'Long-lasting battery', 'Ergonomic design', 'Water resistant', 'Easy to use'][index]}`}
              value={highlight}
              onChange={(e) => updateHighlight(index, e.target.value)}
              className="form-control"
            />
          </div>
        ))}
      </div>

      <div className="form-group">
        <label>Search Keywords (SEO)</label>
        <div className="keyword-input-group">
          <input
            type="text"
            placeholder="Type keyword and press Enter"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
            className="form-control"
          />
          <button type="button" onClick={addKeyword} className="btn btn-secondary">
            Add
          </button>
        </div>
        <div className="keyword-tags">
          {formData.keywords.map((keyword, index) => (
            <span key={index} className="keyword-tag">
              {keyword}
              <button onClick={() => removeKeyword(keyword)}>×</button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const renderGroup3 = () => (
    <div className="group-content">
      <h2 className="group-title">
        <span className="group-icon">📸</span>
        Product Images & Stock Details
      </h2>

      <div className="listing-type-selector">
        <label>
          <input
            type="radio"
            value="simple"
            checked={formData.listingType === 'simple'}
            onChange={(e) => updateFormData('listingType', e.target.value)}
          />
          Simple Product (Free Size)
        </label>
        <label>
          <input
            type="radio"
            value="variation"
            checked={formData.listingType === 'variation'}
            onChange={(e) => updateFormData('listingType', e.target.value)}
          />
          Variation Listing
        </label>
      </div>

      {formData.listingType === 'simple' ? (
        <div className="product-details-box">
          <ProductDetailsForm
            data={formData.simpleProduct}
            onUpdate={(field, value) => updateFormData(`simpleProduct.${field}`, value)}
            onImageUpload={(files) => handleImageUpload(files, 'simple')}
            onRemoveImage={(index) => removeImage(index)}
            onMoveImage={(index, direction) => moveImage(index, direction)}
          />
        </div>
      ) : (
        <div className="variations-container">
          {formData.variations.map((variation, index) => (
            <div key={variation.id} className="variation-box">
              <div className="variation-header">
                <h4>Variation {index + 1}</h4>
                <button
                  onClick={() => removeVariation(variation.id)}
                  className="btn btn-danger btn-sm"
                >
                  Remove
                </button>
              </div>
              <ProductDetailsForm
                data={variation}
                onUpdate={(field, value) => updateVariation(variation.id, field, value)}
                onImageUpload={(files) => handleImageUpload(files, 'variation', variation.id)}
                onRemoveImage={(index) => removeImage(index, variation.id)}
                onMoveImage={(index, direction) => moveImage(index, direction, variation.id)}
                showVariationType={true}
              />
            </div>
          ))}
          
          <button onClick={addVariation} className="btn btn-primary">
            + Add Variation
          </button>
          
          {formData.variations.length > 1 && (
            <div className="copy-actions">
              <button onClick={() => copyToAllVariations('mrp')} className="btn btn-secondary">
                Copy MRP to All
              </button>
              <button onClick={() => copyToAllVariations('weight')} className="btn btn-secondary">
                Copy Weight to All
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderGroup4 = () => {
    const specs = getCategorySpecifications();
    
    return (
      <div className="group-content">
        <h2 className="group-title">
          <span className="group-icon">📋</span>
          Product Specifications
        </h2>

        <div className="specifications-section">
          <h3>Mandatory Specifications</h3>
          <div className="form-grid">
            {specs.map((spec) => (
              <div key={spec.name} className="form-group">
                <label className={spec.required ? 'required' : ''}>
                  {spec.name}
                </label>
                {spec.type === 'select' ? (
                  <select
                    value={formData.specifications[spec.name] || ''}
                    onChange={(e) => {
                      const newSpecs = { ...formData.specifications };
                      newSpecs[spec.name] = e.target.value;
                      updateFormData('specifications', newSpecs);
                    }}
                    className="form-control"
                    required={spec.required}
                  >
                    <option value="">Select {spec.name}</option>
                    {spec.options.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <div className="input-with-unit">
                    <input
                      type={spec.type}
                      value={formData.specifications[spec.name] || ''}
                      onChange={(e) => {
                        const newSpecs = { ...formData.specifications };
                        newSpecs[spec.name] = e.target.value;
                        updateFormData('specifications', newSpecs);
                      }}
                      className="form-control"
                      placeholder={`Enter ${spec.name.toLowerCase()}`}
                      required={spec.required}
                    />
                    {spec.unit && <span className="unit-suffix">{spec.unit}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="custom-sections">
          <h3>Additional Specifications</h3>
          {formData.customSections.map((section) => (
            <div key={section.id} className="custom-section">
              <input
                type="text"
                placeholder="Section Name (e.g., Color Options)"
                value={section.name}
                onChange={(e) => updateCustomSection(section.id, 'name', e.target.value)}
                className="section-name-input"
              />
              {section.fields.map((field, index) => (
                <div key={field.id} className="custom-field">
                  <input
                    type="text"
                    placeholder="Value"
                    value={field.value}
                    onChange={(e) => {
                      const updated = formData.customSections.map(s => {
                        if (s.id === section.id) {
                          const newFields = s.fields.map(f =>
                            f.id === field.id ? { ...f, value: e.target.value } : f
                          );
                          return { ...s, fields: newFields };
                        }
                        return s;
                      });
                      updateFormData('customSections', updated);
                    }}
                    className="form-control"
                  />
                  <div className="field-actions">
                    <button onClick={() => moveField(section.id, field.id, 'up')}>↑</button>
                    <button onClick={() => moveField(section.id, field.id, 'down')}>↓</button>
                  </div>
                </div>
              ))}
              <button onClick={() => addFieldToSection(section.id)} className="btn btn-secondary btn-sm">
                + Add Field
              </button>
            </div>
          ))}
          {formData.customSections.length < 5 && (
            <button onClick={addCustomSection} className="btn btn-primary">
              + Add Custom Section
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderGroup5 = () => (
    <div className="group-content">
      <h2 className="group-title">
        <span className="group-icon">🚚</span>
        Compliance & Additional Details
      </h2>

      <div className="form-grid">
        <div className="form-group">
          <label>Shipment Type</label>
          <select
            value={formData.shipmentType}
            onChange={(e) => updateFormData('shipmentType', e.target.value)}
            className="form-control"
          >
            <option value="self">Self (Third Party Logistics)</option>
            <option value="company">By My Company</option>
          </select>
        </div>

        <div className="form-group">
          <label>Handling Type</label>
          <select
            value={formData.handlingType}
            onChange={(e) => updateFormData('handlingType', e.target.value)}
            className="form-control"
          >
            <option value="express">Express (Same Day)</option>
            <option value="normal">Normal (1-2 Days)</option>
            <option value="cheapest">Cheapest (4-5 Days)</option>
          </select>
        </div>

        <div className="form-group">
          <label className="required">HSN Code</label>
          <input
            type="text"
            placeholder="e.g., 85182200"
            value={formData.hsnCode}
            onChange={(e) => updateFormData('hsnCode', e.target.value)}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label className="required">GST Slab</label>
          <select
            value={formData.gstSlab}
            onChange={(e) => updateFormData('gstSlab', e.target.value)}
            className="form-control"
          >
            <option value="">Select GST %</option>
            <option value="0">0%</option>
            <option value="5">5%</option>
            <option value="12">12%</option>
            <option value="18">18%</option>
            <option value="28">28%</option>
          </select>
        </div>

        <div className="form-group">
          <label>Return Type</label>
          <select
            value={formData.returnType}
            onChange={(e) => updateFormData('returnType', e.target.value)}
            className="form-control"
          >
            <option value="7days">7 Days Return</option>
            <option value="15days">15 Days Return</option>
            <option value="30days">30 Days Return</option>
            <option value="no-return">No Return</option>
            <option value="exchange">Exchange Only</option>
          </select>
        </div>

        <div className="form-group">
          <label>Warranty Period</label>
          <select
            value={formData.warrantyPeriod}
            onChange={(e) => updateFormData('warrantyPeriod', e.target.value)}
            className="form-control"
          >
            <option value="">No Warranty</option>
            <option value="3months">3 Months</option>
            <option value="6months">6 Months</option>
            <option value="1year">1 Year</option>
            <option value="2years">2 Years</option>
            <option value="5years">5 Years</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Care Instructions</label>
        <div className="care-instructions">
          {['Liquid', 'Breakable', 'Heavy', 'Expensive', 'Handle with Care'].map(care => (
            <label key={care} className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.careInstructions.includes(care)}
                onChange={(e) => {
                  if (e.target.checked) {
                    updateFormData('careInstructions', [...formData.careInstructions, care]);
                  } else {
                    updateFormData('careInstructions', formData.careInstructions.filter(c => c !== care));
                  }
                }}
              />
              {care}
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  // ============================================
  // MAIN RENDER
  // ============================================
  return (
    <div className="product-listing-app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1>🛍️ Product Listing System</h1>
          <div className="header-actions">
            <button onClick={() => saveDraft(false)} className="btn btn-outline">
              💾 Save Draft
            </button>
            <button onClick={exportToExcel} className="btn btn-success">
              📊 Export to Excel
            </button>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="progress-steps">
        {[1, 2, 3, 4, 5].map(num => (
          <div
            key={num}
            className={`step ${currentGroup === num ? 'active' : ''} ${currentGroup > num ? 'completed' : ''}`}
            onClick={() => navigateToGroup(num)}
          >
            <div className="step-number">{num}</div>
            <div className="step-label">
              {['Category', 'Details', 'Images & Stock', 'Specifications', 'Compliance'][num - 1]}
            </div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="app-content">
        {currentGroup === 1 && renderGroup1()}
        {currentGroup === 2 && renderGroup2()}
        {currentGroup === 3 && renderGroup3()}
        {currentGroup === 4 && renderGroup4()}
        {currentGroup === 5 && renderGroup5()}
      </div>

      {/* Navigation */}
      <div className="app-navigation">
        {currentGroup > 1 && (
          <button onClick={() => navigateToGroup(currentGroup - 1)} className="btn btn-outline">
            ← Previous
          </button>
        )}
        <div className="nav-spacer" />
        {currentGroup < 5 ? (
          <button
            onClick={() => {
              if (validateGroup(currentGroup)) {
                navigateToGroup(currentGroup + 1);
              } else {
                alert('Please fill all required fields');
              }
            }}
            className="btn btn-primary"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={() => {
              if (validateGroup(5)) {
                saveDraft(false);
                alert('Product listing saved successfully!');
              } else {
                alert('Please fill all required fields');
              }
            }}
            className="btn btn-success"
          >
            ✓ Save Listing
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================
// PRODUCT DETAILS FORM COMPONENT
// ============================================
function ProductDetailsForm({ data, onUpdate, onImageUpload, onRemoveImage, onMoveImage, showVariationType }) {
  const fileInputRef = React.useRef();

  return (
    <div className="product-details-form">
      {showVariationType && (
        <div className="form-group">
          <label>Variation Type</label>
          <input
            type="text"
            placeholder="e.g., Color, Size, Material"
            value={data.type || ''}
            onChange={(e) => onUpdate('type', e.target.value)}
            className="form-control"
          />
        </div>
      )}

      {/* Images */}
      <div className="form-group">
        <label>Product Images</label>
        <div className="image-gallery">
          {data.images?.map((img, index) => (
            <div key={index} className="image-item">
              <img src={img} alt={`Product ${index + 1}`} />
              <div className="image-actions">
                {index > 0 && (
                  <button onClick={() => onMoveImage(index, 'left')} className="btn-icon">←</button>
                )}
                {index < data.images.length - 1 && (
                  <button onClick={() => onMoveImage(index, 'right')} className="btn-icon">→</button>
                )}
                <button onClick={() => onRemoveImage(index)} className="btn-icon btn-danger">×</button>
              </div>
            </div>
          ))}
          <div className="image-upload-box" onClick={() => fileInputRef.current?.click()}>
            <span className="upload-icon">+</span>
            <span>Add Image</span>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => onImageUpload(e.target.files)}
              style={{ display: 'none' }}
            />
          </div>
        </div>
      </div>

      <div className="form-grid-2">
        <div className="form-group">
          <label>SKU Code</label>
          <input
            type="text"
            placeholder="e.g., PROD-2024-001"
            value={data.sku || ''}
            onChange={(e) => onUpdate('sku', e.target.value)}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Product ID/Code</label>
          <input
            type="text"
            placeholder="Internal product code"
            value={data.productCode || ''}
            onChange={(e) => onUpdate('productCode', e.target.value)}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label className="required">MRP</label>
          <div className="input-with-unit">
            <input
              type="number"
              placeholder="0.00"
              value={data.mrp || ''}
              onChange={(e) => onUpdate('mrp', e.target.value)}
              className="form-control"
              step="0.01"
              min="0"
            />
            <span className="unit-suffix">₹</span>
          </div>
        </div>

        <div className="form-group">
          <label className="required">Selling Price</label>
          <div className="input-with-unit">
            <input
              type="number"
              placeholder="0.00"
              value={data.sellingPrice || ''}
              onChange={(e) => onUpdate('sellingPrice', e.target.value)}
              className="form-control"
              step="0.01"
              min="0"
            />
            <span className="unit-suffix">₹</span>
          </div>
        </div>

        <div className="form-group">
          <label>Min Order</label>
          <input
            type="number"
            placeholder="1"
            value={data.minOrder || ''}
            onChange={(e) => onUpdate('minOrder', e.target.value)}
            className="form-control"
            min="1"
          />
        </div>

        <div className="form-group">
          <label>Max Order</label>
          <input
            type="number"
            placeholder="999"
            value={data.maxOrder || ''}
            onChange={(e) => onUpdate('maxOrder', e.target.value)}
            className="form-control"
            min="1"
          />
        </div>

        <div className="form-group">
          <label className="required">Stock Count</label>
          <input
            type="number"
            placeholder="0"
            value={data.stock || ''}
            onChange={(e) => onUpdate('stock', e.target.value)}
            className="form-control"
            min="0"
          />
        </div>

        <div className="form-group">
          <label>Product Weight</label>
          <div className="input-with-unit">
            <input
              type="number"
              placeholder="0.0"
              value={data.weight || ''}
              onChange={(e) => onUpdate('weight', e.target.value)}
              className="form-control"
              step="0.01"
              min="0"
            />
            <span className="unit-suffix">kg</span>
          </div>
        </div>

        <div className="form-group">
          <label>Packed Length</label>
          <div className="input-with-unit">
            <input
              type="number"
              placeholder="0"
              value={data.length || ''}
              onChange={(e) => onUpdate('length', e.target.value)}
              className="form-control"
              min="0"
            />
            <span className="unit-suffix">cm</span>
          </div>
        </div>

        <div className="form-group">
          <label>Packed Breadth</label>
          <div className="input-with-unit">
            <input
              type="number"
              placeholder="0"
              value={data.breadth || ''}
              onChange={(e) => onUpdate('breadth', e.target.value)}
              className="form-control"
              min="0"
            />
            <span className="unit-suffix">cm</span>
          </div>
        </div>

        <div className="form-group">
          <label>Packed Height</label>
          <div className="input-with-unit">
            <input
              type="number"
              placeholder="0"
              value={data.height || ''}
              onChange={(e) => onUpdate('height', e.target.value)}
              className="form-control"
              min="0"
            />
            <span className="unit-suffix">cm</span>
          </div>
        </div>
      </div>
    </div>
  );
}

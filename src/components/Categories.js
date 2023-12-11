import '../App.css';
import React, {useState} from 'react';

function Categories() {

const [categories, setCategories] = useState([]);
const [newCategory, setNewCategory] = useState('');

const addCategory = () => {
    if (newCategory.trim() !== '' ){
        if(categories.includes(newCategory.trim())){
             alert('Category already exists.'); //Convert to toastr
        }else{
            setCategories([...categories, newCategory]);
            setNewCategory('');
        }
    }
        
}

const deleteCategory = (index) => {
    const updatedCategories = [...categories];
    updatedCategories.splice(index, 1);
    setCategories(updatedCategories);
}

  return (
    
        <div className='Categories'>
        <h2>Categories</h2>
        {categories.map((category, index) => (
            <div key={index}>
            <p className='Category Left'>{category}</p><p className='Del Right' onClick={() => deleteCategory(index)}>Del</p>
          </div>
        ))}
        

        {/* <div>
          <p className='Category Left'>Bills</p><p className='Del Right'>Del</p>
        </div>

        <div>
          <p className='Category Left'>Others</p><p className='Del Right'>Del</p>
        </div> */}

        <div>
          <input className='CategoryAdd' 
                placeholder='New Category Name' 
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)} ></input>
          <button className='Add' onClick={addCategory}>Add</button>
        </div>
      </div>
    
  );
}

export default Categories;

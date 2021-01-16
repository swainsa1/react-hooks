import React, { useState,useCallback, useEffect } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);
  useEffect(() => {
    fetch(
      "https://ingredients-efe7b-default-rtdb.firebaseio.com/ingredients-efe7b.json")
      .then(response => response.json())
      .then(responseData => {
        const loadedIngredients = [];
        for (const key in responseData) {
          loadedIngredients.push({
            id: key,
            title: responseData[key].title,
            amount: responseData[key].amount
          });
        }
        setUserIngredients(loadedIngredients);
      });
  }, []);

  //Sample use effect
  useEffect(() => {
    console.log("Ingredients JS : Rendering Ingredients", userIngredients);
  }, [userIngredients]);

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setUserIngredients(filteredIngredients);
  },[]);

  const addIngredientHandler = (ingredient) => {
    fetch(
      "https://ingredients-efe7b-default-rtdb.firebaseio.com/ingredients-efe7b.json",
      {
        method: 'POST',
        body: JSON.stringify(ingredient),
        headers: { 'Content-Type': 'application/json'}
      })
      .then(response => {
        return response.json();
      })
      .then(responseData => {
        setUserIngredients(prevIngredients => [
          ...prevIngredients,
          { id: responseData.name, ...ingredient }
        ]);
      });
  };

  const removeIngredientHandler = ingredientId =>{
    setUserIngredients(prevIngredients => 
      prevIngredients.filter(ingredient => ingredient.id!== ingredientId)
      );
  };
  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler}/>

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;

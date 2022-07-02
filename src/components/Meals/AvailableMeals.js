import React, { useEffect, useState } from 'react';
import classes from './AvailableMeals.module.css';
import Card from '../UI/Card';
import MealItem from './MealItem/MealItem';

// We want to expose the fetched data to the rest of the component and we want to re-render
// the component once the fetching is done, because thats an asyncronous task which is only
// started after the component loaded for the first time -- therefore initially there
// will be no data, and we want ot update the component once the data is there.
//
// When we have data that changes and where a component should be re-evaluated once it did
// change, we need State

export default function AvailableMeals() {
  const [meals, setMeals] = useState([]);
  // set to true because we always will start with loading data in this component
  // when the component is rendered
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState();

  // uses default GET request method
  // fetch is an asycronous request
  useEffect(() => {
    // cannot return a promise in useEffect
    // workaround in order to use async/await is create a nested function in useEffect
    const fetchMeals = async () => {
      setIsLoading(true);
      const response = await fetch(
        'https://react-http-d8501-default-rtdb.firebaseio.com/meals.json'
      );

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      // will be an object
      const responseData = await response.json();

      const loadedMeals = [];

      for (const key in responseData) {
        loadedMeals.push({
          id: key,
          name: responseData[key].name,
          description: responseData[key].description,
          price: responseData[key].price,
        });
      }

      setMeals(loadedMeals);
      setIsLoading(false);
    };

    // Using this instead of try/catch is because the promise is rejected if a new error
    // is thrown in an asyncronous request
    fetchMeals().catch(error => {
      setIsLoading(false);
      setHttpError(error.message);
    });

    // we have no dependencies, useEffect will only run when the component is first loaded
  }, []);

  if (isLoading) {
    return (
      <section className={classes.MealsLoading}>
        <p>Loading...</p>
      </section>
    );
  }

  if (httpError) {
    return (
      <section className={classes.MealsError}>
        <p>{httpError}</p>
      </section>
    );
  }

  const mealsList = meals.map(meal => (
    <MealItem
      key={meal.id}
      id={meal.id}
      name={meal.name}
      description={meal.description}
      price={meal.price}
    />
  ));
  return (
    <section className={classes.meals}>
      <Card>
        <ul>{mealsList}</ul>
      </Card>
    </section>
  );
}

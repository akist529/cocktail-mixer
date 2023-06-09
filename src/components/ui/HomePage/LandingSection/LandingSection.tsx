// Component styles
import styles from './LandingSection.module.scss';
// Local components
import SelectIngredientsLink from '@/components/links/SelectIngredientsLink/SelectIngredientsLink';
import MakeDrinkLink from '@/components/links/MakeDrinkLink/MakeDrinkLink';
import DrinkTypes from '../DrinkTypes/DrinkTypes';
// Helper functions
import getRandomDrink from '@/helpers/getRandomDrink';
// Redux components
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { setRandomDrink } from '@/store/slices/drinks.slice';
// React components
import { useEffect, useCallback } from 'react';

export default function LandingSection (props: { drinkType: string, setDrinkType: Function, drinkError: string, setDrinkError: Function }) {
    const { drinkType, setDrinkType, drinkError, setDrinkError } = props;
    const possibleDrinks = useSelector((state: RootState) => state.drinks.possible);
    const randomDrink = useSelector((state: RootState) => state.drinks.random);
    const dispatch = useDispatch();

    const handleClick = useCallback(() => {
        const drink = getRandomDrink(possibleDrinks, randomDrink);
        if (!drink) {
            setDrinkError('You don\'t have enough ingredients to make a drink!');
            const error = document.body.querySelector(`.${styles.error}`) as HTMLElement;
            error?.scrollIntoView();
        } else {
            dispatch(setRandomDrink(drink));
            const id = 'drink';
            const yOffset = -100;
            const element = document.getElementById(id);
        
            if (element) {
                const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
                window.scrollTo({top: y, behavior: 'smooth'});
            }
        }
    }, [dispatch, possibleDrinks, randomDrink, setDrinkError]);

    return (
        <section data-testid="landing-section" id="landing" className={styles.LandingSection}>
            <h1>What Can I Make?</h1>
            <nav>
                <div className={styles.landingButtons}>
                    <SelectIngredientsLink />
                    <span>Then...</span>
                    <MakeDrinkLink 
                        onClick={handleClick} />
                </div>
                <span>Or...</span>
                <DrinkTypes 
                    drinkType={drinkType} 
                    setDrinkType={setDrinkType} 
                    drinkError={drinkError} 
                    setDrinkError={setDrinkError} />
                <strong className={drinkError ? styles.error : ''}>{drinkError}</strong>
            </nav>
        </section>
    );
}
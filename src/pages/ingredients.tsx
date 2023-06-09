// Next components
import type { NextPage } from 'next';
import Head from 'next/head';
// React components
import { useEffect, useCallback } from 'react';
// Redux components
import { useSelector, useDispatch } from 'react-redux';
import { useGetAllIngredientsQuery, useLazyGetMultipleDrinkInfoQuery } from '@/store/api/api';
import { RootState } from '@/store/store';
import { addPossibleDrink, clearPossibleDrinks } from '@/store/slices/drinks.slice';
// Type interfaces
import { Item, Drink } from '@/types/index';
// Local components
import Footer from '@/components/footer/Footer';
import IngredientsSection from '@/components/ui/IngredientsPage/IngredientsSection/IngredientsSection';
import LoadingAnimation from '@/components/loading/LoadingAnimation';
import ServerError from '@/components/error/ServerError';
import IngredientsHeader from '@/components/ui/IngredientsPage/IngredientsHeader/IngredientsHeader';

const IngredientsPage: NextPage = () => {
    const allIngredients = useGetAllIngredientsQuery();
    const storedIngredients = useSelector((state: RootState) => state.ingredients.stored);
    const dispatch = useDispatch();
    const [getDrinkInfo, result] = useLazyGetMultipleDrinkInfoQuery();
    const modalOpen = useSelector((state: RootState) => state.ingredientModal.open);

    useEffect(() => {
        if (result && result.data) {
            dispatch(clearPossibleDrinks());

            for (const drink of result.data) {
                dispatch(addPossibleDrink(drink));
            }
        }
    }, [result, dispatch]);

    const getDrinks = useCallback((ids: string) => {
        var urlencoded = new URLSearchParams();
        urlencoded.append('ingredients', ids);

        fetch('https://api.makedr.ink/drinks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: urlencoded,
            redirect: 'follow'
        }).then(res => {
            return res.json();
        }).then(data => {
            const ids: number[] = [];

            data.Drinks.forEach((drink: Drink) => {
                ids.push(drink.Id);
            })

            getDrinkInfo(ids);
        }).catch(err => {
            console.log(err);
        });
    }, [getDrinkInfo]);

    useEffect(() => {
        const ingredientIds: number[] = [];

        for (const type of Object.keys(storedIngredients)) {
            for (const key of Object.keys(storedIngredients[type])) {
                for (let i = 0; i < storedIngredients[type][key].length; i++) {
                    const id = storedIngredients[type][key][i].Id;
                    
                    if (id) {
                        ingredientIds.push(id);
                    }
                }
            }
        }

        if (ingredientIds.length) {
            getDrinks(ingredientIds.join());
        }
    }, [storedIngredients, getDrinks, dispatch]);

    return (
        <main className='page' {...modalOpen && {style: {height: '100%', overflowY: 'hidden', filter: 'blur(3px)'}}}>
        { allIngredients.data && 
            <><Head>
                <title>Select Ingredients - MakeDrink</title>
            </Head>
            <IngredientsHeader />
            <IngredientsSection 
                section='Alcohol' 
                ingredients={(allIngredients.data as Item[])} />
            <IngredientsSection 
                section='Mixers' 
                ingredients={(allIngredients.data as Item[])} />
            <Footer /></> }
        { allIngredients.isLoading &&
            <LoadingAnimation /> }
        { allIngredients.isError &&
            <ServerError /> }
        </main>
    );
}

export default IngredientsPage;
